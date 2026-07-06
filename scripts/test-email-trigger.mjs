/**
 * test-email-trigger.mjs
 *
 * Writes a test document to the Firestore `mail` collection to verify the
 * Firebase "Trigger Email from Firestore" extension (firestore-send-email) is
 * connected and dispatching emails correctly.
 *
 * Usage:
 *   node scripts/test-email-trigger.mjs <recipient@email.com>
 *
 * The script then polls the document for up to 30s to report delivery state.
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// ── Config ────────────────────────────────────────────────────────────────────
const PROJECT_ID   = 'rhive-os';
const MAIL_COLLECTION = 'mail';
const FROM_ADDRESS = 'RHIVE Support <support@rhiveconstruction.com>';
const RECIPIENT    = process.argv[2] || 'support@rhiveconstruction.com';

// ── Init Firebase Admin (uses Application Default Credentials) ────────────────
if (!getApps().length) {
  initializeApp({ projectId: PROJECT_ID });
}
const db = getFirestore();

// ── Test email payload ────────────────────────────────────────────────────────
const testDoc = {
  to: RECIPIENT,
  from: FROM_ADDRESS,
  message: {
    subject: '✅ RHIVE Email Trigger — Connection Test',
    text: [
      'This is an automated test email from the RHIVE OS platform.',
      '',
      'If you are reading this, the Firebase "Trigger Email from Firestore"',
      'extension is correctly connected and dispatching emails.',
      '',
      `Sent at: ${new Date().toISOString()}`,
      '',
      '— RHIVE Support Team',
    ].join('\n'),
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>RHIVE Email Trigger Test</title>
</head>
<body style="margin:0;padding:0;background:#050505;font-family:Arial,sans-serif;color:#f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0"
               style="background:#0a0a0a;border:1px solid #374151;border-radius:4px;max-width:560px;">
          <tr><td style="background:#ec028b;padding:4px 0;"></td></tr>
          <tr>
            <td style="padding:32px 36px 20px;">
              <h1 style="margin:0 0 4px;font-size:22px;font-weight:800;color:#ffffff;">
                RHIVE <span style="color:#ec028b;">Construction</span>
              </h1>
              <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#6b7280;">
                Email Trigger — Connection Test
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 36px 32px;">
              <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#d1d5db;">
                ✅ The Firebase <strong style="color:#ec028b;">Trigger Email from Firestore</strong>
                extension is <strong style="color:#ffffff;">correctly connected</strong> and dispatching emails.
              </p>
              <p style="margin:0 0 16px;font-size:13px;color:#9ca3af;">
                This test document was written to the <code style="color:#ec028b;">mail</code> Firestore
                collection and the extension picked it up successfully.
              </p>
              <p style="margin:0;font-size:11px;color:#6b7280;">
                Sent at: ${new Date().toISOString()}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 36px;border-top:1px solid #1f2937;">
              <p style="margin:0;font-size:11px;color:#4b5563;">
                RHIVE Construction · Brisbane, QLD · Australia
              </p>
            </td>
          </tr>
          <tr><td style="background:#ec028b;padding:2px 0;"></td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  },
  _testEmail: true,
  createdAt: FieldValue.serverTimestamp(),
};

async function main() {
  console.log(`\n🚀 RHIVE Email Trigger Test`);
  console.log(`   Project  : ${PROJECT_ID}`);
  console.log(`   Collection: ${MAIL_COLLECTION}`);
  console.log(`   To        : ${RECIPIENT}`);
  console.log(`   From      : ${FROM_ADDRESS}\n`);

  // Write the mail document
  const ref = await db.collection(MAIL_COLLECTION).add(testDoc);
  console.log(`✅ Mail document written → ID: ${ref.id}`);
  console.log(`   View in console: https://console.firebase.google.com/project/${PROJECT_ID}/firestore/data/~2F${MAIL_COLLECTION}~2F${ref.id}\n`);

  // Poll for delivery state for up to 60s
  console.log('⏳ Polling for delivery status (up to 60s)...');
  const start = Date.now();
  let lastState = null;

  while (Date.now() - start < 60_000) {
    await new Promise(r => setTimeout(r, 3000));
    const snap = await ref.get();
    const data = snap.data();
    const delivery = data?.delivery;

    if (!delivery) {
      process.stdout.write('.');
      continue;
    }

    const state = delivery.state;
    if (state !== lastState) {
      console.log(`\n📬 Delivery state: ${state}`);
      if (delivery.error) console.log(`   Error: ${delivery.error}`);
      if (delivery.info)  console.log(`   Info:  ${JSON.stringify(delivery.info)}`);
      lastState = state;
    }

    if (state === 'SUCCESS') {
      console.log('\n✅ Email dispatched successfully!');
      process.exit(0);
    }
    if (state === 'ERROR') {
      console.error('\n❌ Email delivery failed. Check the extension logs in Firebase Console.');
      console.error(`   Error: ${delivery.error}`);
      process.exit(1);
    }
  }

  console.log(`\n⚠️  Timed out after 60s. Check the mail document in Firestore:`);
  console.log(`   https://console.firebase.google.com/project/${PROJECT_ID}/firestore/data/~2F${MAIL_COLLECTION}~2F${ref.id}`);
  process.exit(1);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
