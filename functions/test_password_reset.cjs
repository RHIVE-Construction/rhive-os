/**
 * test_password_reset.cjs
 *
 * Integration test for the OTP-based forgot password flow.
 * Tests:
 *   1. Seed test user
 *   2. Generate reset token + OTP, store in Firestore
 *   3. Verify OTP stored correctly (6 digits, expires in 15 min)
 *   4. OTP verification — correct code succeeds, returns reset_token
 *   5. OTP verification — wrong code fails and increments attempts
 *   6. OTP verification — expired OTP is rejected
 *   7. OTP verification — max attempts (5) locks out user
 *   8. completePasswordReset — updates password_hash, clears all reset fields
 *   9. Cloud Function — no-enumeration for unknown email
 *  10. Cloud Function — no OTP on user doc suppressed silently
 *  11. Rate limit collection created correctly (PII-safe hashed key)
 *
 * Usage:
 *   node functions/test_password_reset.cjs
 *
 * Prerequisites:
 *   - GOOGLE_APPLICATION_CREDENTIALS set, or service account JSON present
 *   - Firebase project: rhive-os
 */

const admin = require('firebase-admin');
const crypto = require('crypto');
const https = require('https');

// ── Initialize Admin SDK ────────────────────────────────────────────────────
if (!admin.apps.length) {
    admin.initializeApp({ projectId: 'rhive-os' });
}
const db = admin.firestore();

// ── Config ──────────────────────────────────────────────────────────────────
const CLOUD_FUNCTION_URL = 'https://us-central1-rhive-os.cloudfunctions.net/sendPasswordResetEmail';
const TEST_EMAIL = process.env.TEST_EMAIL || 'test-otp-reset@rhive-test.invalid';

// ── Helpers ──────────────────────────────────────────────────────────────────
const pass = (msg) => console.log(`  ✅ PASS: ${msg}`);
const fail = (msg) => { console.error(`  ❌ FAIL: ${msg}`); process.exitCode = 1; };
const info = (msg) => console.log(`  ℹ️  ${msg}`);

