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
            // Log but do not reject — older webhooks may not include signature headers
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


// ─────────────────────────────────────────────────────────────────────────────
// SMS OTP — Forgot Password (ported from smsotp repo)
// Uses: JustCall v2.1 API, Firestore otp_codes + otp_rate_limits
// ─────────────────────────────────────────────────────────────────────────────

const JWT_SECRET = process.env.JWT_SECRET || 'rhive_otp_reset_secret_at_least_32_chars_long';

/** Normalise any phone format → E.164 */
function normalizePhone(phone) {
    if (!phone) return '';
    const trimmed = phone.trim();
    const digits = trimmed.replace(/\D/g, '');
    if (trimmed.startsWith('+')) return `+${digits}`;
    if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
    if (digits.length === 10) return `+1${digits}`;
    return `+${digits}`;
}

/** Simple HMAC-SHA256 JWT using Node's built-in crypto */
function base64url(buf) {
    return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}
function signResetJWT(payload) {
    const header = base64url(Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
    const now = Math.floor(Date.now() / 1000);
    const body = base64url(Buffer.from(JSON.stringify({ ...payload, iat: now, exp: now + 600 }))); // 10-min token
    const sig = base64url(crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest());
    return `${header}.${body}.${sig}`;
}
function verifyResetJWT(token) {
    try {
        const [header, body, sig] = token.split('.');
        const expected = base64url(crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest());
        if (sig !== expected) return null;
        const payload = JSON.parse(Buffer.from(body, 'base64').toString());
        if (payload.exp < Math.floor(Date.now() / 1000)) return null;
        return payload;
    } catch { return null; }
}

/**
 * sendSmsOtp
 * POST body: { phone }
 * - Rate limits: 3 requests/minute per phone
 * - Generates 6-digit OTP, stores in Firestore, sends via JustCall SMS
 */
exports.sendSmsOtp = functions.runWith({ secrets: ['JUSTCALL_API_KEY', 'JUSTCALL_API_SECRET', 'JUSTCALL_FROM_NUMBER'] }).https.onRequest((req, res) => {
    return cors(req, res, async () => {
        if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

        const { phone } = req.body;
        if (!phone) return res.status(400).json({ error: 'Missing phone number' });

        const normalizedPhone = normalizePhone(phone);
        if (!normalizedPhone || normalizedPhone.length < 8) {
            return res.status(400).json({ error: 'Invalid phone number format' });
        }

        try {
            const db = admin.firestore();
            const now = Date.now();
            const oneMinuteAgo = now - 60000;

            // ── Rate Limiting (3 per minute per phone) ──────────────────────
            const rateLimitRef = db.collection('otp_rate_limits').doc(normalizedPhone.replace(/\+/g, ''));
            const rateLimitSnap = await rateLimitRef.get();
            let timestamps = [];
            if (rateLimitSnap.exists) {
                const data = rateLimitSnap.data();
                if (data && Array.isArray(data.timestamps)) {
                    timestamps = data.timestamps.filter(ts => ts >= oneMinuteAgo);
                }
            }
            if (timestamps.length >= 3) {
                return res.status(429).json({ error: 'Too many OTP requests. Please wait a minute before trying again.' });
            }
            timestamps.push(now);
            await rateLimitRef.set({ timestamps });

            // ── Verify user exists in Firestore users collection ─────────────
            const usersSnap = await db.collection('users').where('phone', '==', normalizedPhone).limit(1).get();
            if (usersSnap.empty) {
                // Also try without normalizing (stored formats may vary)
                const usersSnap2 = await db.collection('users').where('phone', '==', phone.trim()).limit(1).get();
                if (usersSnap2.empty) {
                    return res.status(404).json({ error: 'No account found with this phone number.' });
                }
            }

            // ── Generate 6-digit OTP ─────────────────────────────────────────
            const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = new Date(now + 5 * 60000).toISOString(); // 5 minutes

            // ── Save OTP to Firestore ────────────────────────────────────────
            const otpDocId = normalizedPhone.replace(/\+/g, '');
            await db.collection('otp_codes').doc(otpDocId).set({
                code: otpCode,
                expiresAt,
                phone: normalizedPhone,
                purpose: 'password_reset',
                createdAt: new Date().toISOString()
            });

            // ── Send SMS via JustCall v2.1 ───────────────────────────────────
            // Read inline at call time so runtime env vars are picked up
            const apiKey = process.env.JUSTCALL_API_KEY || '';
            const apiSecret = process.env.JUSTCALL_API_SECRET || '';
            const fromNumber = process.env.JUSTCALL_FROM_NUMBER || '';
            let smsSent = false;
            let smsError = '';

            console.log('[sendSmsOtp] JustCall config:', {
                apiKeySet: !!apiKey,
                apiSecretSet: !!apiSecret,
                fromNumber: fromNumber || 'NOT SET'
            });

            if (apiKey && apiSecret && fromNumber) {
                try {
                    let formattedFrom = fromNumber.trim();
                    if (!formattedFrom.startsWith('+')) {
                        if (formattedFrom.length === 11 && formattedFrom.startsWith('1')) formattedFrom = `+${formattedFrom}`;
                        else if (formattedFrom.length === 10) formattedFrom = `+1${formattedFrom}`;
                    }

                    const payload = {
                        justcall_number: formattedFrom,
                        contact_number: normalizedPhone,
                        body: `Your RHIVE password reset code is: ${otpCode}. This code expires in 5 minutes.`
                    };

                    const response = await axios.post('https://api.justcall.io/v2.1/texts/new', payload, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `${apiKey}:${apiSecret}`
                        },
                        timeout: 10000
                    });

                    if (response.status >= 200 && response.status < 300) {
                        smsSent = true;
                        console.log('[sendSmsOtp] JustCall SMS sent successfully:', response.data);
                    } else {
                        smsError = response.data?.message || JSON.stringify(response.data);
                        console.error('[sendSmsOtp] JustCall error:', response.data);
                    }
                } catch (smsErr) {
                    smsError = smsErr.response?.data?.message || smsErr.message;
                    console.error('[sendSmsOtp] JustCall request failed:', smsError);
                }
            } else {
                // Dev/demo mode: log OTP to console
                console.log(`\n==================================================`);
                console.log(`[SMS SIMULATION] To: ${normalizedPhone}`);
                console.log(`[SMS SIMULATION] Code: ${otpCode}`);
                console.log(`==================================================\n`);
                smsSent = true; // allow flow to continue in dev
            }

            if (!smsSent) {
                return res.status(502).json({
                    error: `Failed to send SMS: ${smsError}. Check JustCall credentials in functions/.env`
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Verification code sent to your phone.',
                // Only return code in dev (no JustCall configured)
                code: (apiKey && apiSecret && fromNumber) ? undefined : otpCode
            });

        } catch (error) {
            console.error('[sendSmsOtp] Error:', error);
            return res.status(500).json({ error: error.message });
        }
    });
});

