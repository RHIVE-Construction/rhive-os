require('dotenv').config();
const functions = require('firebase-functions/v1');
const admin = require('firebase-admin');
const { GoogleGenAI } = require('@google/genai');
const axios = require('axios');
const crypto = require('crypto');

admin.initializeApp();
const cors = require('cors')({ origin: true });

// Configuration
const JUSTCALL_API_KEY = process.env.JUSTCALL_API_KEY;
const JUSTCALL_API_SECRET = process.env.JUSTCALL_API_SECRET;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Mailgun Configuration (set via: firebase functions:secrets:set MAILGUN_API_KEY + MAILGUN_DOMAIN)
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
// Always send from the official RHIVE support address
const MAILGUN_FROM_EMAIL = 'RHIVE Support <support@rhiveconstruction.com>';

let genAI = null;
if (GEMINI_API_KEY) {
    try {
        const { GoogleGenAI } = require('@google/genai');
        genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    } catch (e) {
        console.error("Failed to initialize GoogleGenAI:", e.message);
    }
}

/**
 * Generates variations of a phone number to improve lookup success.
 * Handles formats like: +14636346346, 4636346346, (463) 634-6346, 463-634-6346
 */
function getPhoneVariations(phone) {
    if (!phone) return [];
    const variations = new Set();
    const cleanPhone = String(phone).trim();
    
    // 1. Original
    variations.add(cleanPhone);
    
    // 2. Digits only
    const digits = cleanPhone.replace(/\D/g, '');
    if (digits) {
        variations.add(digits);
        
        // 3. Handle US Numbers (10 or 11 digits)
        let tenDigits = "";
        if (digits.length === 10) tenDigits = digits;
        else if (digits.length === 11 && digits.startsWith('1')) tenDigits = digits.substring(1);

        if (tenDigits) {
            variations.add(tenDigits);
            variations.add(`1${tenDigits}`);
            variations.add(`+1${tenDigits}`);
            // Dashboard format: (463) 634-6346
            variations.add(`(${tenDigits.substring(0, 3)}) ${tenDigits.substring(3, 6)}-${tenDigits.substring(6)}`);
            // Dash format: 463-634-6346
            variations.add(`${tenDigits.substring(0, 3)}-${tenDigits.substring(3, 6)}-${tenDigits.substring(6)}`);
        }
    }
    
    return Array.from(variations).slice(0, 10); // Firestore 'in' operator limit is 10
}

/**
 * 1. JustCall Lookup (For AI Agent)
 * JustCall hits this to get details about a caller in real-time.
 */
