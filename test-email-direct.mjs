/**
 * test-email-direct.mjs
 * 
 * Direct test: writes documents to the Firestore `mail` collection
 * to verify the Firebase extension picks them up and sends the emails.
 * 
 * Run: node test-email-direct.mjs
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, doc, onSnapshot } from 'firebase/firestore';

// Load env manually
import { readFileSync } from 'fs';

const envFile = readFileSync('.env', 'utf-8');
const env = {};
for (const line of envFile.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...valueParts] = trimmed.split('=');
    const value = valueParts.join('=').replace(/^["']|["']$/g, '');
    env[key.trim()] = value.trim();
}

const firebaseConfig = {
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
};

console.log('Connecting to Firebase project:', firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const TEST_RECIPIENT = 'james.g@rhiveconstruction.com';
const FROM = 'RHIVE Support <support@rhiveconstruction.com>';

async function sendTestEmail(type) {
    const docs = {
        'password-changed': {
            to: TEST_RECIPIENT,
            from: FROM,
            message: {
                subject: '[TEST] Password Changed Successfully — RHIVE Construction',
                text: 'This is a test email confirming your RHIVE password was changed.',
                html: `<!DOCTYPE html>
<html><body style="background:#050505;font-family:Arial;color:#f3f4f6;padding:40px;">
  <h1 style="color:#fff;">RHIVE <span style="color:#ec028b;">Construction</span></h1>
  <p style="color:#9ca3af;font-size:11px;text-transform:uppercase;letter-spacing:2px;">Security Notification — TEST</p>
  <hr style="border-color:#374151;margin:20px 0;"/>
  <p style="color:#d1d5db;font-size:15px;">Your RHIVE Construction account password was successfully changed.</p>
  <p style="color:#6b7280;font-size:12px;">Changed at: ${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Brisbane' })}</p>
  <div style="margin:24px 0;padding:14px 16px;background:#111827;border-left:3px solid #ec028b;">
    <p style="margin:0;font-size:12px;color:#9ca3af;">
      🔒 <strong style="color:#f3f4f6;">Wasn't you?</strong> Contact support@rhiveconstruction.com immediately.
    </p>
  </div>
  <p style="color:#4b5563;font-size:11px;margin-top:32px;">RHIVE Construction · Brisbane, QLD · Australia</p>
</body></html>`,
            },
            createdAt: serverTimestamp(),
        },
        'followup-scheduled': {
            to: TEST_RECIPIENT,
            from: FROM,
            message: {
                subject: '[TEST] Follow-up Scheduled: Bondbond Property — RHIVE',
                text: 'A follow-up has been scheduled for Bondbond Property on 2026-08-01 at 09:00.',
                html: `<!DOCTYPE html>
<html><body style="background:#050505;font-family:Arial;color:#f3f4f6;padding:40px;">
  <h1 style="color:#fff;">RHIVE <span style="color:#ec028b;">Construction</span></h1>
  <p style="color:#9ca3af;font-size:11px;text-transform:uppercase;letter-spacing:2px;">Sales Pipeline Notification — TEST</p>
  <hr style="border-color:#374151;margin:20px 0;"/>
  <p style="color:#d1d5db;font-size:15px;">A follow-up has been scheduled for one of your leads.</p>
  <table style="width:100%;background:#0f1621;border:1px solid #1f2937;border-radius:6px;overflow:hidden;margin-top:20px;">
    <tr><td style="background:#ec028b;padding:3px 0;"></td></tr>
    <tr><td style="padding:20px;">
      <p style="margin:0 0 4px;color:#6b7280;font-size:10px;text-transform:uppercase;letter-spacing:2px;">Lead / Project</p>
      <p style="margin:0 0 16px;color:#fff;font-size:16px;font-weight:800;">Bondbond Property — TEST</p>
      <p style="margin:0 0 4px;color:#6b7280;font-size:10px;text-transform:uppercase;letter-spacing:2px;">Type</p>
      <p style="margin:0 0 16px;color:#f3f4f6;font-size:14px;font-weight:700;">Phone Call</p>
      <p style="margin:0 0 4px;color:#6b7280;font-size:10px;text-transform:uppercase;letter-spacing:2px;">Scheduled For</p>
      <p style="margin:0;color:#f3f4f6;font-size:14px;font-weight:700;">Friday, 1 August 2026 at 9:00 AM</p>
    </td></tr>
  </table>
  <p style="color:#4b5563;font-size:11px;margin-top:32px;">RHIVE Construction · Brisbane, QLD · Australia</p>
</body></html>`,
            },
            createdAt: serverTimestamp(),
        },
        'followup-reminder': {
            to: TEST_RECIPIENT,
            from: FROM,
            message: {
                subject: '[TEST] Reminder: Follow-up Tomorrow — Sample Lead',
                text: 'Reminder: you have a follow-up scheduled for tomorrow. Lead: Sample Lead.',
                html: `<!DOCTYPE html>
<html><body style="background:#050505;font-family:Arial;color:#f3f4f6;padding:40px;">
  <h1 style="color:#fff;">RHIVE <span style="color:#ec028b;">Construction</span></h1>
  <p style="color:#9ca3af;font-size:11px;text-transform:uppercase;letter-spacing:2px;">24-Hour Advance Notice — TEST</p>
  <hr style="border-color:#374151;margin:20px 0;"/>
  <p style="color:#d1d5db;font-size:15px;">This is a reminder — you have an upcoming follow-up <strong style="color:#fff;">tomorrow</strong>.</p>
  <table style="width:100%;background:#0f1621;border:1px solid #1f2937;border-radius:6px;overflow:hidden;margin-top:20px;">
    <tr><td style="background:#ec028b;padding:3px 0;"></td></tr>
    <tr><td style="padding:20px;">
      <p style="margin:0 0 4px;color:#6b7280;font-size:10px;text-transform:uppercase;letter-spacing:2px;">Lead / Project</p>
      <p style="margin:0 0 16px;color:#fff;font-size:16px;font-weight:800;">Sample Lead — TEST</p>
      <p style="margin:0 0 4px;color:#6b7280;font-size:10px;text-transform:uppercase;letter-spacing:2px;">Follow-Up Type</p>
      <p style="margin:0 0 16px;color:#f3f4f6;font-size:14px;font-weight:700;">Phone Call</p>
      <p style="margin:0 0 4px;color:#6b7280;font-size:10px;text-transform:uppercase;letter-spacing:2px;">Scheduled For</p>
      <p style="margin:0;color:#ec028b;font-size:14px;font-weight:800;">Tomorrow at 10:00 AM</p>
    </td></tr>
  </table>
  <p style="color:#4b5563;font-size:11px;margin-top:32px;">RHIVE Construction · Brisbane, QLD · Australia</p>
</body></html>`,
            },
            createdAt: serverTimestamp(),
        },
    };

    const docData = docs[type];
    if (!docData) {
        console.error('Unknown test type:', type);
        return;
    }

    console.log(`\n📧 Sending test email: ${type}`);
    console.log(`   → To: ${TEST_RECIPIENT}`);
    console.log(`   → Subject: ${docData.message.subject}`);

    const ref = await addDoc(collection(db, 'mail'), docData);
    console.log(`   ✓ Queued in Firestore (id: ${ref.id})`);
    console.log(`   ⏳ Waiting for extension delivery status...`);

    // Watch the document for delivery status update.
    // Note: processMailQueue (our function) sets delivery.state = 'SUCCESS' with messageId.
    // The old Firebase extension may race and overwrite with ERROR — we detect real
    // delivery by the presence of delivery.messageId set by processMailQueue.
    return new Promise((resolve) => {
        let resolved = false;
        const unsubscribe = onSnapshot(doc(db, 'mail', ref.id), (snap) => {
            if (resolved) return;
            const data = snap.data();
            const delivery = data?.delivery;
            if (!delivery) return;

            console.log(`   📬 Status: ${delivery.state}${delivery.messageId ? ' ✅ (messageId confirmed)' : ''}`);

            // Our processMailQueue function sets messageId on success — this is the ground truth
            if (delivery.messageId) {
                console.log(`   ✅ EMAIL DELIVERED SUCCESSFULLY! MessageId: ${delivery.messageId}`);
                resolved = true;
                unsubscribe();
                resolve('success');
            } else if (delivery.state === 'ERROR' && !delivery.messageId) {
                // Only treat as error if no messageId was ever set (true failure)
                console.error(`   ❌ EMAIL DELIVERY FAILED:`, delivery.error);
                resolved = true;
                unsubscribe();
                resolve('error');
            }
        });

        // Timeout after 45s (Cloud Function cold start can be slow)
        setTimeout(() => {
            if (!resolved) {
                resolved = true;
                unsubscribe();
                console.log(`   ⚠️  Timed out. Check Cloud Function logs & james.g@ inbox.`);
                resolve('timeout');
            }
        }, 45000);
    });
}

async function runTests() {
    console.log('═'.repeat(60));
    console.log('  RHIVE Email System — Live Test');
    console.log('═'.repeat(60));
    console.log(`  Project: ${firebaseConfig.projectId}`);
    console.log(`  Recipient: ${TEST_RECIPIENT}`);
    console.log('═'.repeat(60));

    await sendTestEmail('password-changed');
    await sendTestEmail('followup-scheduled');
    await sendTestEmail('followup-reminder');

    console.log('\n═'.repeat(60));
    console.log('  All test emails queued. Check james.g@rhiveconstruction.com');
    console.log('  Also verify: Firebase Console → Firestore → mail collection');
    console.log('═'.repeat(60));

    process.exit(0);
}

runTests().catch(err => {
    console.error('Test script error:', err);
    process.exit(1);
});