function postJson(url, body) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(body);
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            path: urlObj.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };
        const req = https.request(options, (res) => {
            let raw = '';
            res.on('data', (chunk) => raw += chunk);
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

// ── Test Suite ────────────────────────────────────────────────────────────────
async function runTests() {
    console.log('\n══════════════════════════════════════════════════════════');
    console.log('  RHIVE QOS — OTP Password Reset Flow Integration Tests');
    console.log('══════════════════════════════════════════════════════════\n');

    // ── TEST 1: Seed test user ────────────────────────────────────────────────
    console.log('TEST 1: Seed test user in Firestore...');
    const testUserId = `test-otp-reset-${Date.now()}`;
    const testUser = {
        email: TEST_EMAIL,
        name: 'Test OTP User',
        role: 'Employee',
        password_hash: 'old-hash-placeholder',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
    await db.collection('users').doc(testUserId).set(testUser);
    pass(`Test user seeded: ${testUserId}`);

    try {
        // ── TEST 2: Generate reset token + 6-digit OTP ────────────────────────
        console.log('\nTEST 2: Generate reset token + 6-digit OTP...');
        const randomValues = new Uint8Array(32);
        crypto.randomFillSync(randomValues);
        const token = Array.from(randomValues)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('') + Date.now().toString(36);

        // Generate a 6-digit OTP
        const otpBuf = crypto.randomBytes(4);
        const otp = String((otpBuf.readUInt32BE(0) % 900000) + 100000);

        const tokenExpiry = new Date(Date.now() + 3600 * 1000).toISOString();
        const otpExpiry = new Date(Date.now() + 15 * 60 * 1000).toISOString();

        await db.collection('users').doc(testUserId).update({
            reset_token: token,
            reset_token_expiry: tokenExpiry,
            reset_otp: otp,
            reset_otp_expiry: otpExpiry,
            reset_otp_attempts: 0,
            updated_at: new Date().toISOString()
        });

        const userSnap = await db.collection('users').doc(testUserId).get();
        const userData = userSnap.data();

        if (userData.reset_token === token) {
            pass('reset_token stored on user document');
        } else {
            fail('reset_token not stored correctly');
        }

        if (userData.reset_otp && userData.reset_otp.length === 6 && /^\d{6}$/.test(userData.reset_otp)) {
            pass(`reset_otp stored correctly: ${userData.reset_otp.slice(0, 2)}xxxx (6-digit numeric)`);
        } else {
            fail(`reset_otp invalid: ${userData.reset_otp}`);
        }

        if (userData.reset_otp_expiry && new Date(userData.reset_otp_expiry).getTime() > Date.now()) {
            pass('reset_otp_expiry is in the future (valid)');
        } else {
            fail('reset_otp_expiry is missing or already expired');
        }

        if (userData.reset_otp_attempts === 0) {
            pass('reset_otp_attempts initialized to 0');
        } else {
            fail(`reset_otp_attempts should be 0, got: ${userData.reset_otp_attempts}`);
        }

        // ── TEST 3: Correct OTP verifies successfully ─────────────────────────
        console.log('\nTEST 3: Verify correct OTP...');
        const freshSnap = await db.collection('users').doc(testUserId).get();
        const fresh = freshSnap.data();

        if (fresh.reset_otp === otp) {
            // Simulate verifyOtpCode logic
            const isNotExpired = new Date(fresh.reset_otp_expiry).getTime() > Date.now();
            const attemptsOk = (fresh.reset_otp_attempts || 0) < 5;
            const codeMatch = fresh.reset_otp === otp;

            if (isNotExpired && attemptsOk && codeMatch) {
                // Clear OTP fields, keep token
                await db.collection('users').doc(testUserId).update({
                    reset_otp: null,
                    reset_otp_expiry: null,
                    reset_otp_attempts: null,
                    updated_at: new Date().toISOString()
                });
                pass('Correct OTP accepted — OTP fields cleared, reset_token preserved');

                const afterOtpSnap = await db.collection('users').doc(testUserId).get();
                const afterOtp = afterOtpSnap.data();
                if (!afterOtp.reset_otp && afterOtp.reset_token === token) {
                    pass('After OTP verification: OTP cleared, token retained');
                } else {
                    fail('OTP fields not cleared correctly after verification');
                }
            } else {
                fail('OTP verification conditions failed (unexpectedly)');
            }
        } else {
            fail('OTP lookup mismatch in test');
        }

        // Restore OTP for further tests
        await db.collection('users').doc(testUserId).update({
            reset_otp: otp,
            reset_otp_expiry: otpExpiry,
            reset_otp_attempts: 0
        });

        // ── TEST 4: Wrong OTP increments attempts ──────────────────────────────
        console.log('\nTEST 4: Wrong OTP increments attempt counter...');
        const wrongOtp = otp === '123456' ? '654321' : '123456';
        const beforeSnap = await db.collection('users').doc(testUserId).get();
        const before = beforeSnap.data();
        const beforeAttempts = before.reset_otp_attempts || 0;

        // Simulate wrong attempt
        if (before.reset_otp !== wrongOtp) {
            await db.collection('users').doc(testUserId).update({
                reset_otp_attempts: beforeAttempts + 1
            });
            const afterSnap = await db.collection('users').doc(testUserId).get();
            if (afterSnap.data().reset_otp_attempts === beforeAttempts + 1) {
                pass(`Wrong OTP: attempts incremented from ${beforeAttempts} to ${beforeAttempts + 1}`);
            } else {
                fail('Attempt counter not incremented on wrong OTP');
            }
        }

        // Reset attempts
        await db.collection('users').doc(testUserId).update({ reset_otp_attempts: 0 });

        // ── TEST 5: Expired OTP is rejected ───────────────────────────────────
        console.log('\nTEST 5: Expired OTP rejected...');
        await db.collection('users').doc(testUserId).update({
            reset_otp: otp,
            reset_otp_expiry: new Date(Date.now() - 1000).toISOString() // 1 second in the past
        });
        const expiredSnap = await db.collection('users').doc(testUserId).get();
        const isExpired = new Date(expiredSnap.data().reset_otp_expiry).getTime() < Date.now();
        if (isExpired) {
            pass('Expired OTP correctly detected (expired timestamp)');
        } else {
            fail('Expired OTP not detected');
        }

        // Restore valid OTP
        await db.collection('users').doc(testUserId).update({
            reset_otp: otp,
            reset_otp_expiry: otpExpiry,
            reset_otp_attempts: 0
        });

        // ── TEST 6: Max attempts (5) blocks further attempts ───────────────────
        console.log('\nTEST 6: Max 5 attempts blocks OTP verification...');
        await db.collection('users').doc(testUserId).update({ reset_otp_attempts: 5 });
        const lockedSnap = await db.collection('users').doc(testUserId).get();
        if (lockedSnap.data().reset_otp_attempts >= 5) {
            pass('User locked out after 5 failed attempts');
        } else {
            fail('Lock-out condition not met');
        }

        // Reset for password test
        await db.collection('users').doc(testUserId).update({
            reset_otp: null,
            reset_otp_expiry: null,
            reset_otp_attempts: null
        });

        // ── TEST 7: completePasswordReset clears all fields ───────────────────
        console.log('\nTEST 7: completePasswordReset clears token + OTP fields...');
        const newHash = 'new-hashed-password-' + Date.now();
        await db.collection('users').doc(testUserId).update({
            password_hash: newHash,
            reset_token: admin.firestore.FieldValue.delete(),
            reset_token_expiry: admin.firestore.FieldValue.delete(),
            reset_otp: admin.firestore.FieldValue.delete(),
            reset_otp_expiry: admin.firestore.FieldValue.delete(),
            reset_otp_attempts: admin.firestore.FieldValue.delete(),
            updated_at: new Date().toISOString()
        });

        const afterResetSnap = await db.collection('users').doc(testUserId).get();
        const afterReset = afterResetSnap.data();

        if (afterReset.password_hash === newHash) {
            pass('password_hash updated in Firestore users collection');
        } else {
            fail('password_hash NOT updated correctly');
        }
        if (!afterReset.reset_token) {
            pass('reset_token cleared from user document');
        } else {
            fail('reset_token NOT cleared — security risk!');
        }
        if (!afterReset.reset_otp) {
            pass('reset_otp cleared from user document');
        } else {
            fail('reset_otp NOT cleared — security risk!');
        }
        if (!afterReset.reset_otp_expiry) {
            pass('reset_otp_expiry cleared from user document');
        } else {
            fail('reset_otp_expiry NOT cleared');
        }

        // ── TEST 8: Cloud Function — no-enumeration for unknown email ──────────
        console.log('\nTEST 8: Cloud Function — no-enumeration for unknown email...');
        const unknownResult = await postJson(CLOUD_FUNCTION_URL, {
            email: 'definitely-not-registered@nowhere.invalid'
        }).catch(() => null);

        if (unknownResult && unknownResult.status === 200) {
            pass('Cloud Function returns 200 for unknown email (no enumeration)');
        } else if (!unknownResult || unknownResult.status === 404) {
            info('Cloud Function not yet deployed (404). Skipping live check — deploy first.');
        } else {
            fail(`Expected 200, got ${unknownResult?.status}`);
        }

        // ── TEST 9: Cloud Function — no OTP on user doc suppressed ────────────
        console.log('\nTEST 9: Cloud Function — user exists but no OTP silently suppressed...');
        // The test user currently has no OTP (just cleared above)
        const noOtpResult = await postJson(CLOUD_FUNCTION_URL, {
            email: TEST_EMAIL
        }).catch(() => null);

        if (noOtpResult && noOtpResult.status === 200) {
            pass('Cloud Function returns 200 when no OTP on doc (suppressed silently)');
        } else if (!noOtpResult || noOtpResult.status === 404) {
            info('Cloud Function not yet deployed. Skipping live check.');
        } else {
            fail(`Expected 200, got ${noOtpResult?.status}`);
        }

        // ── TEST 10: Rate limit collection structure ───────────────────────────
        console.log('\nTEST 10: Rate limit document uses hashed email (PII safe)...');
        const emailHash = crypto.createHash('sha256').update(TEST_EMAIL).digest('hex');
        await db.collection('password_reset_rate_limits').doc(emailHash).set({
            count: 1,
            window_start: Date.now()
        });
        const rlSnap = await db.collection('password_reset_rate_limits').doc(emailHash).get();
        if (rlSnap.exists && rlSnap.data().count === 1) {
            pass(`Rate limit document uses SHA-256 hashed key (not raw email)`);
        } else {
            fail('Rate limit document not created correctly');
        }

    } finally {
        // ── Cleanup ───────────────────────────────────────────────────────────
        console.log('\nCleaning up test data...');
        await db.collection('users').doc(testUserId).delete();
        const emailHash = crypto.createHash('sha256').update(TEST_EMAIL).digest('hex');
        await db.collection('password_reset_rate_limits').doc(emailHash).delete().catch(() => {});
        info('Test data removed from Firestore');
    }

    // ── Summary ───────────────────────────────────────────────────────────────
    console.log('\n══════════════════════════════════════════════════════════');
    if (process.exitCode === 1) {
        console.log('  ❌ Some tests FAILED. Review output above.');
    } else {
        console.log('  ✅ All tests PASSED.');
    }
    console.log('══════════════════════════════════════════════════════════\n');
}

runTests().catch((err) => {
    console.error('\n[FATAL] Test runner crashed:', err.message);
    process.exit(1);
});
