require('dotenv').config();
const functions = require('firebase-functions/v1');
const admin = require('firebase-admin');
const { GoogleGenAI } = require('@google/genai');
const axios = require('axios');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

admin.initializeApp();
const cors = require('cors')({ origin: true });

// Configuration
const JUSTCALL_API_KEY = process.env.JUSTCALL_API_KEY;
const JUSTCALL_API_SECRET = process.env.JUSTCALL_API_SECRET;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

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
            // Log but do not reject Ã¢â‚¬â€ older webhooks may not include signature headers
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

/**
 * 4. sendPasswordResetEmail
 * Accepts { email } only â€” reads OTP from Firestore server-side.
 * Rate-limited (3/hr), no user enumeration, Gmail credentials from env.
 */
exports.sendPasswordResetEmail = functions.https.onRequest((req, res) => {
    return cors(req, res, async () => {
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method Not Allowed' });
        }

        const { email } = req.body;
        if (!email || typeof email !== 'string') {
            return res.status(200).json({ success: true });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const db = admin.firestore();

        try {
            // â”€â”€ 1. Rate Limiting (max 3 per email per hour) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            const rateLimitRef = db.collection('password_reset_rate_limits').doc(
                crypto.createHash('sha256').update(normalizedEmail).digest('hex')
            );
            const rateLimitDoc = await rateLimitRef.get();
            const now = Date.now();
            const oneHour = 3600 * 1000;

            if (rateLimitDoc.exists) {
                const { count, window_start } = rateLimitDoc.data();
                if ((now - window_start) < oneHour && count >= 3) {
                    console.warn('[sendPasswordResetEmail] Rate limit exceeded.');
                    return res.status(200).json({ success: true });
                }
                if ((now - window_start) >= oneHour) {
                    await rateLimitRef.set({ count: 1, window_start: now });
                } else {
                    await rateLimitRef.update({ count: admin.firestore.FieldValue.increment(1) });
                }
            } else {
                await rateLimitRef.set({ count: 1, window_start: now });
            }

            // â”€â”€ 2. Read OTP directly from Firestore â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            const usersSnap = await db.collection('users')
                .where('email', '==', normalizedEmail)
                .limit(1)
                .get();

            if (usersSnap.empty) {
                console.log('[sendPasswordResetEmail] No user found. Suppressing.');
                return res.status(200).json({ success: true });
            }

            const userDoc = usersSnap.docs[0].data();

            if (!userDoc.reset_otp || !userDoc.reset_otp_expiry) {
                console.warn('[sendPasswordResetEmail] No OTP on user doc. Suppressing.');
                return res.status(200).json({ success: true });
            }

            if (new Date(userDoc.reset_otp_expiry).getTime() < now) {
                console.warn('[sendPasswordResetEmail] OTP expired. Suppressing.');
                return res.status(200).json({ success: true });
            }

            // ── 3. Send OTP email ─────────────────────────────────────────────
            // Production sender: always support@rhiveconstruction.com
            const SENDER_EMAIL = 'support@rhiveconstruction.com';
            const gmailUser = process.env.GMAIL_USER || SENDER_EMAIL;
            const gmailPass = process.env.GMAIL_APP_PASSWORD;

            let transporter;
            let fromAddress = '"RHIVE QOS Security" <' + SENDER_EMAIL + '>';
            let isTestMode = false;

            if (gmailPass) {
                // Production: Gmail SMTP with App Password
                transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: { user: gmailUser, pass: gmailPass }
                });
            } else {
                // Dev fallback: Ethereal test SMTP (no Gmail App Password needed)
                console.log('[sendPasswordResetEmail] Gmail App Password not set — using Ethereal test SMTP.');
                const testAccount = await nodemailer.createTestAccount();
                transporter = nodemailer.createTransport({
                    host: 'smtp.ethereal.email',
                    port: 587,
                    secure: false,
                    auth: { user: testAccount.user, pass: testAccount.pass }
                });
                fromAddress = '"RHIVE QOS Security" <' + testAccount.user + '>';
                isTestMode = true;
            }

            const displayName = userDoc.name || userDoc.display_name || normalizedEmail.split('@')[0];
            const otp = userDoc.reset_otp;
            const otpFormatted = otp.slice(0, 3) + ' ' + otp.slice(3);

            const htmlBody = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>'
                + '<title>RHIVE QOS Verification Code</title></head>'
                + '<body style="margin:0;padding:0;background:#000;font-family:Arial,sans-serif;">'
                + '<table width="100%" cellpadding="0" cellspacing="0" style="background:#000;padding:40px 0;"><tr><td align="center">'
                + '<table width="520" cellpadding="0" cellspacing="0" style="border:1px solid #374151;background:#000;max-width:520px;width:100%;">'
                + '<tr><td style="background:linear-gradient(90deg,#ec028b,#08137C);height:3px;"></td></tr>'
                + '<tr><td style="padding:28px 36px 20px;border-bottom:1px solid #1f2937;">'
                + '<span style="color:#ec028b;font-size:20px;font-weight:900;letter-spacing:0.15em;text-transform:uppercase;">RHIVE</span>'
                + '<span style="color:#6b7280;font-size:9px;letter-spacing:0.35em;text-transform:uppercase;margin-left:8px;">Quantum OS</span>'
                + '</td></tr>'
                + '<tr><td style="padding:32px 36px;">'
                + '<p style="color:#ec028b;font-size:9px;font-weight:900;letter-spacing:0.4em;text-transform:uppercase;margin:0 0 10px;">Password Recovery</p>'
                + '<h1 style="color:#fff;font-size:20px;font-weight:900;margin:0 0 16px;text-transform:uppercase;">Your Verification Code</h1>'
                + '<p style="color:#9ca3af;font-size:13px;line-height:1.7;margin:0 0 28px;">Hello <strong style="color:#fff;">' + displayName + '</strong>,<br/>'
                + 'Use the 6-digit code below to reset your password. Expires in <strong style="color:#ec028b;">15 minutes</strong>.</p>'
                + '<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">'
                + '<tr><td align="center" style="background:#0a0a0a;border:1px solid #ec028b;border-left:3px solid #ec028b;padding:28px 20px;">'
                + '<p style="color:#6b7280;font-size:9px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;margin:0 0 12px;">VERIFICATION CODE</p>'
                + '<p style="color:#fff;font-size:48px;font-weight:900;font-family:monospace;letter-spacing:0.3em;margin:0;line-height:1;">' + otpFormatted + '</p>'
                + '<p style="color:#4b5563;font-size:10px;font-family:monospace;margin:12px 0 0;">Expires in 15 minutes</p>'
                + '</td></tr></table>'
                + '<p style="color:#4b5563;font-size:11px;line-height:1.6;">If you did not request this, ignore this email. Never share this code.</p>'
                + '</td></tr>'
                + '<tr><td style="padding:16px 36px;border-top:1px solid #1f2937;">'
                + '<p style="color:#374151;font-size:9px;text-transform:uppercase;text-align:center;margin:0;">RHIVE Industries 2025 - Do Not Forward</p>'
                + '</td></tr>'
                + '<tr><td style="background:linear-gradient(90deg,#08137C,#ec028b);height:2px;"></td></tr>'
                + '</table></td></tr></table></body></html>';

            const info = await transporter.sendMail({
                from: fromAddress,
                to: normalizedEmail,
                subject: otp + ' - Your RHIVE QOS Verification Code',
                html: htmlBody,
                text: 'RHIVE QOS\n\nHello ' + displayName + ',\nVerification code: ' + otpFormatted + '\nExpires in 15 minutes.\nRHIVE Industries 2025'
            });

            if (isTestMode) {
                const previewUrl = nodemailer.getTestMessageUrl(info);
                console.log('[sendPasswordResetEmail] TEST MODE â€” preview email at:', previewUrl);
                // Return preview URL so it can be surfaced during development
                return res.status(200).json({ success: true, testMode: true, previewUrl });
            }

            console.log('[sendPasswordResetEmail] OTP email sent.');
            return res.status(200).json({ success: true });

        } catch (error) {
            console.error('[sendPasswordResetEmail] Error:', error.message);
            return res.status(500).json({ error: 'Failed to send recovery email.' });
        }
    });
});

