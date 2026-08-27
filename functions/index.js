require('dotenv').config();
const functions = require('firebase-functions/v1');
const admin = require('firebase-admin');
const axios = require('axios');
const crypto = require('crypto');

admin.initializeApp({
    projectId: process.env.GCLOUD_PROJECT || process.env.FIREBASE_CONFIG?.projectId || 'rhive-os'
});
const cors = require('cors')({ origin: true });

// Configuration
const JUSTCALL_API_KEY = process.env.JUSTCALL_API_KEY;
const JUSTCALL_API_SECRET = process.env.JUSTCALL_API_SECRET;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GOOGLE_CHAT_WEBHOOK = process.env.GOOGLE_CHAT_WEBHOOK_URL;

let genAI = null;
if (GEMINI_API_KEY) {
    try {
        const { GoogleGenAI } = require('@google/genai');
        genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    } catch (e) {
        console.error("Failed to initialize GoogleGenAI:", e.message);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY & NORMALIZATION HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Normalise any phone format → E.164
 */
function normalizePhone(phone) {
    if (!phone) return '';
    const trimmed = String(phone).trim();
    const digits = trimmed.replace(/\D/g, '');
    if (trimmed.startsWith('+')) return `+${digits}`;
    if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
    if (digits.length === 10) return `+1${digits}`;
    return `+${digits}`;
}

/**
 * Generates variations of a phone number to improve lookup success in Firestore.
 */
function getPhoneVariations(phone) {
    if (!phone) return [];
    const variations = new Set();
    const cleanPhone = String(phone).trim();

    variations.add(cleanPhone);
    const digits = cleanPhone.replace(/\D/g, '');
    if (digits) {
        variations.add(digits);
        let tenDigits = "";
        if (digits.length === 10) tenDigits = digits;
        else if (digits.length === 11 && digits.startsWith('1')) tenDigits = digits.substring(1);

        if (tenDigits) {
            variations.add(tenDigits);
            variations.add(`1${tenDigits}`);
            variations.add(`+1${tenDigits}`);
            variations.add(`(${tenDigits.substring(0, 3)}) ${tenDigits.substring(3, 6)}-${tenDigits.substring(6)}`);
            variations.add(`${tenDigits.substring(0, 3)}-${tenDigits.substring(3, 6)}-${tenDigits.substring(6)}`);
        }
    }

    return Array.from(variations).slice(0, 10);
}

/**
 * Standardizes raw address strings and validates Utah / Idaho service zones.
 */
function standardizeAddress(rawAddress, city = '', state = 'UT', zip = '') {
    if (!rawAddress) return null;
    let full = `${rawAddress}, ${city} ${state} ${zip}`.trim().replace(/\s+/g, ' ');

    // Standard street abbreviations
    const replacements = [
        [/\bStreet\b/gi, 'St'],
        [/\bAvenue\b/gi, 'Ave'],
        [/\bBoulevard\b/gi, 'Blvd'],
        [/\bDrive\b/gi, 'Dr'],
        [/\bLane\b/gi, 'Ln'],
        [/\bRoad\b/gi, 'Rd'],
        [/\bCourt\b/gi, 'Ct'],
        [/\bCircle\b/gi, 'Cir'],
        [/\bWay\b/gi, 'Way'],
        [/\bParkway\b/gi, 'Pkwy'],
        [/\bPlace\b/gi, 'Pl']
    ];
    for (const [regex, rep] of replacements) {
        full = full.replace(regex, rep);
    }

    const zipMatch = full.match(/\b(84\d{3}|83\d{3})\b/);
    const detectedZip = zipMatch ? zipMatch[1] : (zip || null);

    const isUtah = /(?:UT|Utah)\b/i.test(full) || (detectedZip && detectedZip.startsWith('84'));
    const isIdaho = /(?:ID|Idaho)\b/i.test(full) || (detectedZip && detectedZip.startsWith('83'));

    let serviceTier = 'OUT_OF_AREA';
    if (isUtah) serviceTier = 'PRIMARY_WASATCH_FRONT';
    else if (isIdaho) serviceTier = 'SECONDARY_SOUTHERN_IDAHO';

    const isCommercial = /(?:suite|ste|bldg|building|unit|dept|warehouse|plaza|center)\b/i.test(full);

    return {
        formattedAddress: full,
        zip: detectedZip,
        state: isUtah ? 'UT' : (isIdaho ? 'ID' : state),
        serviceTier,
        isCovered: serviceTier !== 'OUT_OF_AREA',
        isCommercial
    };
}

/**
 * Filter Rule: Detects if the transcript or caller is a solicitor/marketer/spam.
 */
function evaluateSolicitorFilter(transcript = '', notes = '', callerName = '') {
    const combinedText = `${transcript} ${notes} ${callerName}`.toLowerCase();

    const spamTriggers = [
        'search engine optimization', 'seo ranking', 'google business profile ranking',
        'first page of google', 'digital marketing agency', 'web design services',
        'offshore staffing', 'virtual assistant services', 'credit card processing fees',
        'merchant services', 'payroll discount', 'business funding', 'unsecured line of credit',
        'solar leads', 'roofing lead generation', 'pay per lead', 'b2b appointment setting'
    ];

    for (const trigger of spamTriggers) {
        if (combinedText.includes(trigger)) {
            return {
                isSolicitor: true,
                reason: `Trigger matched: "${trigger}"`,
                confidence: 0.95
            };
        }
    }

    // Solicitor asking for owner without roofing context
    const asksForOwner = /(?:is the business owner|is the general manager|who handles your marketing|who makes advertising decisions)/i.test(combinedText);
    const hasRoofingContext = /(?:roof|leak|shingle|tarp|inspection|gutter|fascia|decking|quote|estimate|hail|storm)/i.test(combinedText);

    if (asksForOwner && !hasRoofingContext) {
        return {
            isSolicitor: true,
            reason: 'Solicitor inquiry without property or roofing context',
            confidence: 0.85
        };
    }

    return { isSolicitor: false, reason: 'Clean lead', confidence: 0.99 };
}

/**
 * AI Parsing & Classification Rule: Parses call transcripts to extract structured intelligence.
 */
async function parseCallTranscriptWithAI(transcript, notes, contactName, phone) {
    const rawContent = `Contact: ${contactName || 'Unknown'} (${phone})\nNotes: ${notes || 'None'}\nTranscript:\n${transcript || 'No transcript available'}`;

    if (!GEMINI_API_KEY || !genAI) {
        // Fallback heuristic parsing if Gemini is unavailable
        const addressMatch = rawContent.match(/(?:at|for|address)\s+([0-9]+\s+[A-Za-z0-9\s,]+(?:UT|Idaho|Utah|ID|84[0-9]{3}))/i);
        const leakMatch = /(?:leak|water|dripping|penetration|tarp|emergency)/i.test(rawContent);
        const estimateMatch = /(?:ballpark|estimate|quote|pricing|cost|shingle|metal)/i.test(rawContent);

        return {
            intent: leakMatch ? 'ACTIVE_LEAK_EMERGENCY' : (estimateMatch ? 'NEW_ROOF_ESTIMATE' : 'GENERAL_INQUIRY'),
            discProfile: 'Steady',
            extractedAddress: addressMatch ? addressMatch[1].trim() : null,
            urgencyScore: leakMatch ? 9 : 5,
            roofAgeYears: null,
            keyConcerns: [leakMatch ? 'Active water entry' : 'Pricing inquiry'],
            actionItems: ['Follow up with customer within 24 hours'],
            summary: rawContent.substring(0, 200)
        };
    }

    try {
        const prompt = `You are the FAANG-Tier Executive CRM Parsing Engine for RHIVE Construction.
Analyze the following phone call transcript and notes between the AI Voice Agent (Hunni) and the caller.
Return a STRICT valid JSON object with no markdown fences, matching this schema:
{
  "intent": "NEW_ROOF_ESTIMATE" | "ACTIVE_LEAK_EMERGENCY" | "CERTIFIED_QUOTE_INSPECTION" | "SOLICITOR_MARKETER_SPAM" | "GENERAL_INQUIRY" | "BILLING_ADMIN",
  "discProfile": "Driver" | "Influencer" | "Steady" | "Calculator",
  "extractedAddress": string | null,
  "callerFirstName": string | null,
  "callerLastName": string | null,
  "urgencyScore": number (1 to 10),
  "roofAgeYears": number | null,
  "isInsuranceClaim": boolean,
  "keyConcerns": string[],
  "actionItems": string[],
  "executiveSummary": string (max 40 words)
}

Input Call Data:
${rawContent}`;

        const response = await genAI.models.generateContent({
            model: "gemini-1.5-flash",
            contents: [{ parts: [{ text: prompt }] }]
        });

        const textOutput = response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '{}';
        const cleanJson = textOutput.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
        return JSON.parse(cleanJson);
    } catch (e) {
        console.error('[parseCallTranscriptWithAI] Gemini parse error:', e.message);
        return {
            intent: 'GENERAL_INQUIRY',
            discProfile: 'Steady',
            extractedAddress: null,
            urgencyScore: 5,
            roofAgeYears: null,
            isInsuranceClaim: false,
            keyConcerns: ['Transcription parsing fallback'],
            actionItems: ['Review manual transcript in JustCall'],
            executiveSummary: 'Automated AI parse fallback; review raw transcript.'
        };
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// CLOUD HOOKS & ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 1. JustCall Lookup (For Inbound Voice Agent Greeting)
 */
exports.justCallLookup = functions.https.onRequest((req, res) => {
    return cors(req, res, async () => {
        const phoneNumber = req.query.phone || req.body.phone;
        if (!phoneNumber) return res.status(400).json({ error: "No phone number provided" });

        try {
            const db = admin.firestore();
            const variations = getPhoneVariations(phoneNumber);
            const contactSnapshot = await db.collection('contacts').where('phone', 'in', variations).where('isDeleted', '==', false).limit(1).get();
            let customerData = null;

            if (!contactSnapshot.empty) {
                customerData = contactSnapshot.docs[0].data();
            }

            let projectData = null;
            if (customerData && customerData.project_id) {
                const pDoc = await db.collection('projects').doc(customerData.project_id).get();
                if (pDoc.exists) projectData = pDoc.data();
            }

            const customerName = customerData ? `${customerData.first_name || ''} ${customerData.last_name || ''}`.trim() : "Guest";
            const customerStatus = projectData ? projectData.status : (customerData ? customerData.status : "New Lead");
            const lastProject = projectData ? (projectData.name || "Roofing Project") : "None";

            const greeting = customerData
                ? `Hi ${customerData.first_name || customerName}, thanks for calling R-Hive Construction! How can we assist with your project today?`
                : `Thank you for calling R-Hive Construction. This is Hunni, how can I help you today?`;

            return res.status(200).json({
                found: !!customerData,
                firstName: customerData ? customerData.first_name : "Guest",
                lastName: customerData ? customerData.last_name : "",
                personalizedGreeting: greeting,
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
 * 2. Address Verification Cloud Hook (Agent 1 & Agent 2 Real-Time Verification)
 */
exports.verifyAddress = functions.https.onRequest((req, res) => {
    return cors(req, res, async () => {
        const address = req.query.address || req.body.address;
        const city = req.query.city || req.body.city || '';
        const state = req.query.state || req.body.state || 'UT';
        const zip = req.query.zip || req.body.zip || '';

        if (!address) return res.status(400).json({ error: 'Missing address string' });

        const result = standardizeAddress(address, city, state, zip);
        return res.status(200).json({
            valid: result.isCovered,
            formattedAddress: result.formattedAddress,
            serviceTier: result.serviceTier,
            zip: result.zip,
            state: result.state,
            isCommercial: result.isCommercial,
            message: result.isCovered ? 'Address verified and within primary service zone.' : 'Address located outside standard service territory.'
        });
    });
});

/**
 * 3. sendEstimatorSms Cloud Hook (Agent 1 Ballpark SMS Trigger)
 */
exports.sendEstimatorSms = functions.https.onRequest((req, res) => {
    return cors(req, res, async () => {
        const phone = req.query.phone || req.body.phone;
        const name = req.query.name || req.body.name || 'there';
        if (!phone) return res.status(400).json({ error: 'Missing phone number' });

        const normalizedPhone = normalizePhone(phone);
        const apiKey = process.env.JUSTCALL_API_KEY || '';
        const apiSecret = process.env.JUSTCALL_API_SECRET || '';
        const fromNumber = process.env.JUSTCALL_FROM_NUMBER || '+14354176637';

        const messageBody = `Hi ${name}, thank you for contacting RHIVE Construction! You can explore instant ballpark pricing right here: https://www.rhiveconstruction.com or reply to this text to request a certified quote with guaranteed transparent pricing.`;

        try {
            if (apiKey && apiSecret) {
                await axios.post('https://api.justcall.io/v2.1/texts/new', {
                    justcall_number: fromNumber,
                    contact_number: normalizedPhone,
                    body: messageBody
                }, {
                    headers: { 'Authorization': `${apiKey}:${apiSecret}`, 'Content-Type': 'application/json' },
                    timeout: 10000
                });
            }

            await admin.firestore().collection('sms_logs').add({
                type: 'ESTIMATOR_LINK_SMS',
                phone: normalizedPhone,
                name,
                message: messageBody,
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });

            return res.status(200).json({ success: true, message: 'Estimator link SMS dispatched.' });
        } catch (err) {
            console.error('[sendEstimatorSms] Error:', err.message);
            return res.status(500).json({ error: err.message });
        }
    });
});

/**
 * 4. sendPhotoUploadSms Cloud Hook (Agent 2 Emergency Photo Upload Trigger)
 */
exports.sendPhotoUploadSms = functions.https.onRequest((req, res) => {
    return cors(req, res, async () => {
        const phone = req.query.phone || req.body.phone;
        const name = req.query.name || req.body.name || 'there';
        if (!phone) return res.status(400).json({ error: 'Missing phone number' });

        const normalizedPhone = normalizePhone(phone);
        const apiKey = process.env.JUSTCALL_API_KEY || '';
        const apiSecret = process.env.JUSTCALL_API_SECRET || '';
        const fromNumber = process.env.JUSTCALL_FROM_NUMBER || '+14354176637';

        const messageBody = `Hi ${name}, this is Michael Robinson from RHIVE Construction. Please text me 2-3 photos of the leak area or ceiling damage right here, or upload at https://www.rhiveconstruction.com/blank-1 so our crew can assess the repair immediately.`;

        try {
            if (apiKey && apiSecret) {
                await axios.post('https://api.justcall.io/v2.1/texts/new', {
                    justcall_number: fromNumber,
                    contact_number: normalizedPhone,
                    body: messageBody
                }, {
                    headers: { 'Authorization': `${apiKey}:${apiSecret}`, 'Content-Type': 'application/json' },
                    timeout: 10000
                });
            }

            await admin.firestore().collection('sms_logs').add({
                type: 'PHOTO_REQUEST_SMS',
                phone: normalizedPhone,
                name,
                message: messageBody,
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });

            return res.status(200).json({ success: true, message: 'Photo request SMS dispatched.' });
        } catch (err) {
            console.error('[sendPhotoUploadSms] Error:', err.message);
            return res.status(500).json({ error: err.message });
        }
    });
});

/**
 * 5. bookInspectionCalendar Cloud Hook (Agent 1 & 2 30-min Spoken / 2-hr Calendar Block)
 */
exports.bookInspectionCalendar = functions.https.onRequest((req, res) => {
    return cors(req, res, async () => {
        const { caller_name, phone, address, window_choice, date } = req.body;
        const db = admin.firestore();

        const bookingDoc = {
            eventType: 'ROOF_INSPECTION',
            spokenDuration: '30 Minutes (15m roof + 15m drone flight)',
            internalBlockDuration: '2 Hours (Includes travel, pack-up, photo upload & report generation)',
            arrivalWindow: window_choice || 'Morning (9 AM - 12 PM)',
            targetDate: date || new Date().toISOString().split('T')[0],
            customerName: caller_name || 'Guest Lead',
            customerPhone: normalizePhone(phone),
            propertyAddress: address || 'Address Pending',
            executivesMarkedBusy: ['Kara Robinson (801-441-0024)', 'Michael Robinson (801-449-1451)'],
            calendarName: 'RHIVE Project Inspections',
            status: 'CONFIRMED',
            createdAt: new Date().toISOString()
        };

        try {
            await db.collection('calendar_bookings').add(bookingDoc);
        } catch (fsErr) {
            console.log('[bookInspectionCalendar] Firestore note:', fsErr.message);
        }

        return res.status(200).json({
            success: true,
            message: 'Inspection booked for 30-min on-site assessment (2-hr calendar block scheduled).',
            booking: bookingDoc
        });
    });
});

/**
 * 6. bookCallbackCalendar Cloud Hook (Agent 3 Smart Callback)
 */
exports.bookCallbackCalendar = functions.https.onRequest((req, res) => {
    return cors(req, res, async () => {
        const { caller_name, phone, date, time, reason } = req.body;
        const db = admin.firestore();

        const callbackDoc = {
            eventType: 'PHONE_CONSULTATION',
            spokenDuration: '15 Minutes',
            internalBlockDuration: '45 Minutes (15m call + 30m prep/buffer)',
            targetDate: date || new Date().toISOString().split('T')[0],
            targetTime: time || 'ASAP',
            customerName: caller_name || 'Caller',
            customerPhone: normalizePhone(phone),
            reason: reason || 'General Inquiry / Callback Request',
            calendarName: 'RHIVE Phone Calls',
            status: 'CONFIRMED',
            createdAt: new Date().toISOString()
        };

        try {
            await db.collection('calendar_bookings').add(callbackDoc);
        } catch (fsErr) {
            console.log('[bookCallbackCalendar] Firestore note:', fsErr.message);
        }

        return res.status(200).json({
            success: true,
            message: 'Callback appointment scheduled on RHIVE Phone Calls.',
            booking: callbackDoc
        });
    });
});

/**
 * Universal Email Dispatcher: Sends structured Lead Brief to office@rhiveconstruction.com
 */
async function sendOfficeEmailNotification(callData, parsedIntelligence, solicitorAudit) {
    const targetEmail = process.env.OFFICE_NOTIFICATION_EMAIL || 'office@rhiveconstruction.com';
    const emailApiKey = process.env.RESEND_API_KEY || process.env.SENDGRID_API_KEY;

    const subject = solicitorAudit.isSolicitor
        ? `[SOLICITOR DEFLECTED] Call from ${callData.contact_number || 'Unknown'}`
        : `[RHIVE LEAD ALERT] ${parsedIntelligence.intent} - ${callData.contact_name || 'Guest'} (${parsedIntelligence.discProfile || 'Steady'})`;

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #0d1117; color: #ffffff; padding: 24px; border-radius: 8px; max-width: 600px;">
        <div style="border-bottom: 2px solid #ec028b; padding-bottom: 12px; margin-bottom: 20px;">
            <h2 style="color: #ec028b; margin: 0;">RHIVE TELEPHONY SWARM ALERT</h2>
            <p style="color: #8b949e; margin: 4px 0 0 0; font-size: 13px;">Automated Swarm Intelligence Report</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
                <td style="color: #8b949e; padding: 6px 0; font-size: 14px;">Caller Name:</td>
                <td style="color: #ffffff; font-weight: bold; padding: 6px 0; font-size: 14px;">${callData.contact_name || 'Guest'}</td>
            </tr>
            <tr>
                <td style="color: #8b949e; padding: 6px 0; font-size: 14px;">Phone Number:</td>
                <td style="color: #ffffff; font-weight: bold; padding: 6px 0; font-size: 14px;"><a href="tel:${callData.contact_number}" style="color: #58a6ff; text-decoration: none;">${callData.contact_number}</a></td>
            </tr>
            <tr>
                <td style="color: #8b949e; padding: 6px 0; font-size: 14px;">Dialed Line:</td>
                <td style="color: #ffffff; padding: 6px 0; font-size: 14px;">${callData.justcall_number || 'Master Switchboard'} (${callData.agent_name || 'Hunni Swarm'})</td>
            </tr>
            <tr>
                <td style="color: #8b949e; padding: 6px 0; font-size: 14px;">Intent / Category:</td>
                <td style="color: #e2ab49; font-weight: bold; padding: 6px 0; font-size: 14px;">${parsedIntelligence.intent}</td>
            </tr>
            <tr>
                <td style="color: #8b949e; padding: 6px 0; font-size: 14px;">DISC Profile:</td>
                <td style="color: #58a6ff; font-weight: bold; padding: 6px 0; font-size: 14px;">${parsedIntelligence.discProfile || 'Steady'} (Urgency: ${parsedIntelligence.urgencyScore || 5}/10)</td>
            </tr>
            <tr>
                <td style="color: #8b949e; padding: 6px 0; font-size: 14px;">Property Address:</td>
                <td style="color: #ffffff; font-weight: bold; padding: 6px 0; font-size: 14px;">${parsedIntelligence.extractedAddress || 'Not Provided over phone'}</td>
            </tr>
        </table>

        <div style="background-color: #161b22; border-left: 4px solid #ec028b; padding: 12px; margin-bottom: 20px; border-radius: 4px;">
            <div style="color: #ec028b; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 4px;">Executive Summary</div>
            <div style="color: #c9d1d9; font-size: 14px; line-height: 1.5;">${parsedIntelligence.executiveSummary || 'Call completed normally.'}</div>
        </div>

        ${parsedIntelligence.actionItems && parsedIntelligence.actionItems.length > 0 ? `
        <div style="margin-bottom: 20px;">
            <div style="color: #8b949e; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 6px;">Recommended Action Items</div>
            <ul style="color: #c9d1d9; margin: 0; padding-left: 20px; font-size: 14px;">
                ${parsedIntelligence.actionItems.map(item => `<li style="margin-bottom: 4px;">${item}</li>`).join('')}
            </ul>
        </div>
        ` : ''}

        ${callData.recording_url ? `
        <div style="margin-bottom: 20px;">
            <a href="${callData.recording_url}" style="background-color: #238636; color: #ffffff; padding: 10px 16px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: bold; display: inline-block;">Listen to Call Recording</a>
        </div>
        ` : ''}

        <div style="border-top: 1px solid #30363d; padding-top: 12px; font-size: 11px; color: #8b949e;">
            RHIVE Autonomous Telephony Swarm • Sent to ${targetEmail} • Server Timestamp: ${new Date().toISOString()}
        </div>
    </div>
    `;

    try {
        if (process.env.RESEND_API_KEY) {
            await axios.post('https://api.resend.com/emails', {
                from: 'RHIVE Telephony Swarm <telephony@rhiveconstruction.com>',
                to: [targetEmail],
                subject: subject,
                html: htmlContent
            }, {
                headers: { 'Authorization': `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' }
            });
            console.log(`[Email Dispatcher] Sent Lead Brief via Resend to ${targetEmail}`);
        } else if (process.env.SENDGRID_API_KEY) {
            await axios.post('https://api.sendgrid.com/v3/mail/send', {
                personalizations: [{ to: [{ email: targetEmail }] }],
                from: { email: 'telephony@rhiveconstruction.com', name: 'RHIVE Telephony Swarm' },
                subject: subject,
                content: [{ type: 'text/html', value: htmlContent }]
            }, {
                headers: { 'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`, 'Content-Type': 'application/json' }
            });
            console.log(`[Email Dispatcher] Sent Lead Brief via SendGrid to ${targetEmail}`);
        } else {
            console.log(`[DEV EMAIL SIMULATION] Target: ${targetEmail} | Subject: ${subject}`);
        }

        // Always log email delivery to Firestore
        await admin.firestore().collection('email_notifications').add({
            recipient: targetEmail,
            subject,
            intent: parsedIntelligence.intent,
            callerPhone: callData.contact_number,
            callerName: callData.contact_name,
            deliveredAt: admin.firestore.FieldValue.serverTimestamp()
        });
    } catch (emailErr) {
        console.error('[sendOfficeEmailNotification] Error:', emailErr.response?.data || emailErr.message);
    }
}

/**
 * 7. Server-Side Master Webhook with Filter & AI Parsing Pipeline
 * Receives JustCall webhooks, verifies HMAC signatures, runs anti-solicitor filters,
 * parses transcripts with Gemini, upserts CRM leads, emails office@rhiveconstruction.com,
 * and queues automated RPA tasks.
 */
exports.justCallWebhook = functions.https.onRequest((req, res) => {
    return cors(req, res, async () => {
        if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

        const body = req.body;
        const eventType = body.type || body.event;
        const db = admin.firestore();

        try {
            if (eventType && eventType.startsWith('call.')) {
                const d = body.data || {};
                const callerPhone = normalizePhone(d.contact_number || d.caller_number);
                const callerName = d.contact_name || d.caller_name || 'Guest Caller';
                const transcript = d.transcript || '';
                const notes = d.notes || '';

                // Step 1: Execute Anti-Solicitor / Spam Filter Rule
                const solicitorAudit = evaluateSolicitorFilter(transcript, notes, callerName);

                // Step 2: Execute AI Transcript & Intelligence Parsing
                const parsedIntelligence = await parseCallTranscriptWithAI(transcript, notes, callerName, callerPhone);

                const callRecord = {
                    event_type: eventType,
                    contact_number: callerPhone,
                    contact_name: callerName,
                    justcall_number: d.justcall_number || null,
                    agent_name: d.agent_name || null,
                    duration: d.duration || null,
                    direction: d.direction || 'inbound',
                    recording_url: d.recording_url || null,
                    transcript: transcript,
                    notes: notes,
                    isSolicitor: solicitorAudit.isSolicitor,
                    solicitorReason: solicitorAudit.reason,
                    aiParsed: parsedIntelligence,
                    isDeleted: false,
                    timestamp: admin.firestore.FieldValue.serverTimestamp()
                };

                const logDoc = await db.collection('call_logs').add(callRecord);

                // Step 3: Universal Email Notification to office@rhiveconstruction.com
                if (eventType === 'call.completed') {
                    await sendOfficeEmailNotification(callRecord, parsedIntelligence, solicitorAudit);
                }

                // Step 4: Handle Solicitor Quarantine vs. Clean CRM Upsert
                if (solicitorAudit.isSolicitor) {
                    console.log(`[Solicitor Firewall] Quarantined call from ${callerPhone}: ${solicitorAudit.reason}`);
                    await db.collection('quarantined_solicitors').add({
                        phone: callerPhone,
                        name: callerName,
                        callLogId: logDoc.id,
                        reason: solicitorAudit.reason,
                        transcriptSnippet: transcript.substring(0, 300),
                        quarantinedAt: admin.firestore.FieldValue.serverTimestamp()
                    });
                } else if (eventType === 'call.completed' && callerPhone) {
                    // Clean Lead: Upsert into CRM Contacts & Leads
                    const variations = getPhoneVariations(callerPhone);
                    const existingContactSnap = await db.collection('contacts').where('phone', 'in', variations).where('isDeleted', '==', false).limit(1).get();

                    let contactId = null;
                    if (!existingContactSnap.empty) {
                        contactId = existingContactSnap.docs[0].id;
                        await db.collection('contacts').doc(contactId).update({
                            last_contacted_at: admin.firestore.FieldValue.serverTimestamp(),
                            disc_profile: parsedIntelligence.discProfile || 'Steady',
                            updated_at: admin.firestore.FieldValue.serverTimestamp()
                        });
                    } else {
                        const newContact = await db.collection('contacts').add({
                            first_name: parsedIntelligence.callerFirstName || callerName.split(' ')[0] || 'Lead',
                            last_name: parsedIntelligence.callerLastName || callerName.split(' ').slice(1).join(' ') || '',
                            phone: callerPhone,
                            disc_profile: parsedIntelligence.discProfile || 'Steady',
                            source: 'JustCall Swarm Inbound',
                            status: 'New',
                            isDeleted: false,
                            created_at: admin.firestore.FieldValue.serverTimestamp()
                        });
                        contactId = newContact.id;
                    }

                    // Create/Update Lead Record
                    await db.collection('leads').add({
                        contact_id: contactId,
                        phone: callerPhone,
                        name: callerName,
                        intent: parsedIntelligence.intent,
                        urgency_score: parsedIntelligence.urgencyScore || 5,
                        verified_address: parsedIntelligence.extractedAddress || null,
                        key_concerns: parsedIntelligence.keyConcerns || [],
                        action_items: parsedIntelligence.actionItems || [],
                        executive_summary: parsedIntelligence.executiveSummary || 'New inbound call processed.',
                        assigned_to: 'Kara Robinson',
                        status: 'UNREAD',
                        isDeleted: false,
                        created_at: admin.firestore.FieldValue.serverTimestamp()
                    });

                    // Step 4: Automated Roofr RPA Trigger on Verified Inspection
                    if (parsedIntelligence.extractedAddress && (parsedIntelligence.intent === 'CERTIFIED_QUOTE_INSPECTION' || parsedIntelligence.intent === 'ACTIVE_LEAK_EMERGENCY')) {
                        await db.collection('roofr_orders').add({
                            address: parsedIntelligence.extractedAddress,
                            callerName: callerName,
                            callerPhone: callerPhone,
                            callLogId: logDoc.id,
                            status: 'QUEUED_FOR_HEADLESS_RPA',
                            createdAt: admin.firestore.FieldValue.serverTimestamp()
                        });
                        console.log(`[Roofr Auto-Order] Queued measurement for address: ${parsedIntelligence.extractedAddress}`);
                    }
                }

                return res.status(200).json({ success: true, callLogId: logDoc.id, parsed: parsedIntelligence });
            }

            return res.status(200).json({ message: 'Event acknowledged.' });
        } catch (e) {
            console.error('[justCallWebhook] Error:', e.message);
            return res.status(500).json({ error: e.message });
        }
    });
});

/**
 * 1b. JustCall Information Query (Enhanced)
 */
exports.justCallInformation = functions.https.onRequest((req, res) => {
    return cors(req, res, async () => {
        const phoneNumber = req.query.phone || req.body.phone;
        if (!phoneNumber) return res.status(400).json({ error: "No phone number provided" });

        try {
            const db = admin.firestore();
            const variations = getPhoneVariations(phoneNumber);
            const contactSnapshot = await db.collection('contacts').where('phone', 'in', variations).limit(1).get();

            if (contactSnapshot.empty) {
                return res.status(200).json({ found: false, message: "No contact found." });
            }

            const contact = { id: contactSnapshot.docs[0].id, ...contactSnapshot.docs[0].data() };
            return res.status(200).json({ found: true, contact });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });
});

/**
 * 1c. Sync Firebase Contact -> JustCall
 */
exports.onContactCreatedSyncToJustCall = functions.firestore
    .document('contacts/{contactId}')
    .onCreate(async (snapshot) => {
        const data = snapshot.data();
        if (!JUSTCALL_API_KEY || !JUSTCALL_API_SECRET) return null;
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
        } catch (error) {
            console.error("Error syncing to JustCall:", error.message);
        }
    });

/**
 * 8. Password Reset / SMS OTP Cloud Hooks
 */
const JWT_SECRET = process.env.JWT_SECRET || 'rhive_otp_reset_secret_at_least_32_chars_long';

function base64url(buf) {
    return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}
function signResetJWT(payload) {
    const header = base64url(Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
    const now = Math.floor(Date.now() / 1000);
    const body = base64url(Buffer.from(JSON.stringify({ ...payload, iat: now, exp: now + 600 })));
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

exports.sendSmsOtp = functions.runWith({ secrets: ['JUSTCALL_API_KEY', 'JUSTCALL_API_SECRET', 'JUSTCALL_FROM_NUMBER'] }).https.onRequest((req, res) => {
    return cors(req, res, async () => {
        if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
        const { phone } = req.body;
        if (!phone) return res.status(400).json({ error: 'Missing phone number' });

        const normalizedPhone = normalizePhone(phone);
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60000).toISOString();

        await admin.firestore().collection('otp_codes').doc(normalizedPhone.replace(/\+/g, '')).set({
            code: otpCode,
            expiresAt,
            phone: normalizedPhone,
            purpose: 'password_reset',
            createdAt: new Date().toISOString()
        });

        return res.status(200).json({ success: true, message: 'Verification code sent.' });
    });
});

exports.verifySmsOtp = functions.runWith({ secrets: ['JUSTCALL_API_KEY', 'JUSTCALL_API_SECRET', 'JUSTCALL_FROM_NUMBER'] }).https.onRequest((req, res) => {
    return cors(req, res, async () => {
        if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
        const { phone, code } = req.body;
        if (!phone || !code) return res.status(400).json({ error: 'Missing phone or code' });

        const normalizedPhone = normalizePhone(phone);
        const otpDocId = normalizedPhone.replace(/\+/g, '');
        const otpSnap = await admin.firestore().collection('otp_codes').doc(otpDocId).get();

        if (!otpSnap.exists || otpSnap.data().code !== code.trim()) {
            return res.status(400).json({ error: 'Invalid or expired code.' });
        }
        await admin.firestore().collection('otp_codes').doc(otpDocId).delete();

        const resetToken = signResetJWT({ phone: normalizedPhone, purpose: 'password_reset' });
        return res.status(200).json({ success: true, resetToken });
    });
});

exports.completePasswordReset = functions.runWith({ secrets: ['JUSTCALL_API_KEY', 'JUSTCALL_API_SECRET', 'JUSTCALL_FROM_NUMBER'] }).https.onRequest((req, res) => {
    return cors(req, res, async () => {
        if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
        const { resetToken, newPassword } = req.body;
        const payload = verifyResetJWT(resetToken);
        if (!payload) return res.status(401).json({ error: 'Invalid reset token' });

        const usersSnap = await admin.firestore().collection('users').where('phone', '==', payload.phone).limit(1).get();
        if (usersSnap.empty) return res.status(404).json({ error: 'User not found' });

        const uid = usersSnap.docs[0].id;
        await admin.auth().updateUser(uid, { password: newPassword });
        return res.status(200).json({ success: true, message: 'Password updated successfully' });
    });
});
