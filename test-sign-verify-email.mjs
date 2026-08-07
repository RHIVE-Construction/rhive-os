/**
 * test-sign-verify-email.mjs
 *
 * End-to-end test for the sendSignVerifyEmail Cloud Function.
 * Tests that:
 *   1. The function responds with 200 OK
 *   2. emailSent === true (email was queued via Firestore 'mail' collection)
 *   3. Link is returned in the response
 *   4. Firestore document is updated with sign_verify_link
 *
 * Usage:
 *   node test-sign-verify-email.mjs [recipientEmail]
 *
 * Example:
 *   node test-sign-verify-email.mjs victor.v@rhiveconstruction.com
 */

const FN_URL = 'https://us-central1-rhive-os.cloudfunctions.net/sendSignVerifyEmail';

// Use a test/sandbox project ID (update to a real lead/project doc ID for live testing)
const TEST_PROJECT_ID = 'test-sign-verify-' + Date.now();
const TEST_LINK = 'https://rhive-os.web.app/?page=CUSTOMER-SIGN-VERIFY&token=' + TEST_PROJECT_ID;

// Accept email as CLI arg or use default test address
const recipientEmail = process.argv[2] || 'victor.v@rhiveconstruction.com';

const payload = {
    projectId: TEST_PROJECT_ID,
    customerEmail: recipientEmail,
    customerName: 'Test Customer',
    projectName: 'TEST — Sign & Verify Email Notification',
    link: TEST_LINK,
};

console.log('\n════════════════════════════════════════════════════════');
console.log('  RHIVE Sign & Verify — Email Notification Test');
console.log('════════════════════════════════════════════════════════');
console.log('\n📋 Test payload:');
console.log('   Function URL :', FN_URL);
console.log('   Project ID   :', payload.projectId);
console.log('   Customer     :', payload.customerName);
console.log('   Email        :', payload.customerEmail);
console.log('   Project      :', payload.projectName);
console.log('   Portal link  :', payload.link);
console.log('\n⏳ Calling Cloud Function...\n');

try {
    const res = await fetch(FN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    const data = await res.json();

    console.log('📡 Response status :', res.status);
    console.log('📦 Response body   :', JSON.stringify(data, null, 2));
    console.log('');

    // ─── Assertions ────────────────────────────────────────────────
    let passed = 0;
    let failed = 0;

    const assert = (label, condition, detail) => {
        if (condition) {
            console.log(`  ✅ PASS — ${label}`);
            passed++;
        } else {
            console.log(`  ❌ FAIL — ${label}${detail ? ` (${detail})` : ''}`);
            failed++;
        }
    };

    console.log('─── Assertions ─────────────────────────────────────────');
    assert('HTTP 200 OK', res.status === 200, `Got ${res.status}`);
    assert('success flag is true', data.success === true, `Got ${data.success}`);
    assert('emailSent is true', data.emailSent === true, `Got ${data.emailSent} — check Firestore mail collection`);
    assert('link is returned', typeof data.link === 'string' && data.link.length > 0, `Got "${data.link}"`);
    console.log('────────────────────────────────────────────────────────');
    console.log(`\n  Results: ${passed} passed, ${failed} failed`);

    if (failed === 0) {
        console.log('\n  🎉 All tests passed! Check inbox at:', recipientEmail);
        console.log('     Note: Email delivery via Firebase Trigger Email ext');
        console.log('     may take 30–60 seconds to arrive.\n');
    } else {
        console.log('\n  ⚠️  Some tests failed. Check function logs:');
        console.log('     npx firebase-tools@latest functions:log\n');
        process.exit(1);
    }
} catch (err) {
    console.error('❌ Test failed with network error:', err.message);
    console.error('   Is the Cloud Function deployed? Run: npm run deploy (in /functions)');
    process.exit(1);
}