/**
 * verifySmsOtp
 * POST body: { phone, code }
 * - Validates OTP, deletes it (single-use)
 * - Returns a short-lived JWT reset token
 */
exports.verifySmsOtp = functions.runWith({ secrets: ['JUSTCALL_API_KEY', 'JUSTCALL_API_SECRET', 'JUSTCALL_FROM_NUMBER'] }).https.onRequest((req, res) => {
    return cors(req, res, async () => {
        if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

        const { phone, code } = req.body;
        if (!phone || !code) return res.status(400).json({ error: 'Missing phone or code' });

        const normalizedPhone = normalizePhone(phone);
        const otpDocId = normalizedPhone.replace(/\+/g, '');

        try {
            const db = admin.firestore();
            const otpRef = db.collection('otp_codes').doc(otpDocId);
            const otpSnap = await otpRef.get();

            if (!otpSnap.exists) {
                return res.status(400).json({ error: 'Invalid or expired verification code.' });
            }

            const otpData = otpSnap.data();

            // Check code match
            if (otpData.code !== code.trim()) {
                return res.status(400).json({ error: 'Incorrect verification code. Please try again.' });
            }

            // Check expiration
            if (new Date() > new Date(otpData.expiresAt)) {
                await otpRef.delete();
                return res.status(400).json({ error: 'Verification code has expired. Please request a new one.' });
            }

            // Single-use: delete OTP after successful verification
            await otpRef.delete();

            // Find user email by phone to pass to password reset service
            const usersSnap = await db.collection('users').where('phone', '==', normalizedPhone).limit(1).get();
            let userEmail = null;
            let userId = null;
            if (!usersSnap.empty) {
                const userData = usersSnap.docs[0].data();
                userEmail = userData.email || null;
                userId = usersSnap.docs[0].id;
            }

            // Issue a short-lived reset JWT (10 minutes)
            const resetToken = signResetJWT({ phone: normalizedPhone, email: userEmail, userId, purpose: 'password_reset' });

            return res.status(200).json({
                success: true,
                resetToken, // Used by PasswordResetPage to call completePasswordReset
                email: userEmail
            });

        } catch (error) {
            console.error('[verifySmsOtp] Error:', error);
            return res.status(500).json({ error: error.message });
        }
    });
});

/**
 * completePasswordReset
 * POST body: { resetToken, newPassword }
 * - Validates the JWT reset token (issued by verifySmsOtp)
 * - Updates the user's password in Firebase Auth using Admin SDK
 */