exports.justCallLookup = functions.https.onRequest((req, res) => {
    return cors(req, res, async () => {
        const phoneNumber = req.query.phone || req.body.phone;
        if (!phoneNumber) return res.status(400).json({ error: "No phone number provided" });

        try {
            const db = admin.firestore();

            // 1. Search Contacts (using flexible variations)
            const variations = getPhoneVariations(phoneNumber);
            const contactSnapshot = await db.collection('contacts').where('phone', 'in', variations).limit(1).get();
            let customerData = null;
            let contactId = null;

            if (!contactSnapshot.empty) {
                customerData = contactSnapshot.docs[0].data();
                contactId = contactSnapshot.docs[0].id;
            }

            // 2. Search Projects (Check both 'project' and 'projects' as per user notes)
            let projectData = null;
            if (customerData && customerData.project_id) {
                const pDoc = await db.collection('project').doc(customerData.project_id).get();
                if (pDoc.exists) projectData = pDoc.data();
                else {
                    const pDoc2 = await db.collection('projects').doc(customerData.project_id).get();
                    if (pDoc2.exists) projectData = pDoc2.data();
                }
            }

            // 3. Prepare context for Gemini
            const customerName = customerData ? `${customerData.first_name} ${customerData.last_name}` : "Unknown (New Lead)";
            const customerStatus = projectData ? projectData.status : (customerData ? customerData.status : "New");
            const lastProject = projectData ? (projectData.name || "Untitled Project") : (customerData ? (customerData.last_project || "None") : "None");

            const prompt = `You are the AI Voice Agent for RHIVE Construction. 
            Customer: ${customerName}, 
            Status: ${customerStatus}, 
            Current Project: ${lastProject}. 
            Generate a brief (max 15 words) personalized greeting. 
            Format: Just the text.`;

            let personalizedGreeting = `Hello, thanks for calling RHIVE Construction. How can I help you?`;
            if (GEMINI_API_KEY && genAI) {
                try {
                    const result = await genAI.models.generateContent({
                        model: "gemini-1.5-flash",
                        contents: [{ parts: [{ text: prompt }] }]
                    });

                    if (result && result.candidates && result.candidates[0]) {
                        personalizedGreeting = result.candidates[0].content.parts[0].text.trim().replace(/["]+/g, '');
                    }
                } catch (e) { console.error("Gemini Error", e); }
            }

            return res.status(200).json({
                found: !!customerData,
                firstName: customerData ? customerData.first_name : "Guest",
                lastName: customerData ? customerData.last_name : "",
                personalizedGreeting,
                status: customerStatus,
                lastProject,
                projectId: customerData ? customerData.project_id : null
            });
        } catch (error) {
            console.error("JustCall Lookup Error:", error);
            return res.status(500).json({ error: error.message });
        }
    });
});

/**
 * 1b. JustCall Information Query (Enhanced)
 * A more detailed endpoint for JustCall bots to fetch full project/property details.
 */
exports.justCallInformation = functions.https.onRequest((req, res) => {
    return cors(req, res, async () => {
        const phoneNumber = req.query.phone || req.body.phone;
        if (!phoneNumber) return res.status(400).json({ error: "No phone number provided" });

        try {
            const db = admin.firestore();

            // 1. Fetch Contact (using flexible variations)
            const variations = getPhoneVariations(phoneNumber);
            const contactSnapshot = await db.collection('contacts').where('phone', 'in', variations).limit(1).get();
            
            if (contactSnapshot.empty) {
                return res.status(200).json({ found: false, message: "No contact found for this number.", tried: variations });
            }

            const contact = { id: contactSnapshot.docs[0].id, ...contactSnapshot.docs[0].data() };

            // 2. Fetch Project(s)
            let projects = [];
            if (contact.project_id) {
                const p1 = await db.collection('project').doc(contact.project_id).get();
                if (p1.exists) projects.push({ id: p1.id, ...p1.data() });

                const p2 = await db.collection('projects').doc(contact.project_id).get();
                if (p2.exists) projects.push({ id: p2.id, ...p2.data() });
            } else {
                // Search by contact ID in case project_id isn't on contact but contact_id is on project
                const q1 = await db.collection('project').where('contact_id', '==', contact.id).get();
                q1.forEach(doc => projects.push({ id: doc.id, ...doc.data() }));

                const q2 = await db.collection('projects').where('contact_id', '==', contact.id).get();
                q2.forEach(doc => projects.push({ id: doc.id, ...doc.data() }));
            }

            // 3. Fetch Property Details (if exists as a separate collection)
            let propertiesList = [];
            for (const proj of projects) {
                if (proj.property_id) {
                    const propDoc = await db.collection('properties').doc(proj.property_id).get();
                    if (propDoc.exists) propertiesList.push({ id: propDoc.id, ...propDoc.data() });
                }
                // Also check if property info is nested in project
                if (proj.property && !propertiesList.some(p => p.address === proj.property.address)) {
                    propertiesList.push(proj.property);
                }
            }

            // 4. Summarize for AI Bot
            const contextSummary = `
                Customer: ${contact.first_name} ${contact.last_name}
                Email: ${contact.email || 'N/A'}
                Projects: ${projects.map(p => `${p.name} (Status: ${p.status || 'Unknown'})`).join(', ') || 'None'}
                Properties: ${propertiesList.map(p => p.address || p.property_address || 'Unknown').join(', ') || 'None'}
            `.trim();

            return res.status(200).json({
                found: true,
                contact,
                projects,
                properties: propertiesList,
                contextSummary
            });
        } catch (error) {
            console.error("JustCall Info Error:", error);
            return res.status(500).json({ error: error.message });
        }
    });
});

/**
 * 2. Sync Firebase -> JustCall
 * Automatically adds contacts to JustCall when created in Firebase.
 */
exports.onContactCreatedSyncToJustCall = functions.firestore
    .document('contacts/{contactId}')
    .onCreate(async (snapshot, context) => {
        const data = snapshot.data();

        if (!JUSTCALL_API_KEY || !JUSTCALL_API_SECRET) {
            console.error("JustCall API Keys not set in environment.");
            return null;
        }

        try {
            await axios.post('https://api.justcall.io/v1/contacts', {
                first_name: data.first_name,
                last_name: data.last_name,
                phone: data.phone,
                email: data.email || ""
            }, {
                headers: {
                    'Authorization': `${JUSTCALL_API_KEY}:${JUSTCALL_API_SECRET}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log(`Successfully synced ${data.first_name} to JustCall.`);
        } catch (error) {
            console.error("Error syncing to JustCall:", error.response?.data || error.message);
        }
    });

/**
 * Helper: Verify JustCall Dynamic Webhook Signature (SHA256)
 * Docs: https://developer.justcall.io/docs/dynamic-webhook-signatures
 *
 * JustCall signs each webhook with:
 *   payload = SECRET | encodeURIComponent(webhook_url) | event_type | timestamp
 *   signature = HMAC-SHA256(payload, SECRET)
 */
function verifyJustCallSignature(req, body) {
    const incomingSignature = req.headers['x-justcall-signature'];
    const timestamp = req.headers['x-justcall-request-timestamp'];
    const webhookUrl = body.webhook_url;
    const eventType = body.type;

    if (!incomingSignature || !timestamp || !webhookUrl || !eventType) {
        console.warn('JustCall signature verification: missing required headers/fields.');
        return false;
    }

    const secret = JUSTCALL_API_SECRET;
    const encodedUrl = encodeURIComponent(webhookUrl);
    const payload = `${secret}|${encodedUrl}|${eventType}|${timestamp}`;
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

    const signatureMatch = crypto.timingSafeEqual(
        Buffer.from(incomingSignature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
    );

    if (!signatureMatch) {
        console.warn('JustCall signature mismatch! Possible spoofed request.');
    }
    return signatureMatch;
}

/**
 * 3. JustCall -> Firebase (Call & SMS Logging with Signature Verification)
 * Receives verified webhooks from JustCall and logs them to Firestore.
 */
exports.justCallWebhook = functions.https.onRequest((req, res) => {
    return cors(req, res, async () => {
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method Not Allowed' });
        }

        const body = req.body;
        const signatureVersion = req.headers['x-justcall-signature-version'];

        // --- Signature Verification (v1) ---
        if (signatureVersion === 'v1') {
            if (!verifyJustCallSignature(req, body)) {
                return res.status(401).json({ error: 'Invalid webhook signature.' });
            }
        } else {
            // Log but do not reject â€” older webhooks may not include signature headers
            console.warn('No x-justcall-signature-version header. Proceeding without verification.');
        }

        const eventType = body.type || body.event;
        const db = admin.firestore();

        try {
            // --- Handle Call Events ---
            // Supported: call.completed, call.answered, call.initiated, call.ringing
            if (eventType && eventType.startsWith('call.')) {
                const d = body.data || {};
                const callData = {
                    event_type: eventType,
                    // Caller / callee info (using JustCall's actual field names)
                    contact_number: d.contact_number || null,
                    contact_name: d.contact_name || null,
                    contact_email: d.contact_email || null,
                    justcall_number: d.justcall_number || null,
                    justcall_line_name: d.justcall_line_name || null,
                    // Agent info
                    agent_id: d.agent_id || null,
                    agent_name: d.agent_name || null,
                    agent_email: d.agent_email || null,
                    // Call details
                    call_id: d.id || null,
                    call_sid: d.call_sid || null,
                    call_date: d.call_date || null,
                    call_time: d.call_time || null,
                    duration: d.duration || null,
                    direction: d.direction || null,
                    call_type: d.call_type || null,
                    recording_url: d.recording_url || null,
                    transcript: d.transcript || '',
                    // Metadata
                    justcall_request_id: body.request_id || null,
                    timestamp: admin.firestore.FieldValue.serverTimestamp()
                };
                await db.collection('call_logs').add(callData);
                console.log(`Call event '${eventType}' logged to Firestore.`);
                return res.status(200).json({ success: true, message: 'Call logged.' });
            }

            // --- Handle SMS Events ---
            if (eventType && eventType.startsWith('sms.')) {
                const d = body.data || {};
                const smsData = {
                    event_type: eventType,
                    contact_number: d.contact_number || d.from || null,
                    contact_name: d.contact_name || null,
                    justcall_number: d.justcall_number || d.to || null,
                    message: d.message || d.content || '',
                    agent_name: d.agent_name || null,
                    sms_id: d.id || null,
                    justcall_request_id: body.request_id || null,
                    timestamp: admin.firestore.FieldValue.serverTimestamp()
                };
                await db.collection('sms_logs').add(smsData);
                console.log(`SMS event '${eventType}' logged to Firestore.`);
                return res.status(200).json({ success: true, message: 'SMS logged.' });
            }

            // --- Unknown event: acknowledge receipt ---
            console.log('Unhandled JustCall event type:', eventType);
            return res.status(200).json({ message: `Event '${eventType}' received but not processed.` });

        } catch (e) {
            console.error('JustCall Webhook Handler Error:', e.message);
            return res.status(500).json({ error: e.message });
        }
    });
});



// -----------------------------------------------------------------------------
// MAILGUN — OTP-BASED PASSWORD RESET
// -----------------------------------------------------------------------------

/**
 * Helper: sends an email via Mailgun REST API using axios.
 * No extra npm package needed — axios is already a dependency.
 */
async function sendMailgunEmail({ to, subject, html, text }) {
    if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
        throw new Error('Mailgun is not configured. Set MAILGUN_API_KEY and MAILGUN_DOMAIN secrets.');
    }

    const FormData = require('form-data');
    const form = new FormData();
    form.append('from', MAILGUN_FROM_EMAIL);
    form.append('to', to);
    form.append('subject', subject);
    form.append('html', html);
    if (text) form.append('text', text);

    const response = await axios.post(
        `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`,
        form,
        {
            auth: { username: 'api', password: MAILGUN_API_KEY },
            headers: form.getHeaders(),
        }
    );
    return response.data;
}

/**
 * Builds the RHIVE-branded password reset link email HTML.
 */
function buildResetLinkEmailHtml(resetLink, expiryMinutes = 60) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Your RHIVE Password</title>
  <style>
    body { margin: 0; padding: 0; background: #0a0a0a; font-family: Arial, sans-serif; }
    .wrapper { max-width: 560px; margin: 40px auto; background: #0a0a0a; border: 1px solid #374151; }
    .accent-bar { height: 3px; background: linear-gradient(90deg, #ec028b, #08137C); }
    .header { padding: 32px 40px 24px; border-bottom: 1px solid #1f2937; }
    .logo { font-size: 22px; font-weight: 900; letter-spacing: 0.3em; color: #fff; text-transform: uppercase; font-family: 'Courier New', monospace; }
    .logo span { color: #ec028b; }
    .tagline { font-size: 10px; letter-spacing: 0.4em; color: #4b5563; text-transform: uppercase; margin-top: 4px; }
    .body { padding: 40px; }
    .label { font-size: 10px; letter-spacing: 0.4em; color: #6b7280; text-transform: uppercase; margin-bottom: 8px; }
    .title { font-size: 22px; font-weight: 900; color: #fff; margin: 0 0 16px; }
    .intro { font-size: 14px; color: #9ca3af; line-height: 1.7; margin-bottom: 32px; }
    .btn-wrap { text-align: center; margin-bottom: 32px; }
    .btn { display: inline-block; background: #ec028b; color: #fff; font-size: 14px; font-weight: 700; text-decoration: none; padding: 16px 40px; letter-spacing: 0.05em; }
    .link-fallback { background: #111; border: 1px solid #1f2937; padding: 16px 20px; margin-bottom: 28px; }
    .link-fallback p { font-size: 11px; color: #6b7280; margin: 0 0 8px; }
    .link-fallback a { font-size: 11px; color: #ec028b; word-break: break-all; }
    .expiry { font-size: 12px; color: #6b7280; text-align: center; margin-bottom: 28px; }
    .expiry strong { color: #ec028b; }
    .warning { background: #111; border-left: 2px solid #374151; padding: 14px 18px; font-size: 12px; color: #6b7280; line-height: 1.6; }
    .footer { padding: 24px 40px; border-top: 1px solid #1f2937; text-align: center; }
    .footer p { font-size: 11px; color: #374151; margin: 4px 0; }
    .footer a { color: #ec028b; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="accent-bar"></div>
    <div class="header">
      <div class="logo">R<span>H</span>IVE</div>
      <div class="tagline">Construction Management Platform</div>
    </div>
    <div class="body">
      <div class="label">Password Reset</div>
      <h1 class="title">Reset Your Password</h1>
      <p class="intro">
        We received a request to reset the password for your RHIVE account.
        Click the button below to create a new password. This link is valid for
        <strong style="color:#fff">${expiryMinutes} minutes</strong>.
      </p>
      <div class="btn-wrap">
        <a href="${resetLink}" class="btn">Reset My Password</a>
      </div>
      <div class="link-fallback">
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <a href="${resetLink}">${resetLink}</a>
      </div>
      <div class="expiry">Link expires in <strong>${expiryMinutes} minutes</strong></div>
      <div class="warning">
        If you didn't request a password reset, you can safely ignore this email.
        Your account password has not been changed.
      </div>
    </div>
    <div class="footer">
      <p>RHIVE Construction &mdash; <a href="mailto:support@rhiveconstruction.com">support@rhiveconstruction.com</a></p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * 4. Send Password Reset Link via Mailgun
 * Called from the frontend when user submits their email on the forgot-password page.
 * Generates a secure token, stores it in Firestore, and emails the user a clickable
 * reset link. Returns only { success: true } — the token is never sent to the browser.
 */
exports.sendPasswordResetLink = functions
    .runWith({ secrets: ['MAILGUN_API_KEY', 'MAILGUN_DOMAIN'] })
    .https.onRequest((req, res) => {
    return cors(req, res, async () => {
        if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

        const { email } = req.body;
        if (!email || typeof email !== 'string') {
            return res.status(400).json({ success: false, error: 'Email is required.' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const db = admin.firestore();

        try {
            // 1. Verify the user exists in Firestore
            const snapshot = await db.collection('users')
                .where('email', '==', normalizedEmail)
                .limit(1)
                .get();

            if (snapshot.empty) {
                // Return success regardless (prevents email enumeration attacks)
                console.log(`OTP request for non-existent user: ${normalizedEmail}`);
                return res.status(200).json({ success: true });
            }

            const userDoc = snapshot.docs[0];
            const userId = userDoc.id;

            // 2. Rate-limit: block if a reset email was sent less than 60 seconds ago
            const userData = userDoc.data();
            if (userData.reset_sent_at) {
                const sentAt = new Date(userData.reset_sent_at).getTime();
                const secondsAgo = (Date.now() - sentAt) / 1000;
                if (secondsAgo < 60) {
                    return res.status(429).json({
                        success: false,
                        error: `Please wait ${Math.ceil(60 - secondsAgo)}s before requesting another link.`
                    });
                }
            }

            // 3. Generate a secure reset token (60-min expiry)
            const resetToken = crypto.randomBytes(32).toString('hex') + Date.now().toString(36);
            const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000).toISOString();

            // 4. Store token on the user document
            await db.collection('users').doc(userId).update({
                reset_token: resetToken,
                reset_token_expiry: tokenExpiry,
                reset_sent_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            });

            // 5. Build the reset link — points to the deployed app
            const appBaseUrl = 'https://rhive-os.web.app';
            const resetLink = `${appBaseUrl}/?page=P-07&token=${resetToken}`;

            // 6. Send the link email via Mailgun
            await sendMailgunEmail({
                to: normalizedEmail,
                subject: 'Reset Your RHIVE Password',
                html: buildResetLinkEmailHtml(resetLink, 60),
                text: `Reset your RHIVE password by visiting this link:\n\n${resetLink}\n\nThis link expires in 60 minutes.\n\nIf you did not request this, you can safely ignore this email.\n\nRHIVE Support — support@rhiveconstruction.com`,
            });

            console.log(`Password reset link sent to ${normalizedEmail}`);
            return res.status(200).json({ success: true });

        } catch (error) {
            console.error('sendPasswordResetLink error:', error.message);
            return res.status(500).json({ success: false, error: 'Failed to send reset link. Please try again.' });
        }
    });
});


