/**
 * End-to-end test of the OTP email flow against the live Cloud Function.
 * Seeds a test user, triggers createResetToken logic, calls the Cloud Function,
 * captures the Ethereal preview URL, then cleans up.
 */
const admin = require('firebase-admin');
const crypto = require('crypto');
const https = require('https');

if (!admin.apps.length) admin.initializeApp({ projectId: 'rhive-os' });
const db = admin.firestore();

// ── Use a real registered email if provided, otherwise create a test user ──
const TEST_EMAIL = process.env.TEST_EMAIL || null;

function postJson(url, body) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(body);
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            path: urlObj.pathname,
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
        };
        const req = https.request(options, (res) => {
            let raw = '';
            res.on('data', c => raw += c);
            res.on('end', () => {
                try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
                catch (e) { resolve({ status: res.statusCode, body: raw }); }
            });
        });
        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

async function run() {
    console.log('\n══════════════════════════════════════════════════════════');
    console.log('  RHIVE QOS — Live OTP Email End-to-End Test');
    console.log('══════════════════════════════════════════════════════════\n');

    let testUserId = null;
    let emailToTest = TEST_EMAIL;

    // If no real email given, seed a test user
    if (!emailToTest) {
        testUserId = 'e2e-otp-test-' + Date.now();
        emailToTest = testUserId + '@ethereal-test.invalid';
        await db.collection('users').doc(testUserId).set({
            email: emailToTest,
            name: 'E2E Test User',
            role: 'Employee',
            password_hash: 'placeholder',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        });
        console.log('ℹ️  No TEST_EMAIL set — seeded temp user:', emailToTest);
    } else {
        console.log('ℹ️  Testing with real email:', emailToTest);
    }

    try {
        // Seed OTP on the user doc (mirrors what createResetToken does)
        const otpBuffer = Buffer.alloc(4);
        crypto.randomFillSync(otpBuffer);
        const otp = String((otpBuffer.readUInt32BE(0) % 900000) + 100000);
        const tokenBuf = Buffer.alloc(32);
        crypto.randomFillSync(tokenBuf);
        const token = tokenBuf.toString('hex') + Date.now().toString(36);

        const usersSnap = await db.collection('users').where('email', '==', emailToTest.toLowerCase()).limit(1).get();
        if (usersSnap.empty) {
            console.error('❌ User not found in Firestore for email:', emailToTest);
            process.exit(1);
        }
        const userRef = usersSnap.docs[0].ref;
        await userRef.update({
            reset_token: token,
            reset_token_expiry: new Date(Date.now() + 3600000).toISOString(),
            reset_otp: otp,
            reset_otp_expiry: new Date(Date.now() + 15 * 60000).toISOString(),
            reset_otp_attempts: 0,
            updated_at: new Date().toISOString()
        });
        console.log('✅ OTP seeded on user doc (OTP not exposed to client)');

        // Call the live Cloud Function
        console.log('\nCalling Cloud Function...');
        const CF_URL = 'https://us-central1-rhive-os.cloudfunctions.net/sendPasswordResetEmail';
        const result = await postJson(CF_URL, { email: emailToTest });

        console.log('  HTTP Status:', result.status);
        console.log('  Response body:', JSON.stringify(result.body, null, 2));

        if (result.status === 200 && result.body.success) {
            console.log('\n✅ Cloud Function returned success!');
            if (result.body.testMode && result.body.previewUrl) {
                console.log('\n🔍 TEST MODE — Email preview URL:');
                console.log('   ➜', result.body.previewUrl);
                console.log('\n   Open that URL in your browser to see the OTP email.');
            } else {
                console.log('📧 Email dispatched via real SMTP (Gmail).');
            }
        } else {
            console.log('\n❌ Cloud Function returned non-success:', result.body);
        }

        // Clean up OTP from user doc
        await userRef.update({
            reset_otp: admin.firestore.FieldValue.delete(),
            reset_otp_expiry: admin.firestore.FieldValue.delete(),
            reset_otp_attempts: admin.firestore.FieldValue.delete(),
            reset_token: admin.firestore.FieldValue.delete(),
            reset_token_expiry: admin.firestore.FieldValue.delete()
        });
        console.log('\nℹ️  OTP/token fields cleaned up from user doc.');

    } finally {
        if (testUserId) {
            await db.collection('users').doc(testUserId).delete();
            console.log('ℹ️  Temp test user deleted.');
        }
        // Also clear rate limits
        const emailHash = crypto.createHash('sha256').update(emailToTest.toLowerCase()).digest('hex');
        await db.collection('password_reset_rate_limits').doc(emailHash).delete().catch(() => {});
    }

    console.log('\n══════════════════════════════════════════════════════════\n');
}

run().catch(e => { console.error('\n[FATAL]', e.message); process.exit(1); });