exports.completePasswordReset = functions.runWith({ secrets: ['JUSTCALL_API_KEY', 'JUSTCALL_API_SECRET', 'JUSTCALL_FROM_NUMBER'] }).https.onRequest((req, res) => {
    return cors(req, res, async () => {
        if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

        const { resetToken, newPassword } = req.body;
        if (!resetToken || !newPassword) {
            return res.status(400).json({ error: 'Missing resetToken or newPassword' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters.' });
        }

        // Validate the JWT token
        const payload = verifyResetJWT(resetToken);
        if (!payload) {
            return res.status(401).json({ error: 'Invalid or expired reset token. Please start over.' });
        }

        // Ensure this token is specifically for password reset
        if (payload.purpose !== 'password_reset') {
            return res.status(403).json({ error: 'Token is not valid for password reset.' });
        }

        const { email, phone, userId } = payload;

        try {
            let firebaseUid = userId || null;

            // 1. Try to find Firebase Auth user by email
            if (!firebaseUid && email) {
                try {
                    const userRecord = await admin.auth().getUserByEmail(email);
                    firebaseUid = userRecord.uid;
                } catch (e) {
                    console.warn('[completePasswordReset] User not found by email in Auth:', email, e.message);
                }
            }

            // 2. Fallback: try by phone number
            if (!firebaseUid && phone) {
                try {
                    const userRecord = await admin.auth().getUserByPhoneNumber(phone);
                    firebaseUid = userRecord.uid;
                } catch (e) {
                    console.warn('[completePasswordReset] User not found by phone in Auth:', phone, e.message);
                }
            }

            // 3. Fallback: look up in Firestore users collection if we have email or phone
            if (!firebaseUid) {
                const db = admin.firestore();
                let userQuery = null;
                if (email) {
                    userQuery = await db.collection('users').where('email', '==', email).limit(1).get();
                }
                if ((!userQuery || userQuery.empty) && phone) {
                    userQuery = await db.collection('users').where('phone', '==', phone).limit(1).get();
                }
                if (userQuery && !userQuery.empty) {
                    const userData = userQuery.docs[0].data();
                    firebaseUid = userData.firebaseUid || userData.uid || userQuery.docs[0].id;
                }
            }

            if (!firebaseUid) {
                return res.status(404).json({ error: 'Could not locate the user account to reset.' });
            }

            // 4. Update password in Firebase Auth
            await admin.auth().updateUser(firebaseUid, { password: newPassword });
            console.log(`[completePasswordReset] Password updated in Firebase Auth for UID: ${firebaseUid} (email: ${email})`);

            // 5. Also update password_hash in Firestore user doc
            //    (The app login checks Firestore password_hash via SHA-256, NOT Firebase Auth)
            try {
                const db = admin.firestore();
                const sha256Hash = crypto.createHash('sha256').update(newPassword).digest('hex');

                // Find the Firestore user doc by UID (doc ID matches Firebase Auth UID)
                const userDocRef = db.collection('users').doc(firebaseUid);
                const userDocSnap = await userDocRef.get();

                if (userDocSnap.exists) {
                    await userDocRef.update({
                        password_hash: sha256Hash,
                        updated_at: new Date().toISOString()
                    });
                    console.log(`[completePasswordReset] password_hash updated in Firestore for UID: ${firebaseUid}`);
                } else {
                    // Fallback: find by email or phone
                    let userQuery = null;
                    if (email) {
                        userQuery = await db.collection('users').where('email', '==', email).limit(1).get();
                    }
                    if ((!userQuery || userQuery.empty) && phone) {
                        userQuery = await db.collection('users').where('phone', '==', phone).limit(1).get();
                    }
                    if (userQuery && !userQuery.empty) {
                        await userQuery.docs[0].ref.update({
                            password_hash: sha256Hash,
                            updated_at: new Date().toISOString()
                        });
                        console.log(`[completePasswordReset] password_hash updated in Firestore (fallback lookup) for: ${email || phone}`);
                    } else {
                        console.warn(`[completePasswordReset] Could not find Firestore user doc to update password_hash for UID: ${firebaseUid}`);
                    }
                }
            } catch (hashErr) {
                console.warn('[completePasswordReset] Failed to update Firestore password_hash:', hashErr.message);
            }

            // 6. Log the action to Firestore
            try {
                await admin.firestore().collection('user_log').add({
                    actionType: 'USER_PASSWORD_RESET',
                    description: `Password reset via SMS OTP for phone: ${phone}`,
                    userId: firebaseUid,
                    userName: email || phone || 'Unknown',
                    userRole: 'User',
                    payload: { phone, email },
                    timestamp: new Date().toISOString()
                });
            } catch (logErr) {
                console.warn('[completePasswordReset] Failed to write log:', logErr.message);
            }

            return res.status(200).json({ success: true, message: 'Password updated successfully.' });

        } catch (error) {
            console.error('[completePasswordReset] Error:', error);
            return res.status(500).json({ error: error.message });
        }
    });
});

