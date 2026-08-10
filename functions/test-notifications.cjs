/**
 * test-notifications.cjs
 * Run with: node functions/test-notifications.cjs
 *
 * Tests the two new security notification Cloud Functions:
 *   - sendPasswordChangeNotification
 *   - sendEmailChangeNotification
 */

const https = require('https');

const PROJECT_ID = 'rhive-os';
const REGION = 'us-central1';
const BASE_URL = `https://${REGION}-${PROJECT_ID}.cloudfunctions.net`;
const TEST_EMAIL = 'victor.v@rhiveconstruction.com';
const TEST_NAME = 'Victor (Notification Test)';

function postJson(url, body) {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify(body);
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            path: urlObj.pathname,
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) }
        };
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
                catch { resolve({ status: res.statusCode, body: data }); }
            });
        });
        req.on('error', reject);
        req.write(payload);
        req.end();
    });
}

async function runTests() {
    let passed = 0, failed = 0;

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  RHIVE Security Notification — Function Tests');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // TEST 1: sendPasswordChangeNotification
    console.log('[TEST 1] sendPasswordChangeNotification — ' + TEST_EMAIL);
    try {
        const res = await postJson(`${BASE_URL}/sendPasswordChangeNotification`, {
            email: TEST_EMAIL,
            userName: TEST_NAME
        });
        if (res.status === 200 && res.body.success) {
            console.log('  PASSED — HTTP 200, success: true');
            console.log('  Check your inbox at:', TEST_EMAIL);
            passed++;
        } else {
            console.error('  FAILED — Response:', res.status, JSON.stringify(res.body));
            failed++;
        }
    } catch (err) {
        console.error('  ERROR:', err.message);
        failed++;
    }

    // TEST 2: sendEmailChangeNotification
    console.log('\n[TEST 2] sendEmailChangeNotification — both old + new');
    try {
        const res = await postJson(`${BASE_URL}/sendEmailChangeNotification`, {
            oldEmail: 'old.address@example.com',
            newEmail: TEST_EMAIL,
            userName: TEST_NAME
        });
        if (res.status === 200 && res.body.success) {
            console.log('  PASSED — HTTP 200, notified:', res.body.notified, 'addresses');
            console.log('  Check your inbox at:', TEST_EMAIL, '(new address notification)');
            passed++;
        } else {
            console.error('  FAILED — Response:', res.status, JSON.stringify(res.body));
            failed++;
        }
    } catch (err) {
        console.error('  ERROR:', err.message);
        failed++;
    }

    // TEST 3: Validation — missing email should return 400
    console.log('\n[TEST 3] sendPasswordChangeNotification — missing email (expect 400)');
    try {
        const res = await postJson(`${BASE_URL}/sendPasswordChangeNotification`, { userName: 'No Email' });
        if (res.status === 400) {
            console.log('  PASSED — correctly returned 400');
            passed++;
        } else {
            console.error('  FAILED — Expected 400, got:', res.status);
            failed++;
        }
    } catch (err) {
        console.error('  ERROR:', err.message);
        failed++;
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`  Results: ${passed} passed, ${failed} failed`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    if (failed > 0) process.exit(1);
}

runTests().catch(err => { console.error('Fatal:', err); process.exit(1); });
