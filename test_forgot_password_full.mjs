/**
 * test_forgot_password_full.mjs
 * 
 * Tests the complete forgot-password flow:
 *   Step 1: sendSmsOtp     → sends OTP to phone
 *   Step 2: verifySmsOtp   → returns JWT reset token
 *   Step 3: completePasswordReset → updates Firebase Auth password
 * 
 * Usage:
 *   node test_forgot_password_full.mjs
 */

const FIREBASE_PROJECT_ID = 'rhive-os';
const FUNCTIONS_REGION = 'us-central1';
const BASE_URL = `https://${FUNCTIONS_REGION}-${FIREBASE_PROJECT_ID}.cloudfunctions.net`;

const TEST_PHONE = '+639560213304';
const TEST_NEW_PASSWORD = 'RhiveTest2026!'; // Temporary test password

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
    console.log('\n🔐 RHIVE Full Forgot-Password Flow Test');
    console.log('══════════════════════════════════════════════════');
    console.log(`📱 Test phone: ${TEST_PHONE}`);
    console.log(`🌐 Functions URL: ${BASE_URL}`);
    console.log('══════════════════════════════════════════════════\n');

    // ── Step 1: Send OTP ───────────────────────────────────────────────────────
    console.log('⏳ Step 1: sendSmsOtp — sending OTP to phone...');
    const sendRes = await fetch(`${BASE_URL}/sendSmsOtp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: TEST_PHONE })
    });

    const sendData = await sendRes.json();
    console.log(`   HTTP ${sendRes.status}:`, JSON.stringify(sendData, null, 2));

    if (!sendRes.ok) {
        console.error('\n❌ sendSmsOtp FAILED:', sendData.error);
        process.exit(1);
    }

    let code;
    if (sendData.code) {
        code = sendData.code;
        console.log(`\n⚠️  DEV MODE (JustCall not configured)`);
        console.log(`📟 OTP Code returned by API: ${code}`);
    } else {
        console.log(`📱 Real SMS sent to ${TEST_PHONE}!`);
        code = await promptLine('\n📲 Enter the OTP code you received via SMS: ');
    }
    console.log('\n✅ Step 1 PASSED — OTP sent\n');

    // ── Step 2: Verify OTP ─────────────────────────────────────────────────────
    console.log(`⏳ Step 2: verifySmsOtp — verifying code: ${code}...`);
    const verifyRes = await fetch(`${BASE_URL}/verifySmsOtp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: TEST_PHONE, code })
    });

    const verifyData = await verifyRes.json();
    console.log(`   HTTP ${verifyRes.status}:`, JSON.stringify({
        ...verifyData,
        resetToken: verifyData.resetToken ? verifyData.resetToken.substring(0, 50) + '...' : null
    }, null, 2));

    if (!verifyRes.ok || !verifyData.resetToken) {
        console.error('\n❌ verifySmsOtp FAILED:', verifyData.error);
        process.exit(1);
    }

    const resetToken = verifyData.resetToken;
    const linkedEmail = verifyData.email;
    console.log(`\n✅ Step 2 PASSED — OTP verified`);
    console.log(`   📧 Linked account email: ${linkedEmail || '(none found)'}`);
    console.log(`   🔑 Reset token: ${resetToken.substring(0, 50)}...`);

    // ── Step 3: Complete Password Reset ────────────────────────────────────────
    console.log(`\n⏳ Step 3: completePasswordReset — updating password in Firebase Auth...`);
    const resetRes = await fetch(`${BASE_URL}/completePasswordReset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToken, newPassword: TEST_NEW_PASSWORD })
    });

    const resetData = await resetRes.json();
    console.log(`   HTTP ${resetRes.status}:`, JSON.stringify(resetData, null, 2));

    if (!resetRes.ok) {
        console.error('\n❌ completePasswordReset FAILED:', resetData.error);
        process.exit(1);
    }

    console.log(`\n✅ Step 3 PASSED — Password updated in Firebase Auth!`);
    console.log(`   📧 Account: ${linkedEmail}`);
    console.log(`   🔒 New password set: ${TEST_NEW_PASSWORD}`);

    console.log('\n══════════════════════════════════════════════════');
    console.log('🎉 ALL 3 STEPS PASSED! Full forgot-password flow working!');
    console.log('══════════════════════════════════════════════════');
    console.log('\n⚠️  NOTE: The password has been changed in Firebase Auth.');
    console.log(`   To restore it, login as ${linkedEmail} with: ${TEST_NEW_PASSWORD}`);
    console.log('   Then change it back in the RHIVE OS profile settings.\n');
}

main().catch(err => {
    console.error('\n💥 Unexpected error:', err.message);
    process.exit(1);
});
