/**
 * test_sms_otp.mjs
 * 
 * Tests the sendSmsOtp and verifySmsOtp Cloud Functions.
 * 
 * Usage:
 *   node test_sms_otp.mjs
 * 
 * In dev mode (no JustCall configured), the code will be printed to the console
 * AND returned in the response. Enter that code when prompted.
 */

const FIREBASE_PROJECT_ID = 'rhive-os';
const FUNCTIONS_REGION = 'us-central1';
const BASE_URL = `https://${FUNCTIONS_REGION}-${FIREBASE_PROJECT_ID}.cloudfunctions.net`;
// Uncomment below for emulator testing:
// const BASE_URL = `http://127.0.0.1:5001/${FIREBASE_PROJECT_ID}/${FUNCTIONS_REGION}`;

const TEST_PHONE = '+639560213304';

async function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

async function promptLine(prompt) {
    process.stdout.write(prompt);
    return new Promise(resolve => {
        process.stdin.resume();
        process.stdin.once('data', data => {
            process.stdin.pause();
            resolve(data.toString().trim());
        });
    });
}

async function main() {
    console.log('\n🔐 RHIVE SMS OTP Test');
    console.log('════════════════════════════════════════');
    console.log(`📱 Test phone: ${TEST_PHONE}`);
    console.log(`🌐 Functions URL: ${BASE_URL}`);
    console.log('════════════════════════════════════════\n');

    // ── Step 1: Send OTP ────────────────────────────────────────────────────
    console.log('⏳ Step 1: Calling sendSmsOtp...');
    const sendRes = await fetch(`${BASE_URL}/sendSmsOtp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: TEST_PHONE })
    });

    const sendData = await sendRes.json();
    console.log(`   Status: HTTP ${sendRes.status}`);
    console.log(`   Response:`, JSON.stringify(sendData, null, 2));

    if (!sendRes.ok) {
        console.error('\n❌ sendSmsOtp FAILED:', sendData.error);
        process.exit(1);
    }

    console.log('\n✅ OTP sent successfully!');
    if (sendData.code) {
        console.log(`\n⚠️  DEV MODE — JustCall not configured`);
        console.log(`📟 OTP Code (would be sent via SMS): ${sendData.code}`);
    } else {
        console.log(`📱 Real SMS sent to ${TEST_PHONE} via JustCall!`);
    }

    // ── Step 2: Get OTP from user ───────────────────────────────────────────
    const code = sendData.code || await promptLine('\n📲 Enter the OTP code you received: ');
    
    console.log(`\n⏳ Step 2: Calling verifySmsOtp with code: ${code}...`);

    const verifyRes = await fetch(`${BASE_URL}/verifySmsOtp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: TEST_PHONE, code })
    });

    const verifyData = await verifyRes.json();
    console.log(`   Status: HTTP ${verifyRes.status}`);
    console.log(`   Response:`, JSON.stringify({
        ...verifyData,
        resetToken: verifyData.resetToken ? verifyData.resetToken.substring(0, 40) + '...' : null
    }, null, 2));

    if (!verifyRes.ok) {
        console.error('\n❌ verifySmsOtp FAILED:', verifyData.error);
        process.exit(1);
    }

    console.log('\n✅ OTP verified successfully!');
    console.log(`📧 Linked email: ${verifyData.email || '(none found)'}`);
    console.log(`🔑 Reset token issued: ${verifyData.resetToken ? 'YES (' + verifyData.resetToken.length + ' chars)' : 'NO'}`);
    console.log('\n════════════════════════════════════════');
    console.log('🎉 Full SMS OTP flow test PASSED!');
    console.log('════════════════════════════════════════\n');
}

main().catch(err => {
    console.error('\n💥 Unexpected error:', err.message);
    process.exit(1);
});
