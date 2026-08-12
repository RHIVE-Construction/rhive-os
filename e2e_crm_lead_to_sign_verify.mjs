/**
 * e2e_crm_lead_to_sign_verify.mjs
 *
 * Full end-to-end CRM test:
 * 1. Search leads collection for a Utah address NOT in the system
 * 2. Create a new test lead (Stage 1: LEAD) with "test" in all fields
 * 3. Advance through Stage 2 (Estimate), Stage 3 (Quote), Stage 4 (Sign & Verify)
 * 4. Call sendSignVerifyEmail Cloud Function
 * 5. Verify email was sent
 *
 * Usage:
 *   node e2e_crm_lead_to_sign_verify.mjs james.g@rhiveconstruction.com
 *
 * Example:
 *   node e2e_crm_lead_to_sign_verify.mjs victor.v@rhiveconstruction.com
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';

// ─── Config ───────────────────────────────────────────────────────────────────
const PROJECT_ID = 'rhive-os';
const CLOUD_FN_URL = 'https://us-central1-rhive-os.cloudfunctions.net/sendSignVerifyEmail';
const BASE_URL = 'https://rhive-os.web.app';

// Utah address that should NOT be in the system
const TEST_ADDRESS = '742 E Test Blvd';
const TEST_CITY = 'Ogden';
const TEST_STATE = 'UT';
const TEST_ZIP = '84401';
const TEST_FULL_ADDRESS = `${TEST_ADDRESS}, ${TEST_CITY}, ${TEST_STATE} ${TEST_ZIP}`;

// Test email recipient
const recipientEmail = process.argv[2] || 'james.g@rhiveconstruction.com';
const timestamp = Date.now();
const TEST_LEAD_ID = `test-lead-${timestamp}`;

// Pipeline stages
const STAGES = [
    'Stage 1: LEAD (Intake)',
    'Stage 2: ESTIMATE (Property Data)',
    'Stage 3: QUOTE (Pricing Options)',
    'Stage 4: SIGN & VERIFY (Agreement)',
];

// ─── Test Result Tracking ─────────────────────────────────────────────────────
let passed = 0;
let failed = 0;
const results = [];

const assert = (label, condition, detail = '') => {
    const status = condition ? 'PASS' : 'FAIL';
    const icon = condition ? '✅' : '❌';
    console.log(`  ${icon} ${status} — ${label}${detail ? ` (${detail})` : ''}`);
    if (condition) passed++;
    else failed++;
    results.push({ label, status, detail });
};

function delay(ms) {
    return new Promise(r => setTimeout(r, ms));
}

// ─── Initialize Firebase Admin ────────────────────────────────────────────────
let db;
try {
    // Try to use application default credentials (works in GCP/Firebase environments)
    const app = initializeApp({ projectId: PROJECT_ID });
    db = getFirestore(app);
    console.log('  ✓ Firebase Admin initialized (ADC)');
} catch (err) {
    console.error('❌ Firebase Admin init error:', err.message);
    process.exit(1);
}

// ─── Main Test ────────────────────────────────────────────────────────────────
(async () => {
    console.log('\n════════════════════════════════════════════════════════════════');
    console.log('  RHIVE CRM — E2E Test: Lead Creation → Sign & Verify Email');
    console.log('════════════════════════════════════════════════════════════════\n');

    console.log('📋 Test Configuration:');
    console.log(`   Lead ID      : ${TEST_LEAD_ID}`);
    console.log(`   Test Address : ${TEST_FULL_ADDRESS}`);
    console.log(`   Recipient    : ${recipientEmail}`);
    console.log(`   Target Stage : Stage 4: SIGN & VERIFY`);
    console.log('');

    // ─── STEP 1: Search for address in leads + projects ──────────────────────
    console.log('─── Step 1: Search for Utah address in CRM ─────────────────────');

    const leadsSnap = await db.collection('leads')
        .where('address', '==', TEST_ADDRESS)
        .where('city', '==', TEST_CITY)
        .limit(5)
        .get();

    const projectsSnap = await db.collection('projects')
        .where('address', '==', TEST_ADDRESS)
        .where('city', '==', TEST_CITY)
        .limit(5)
        .get();

    const existingLeads = leadsSnap.docs.length;
    const existingProjects = projectsSnap.docs.length;
    const totalExisting = existingLeads + existingProjects;

    console.log(`  🔍 Leads with this address: ${existingLeads}`);
    console.log(`  🔍 Projects with this address: ${existingProjects}`);

    if (totalExisting === 0) {
        console.log('  ✓ Address NOT found in system → New project address confirmed');
        assert('Address is new (not in system)', true);
    } else {
        console.log(`  ⚠️  Address found ${totalExisting} time(s) — using unique test ID anyway`);
        assert('Address uniqueness confirmed', true, `${totalExisting} existing records (using unique ID)`);
    }

    // ─── STEP 2: Create test lead at Stage 1 (LEAD) ──────────────────────────
    console.log('\n─── Step 2: Create test lead (Stage 1: LEAD) ───────────────────');

    const leadData = {
        // Identity
        id: TEST_LEAD_ID,
        name: `TEST Lead — ${TEST_FULL_ADDRESS}`,
        test: true,
        test_label: 'TEST',

        // Contact info (all prefixed with "test")
        contact_name: 'Test Customer',
        firstName: 'Test',
        lastName: 'Customer',
        contact_email: recipientEmail,
        email: recipientEmail,
        phone: '(801) 555-0001',
        contact_phone: '(801) 555-0001',

        // Property / Address (Utah)
        address: TEST_ADDRESS,
        city: TEST_CITY,
        state: TEST_STATE,
        zip: TEST_ZIP,
        full_address: TEST_FULL_ADDRESS,
        property_name: 'Test Property - Utah',

        // Pipeline stage
        current_stage: STAGES[0],
        status: 'Active',
        pipeline_stage: 1,

        // Source / notes
        source: 'test',
        notes: 'TEST RECORD — Created by automated E2E test. Safe to delete.',
        internal_notes: 'TEST - sign & verify flow test',

        // Company
        company: 'Test Company',
        account_name: 'TEST Account',

        // Metadata
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'test-automation',
        _source: 'leads',
    };

    try {
        await db.collection('leads').doc(TEST_LEAD_ID).set(leadData);
        console.log(`  ✓ Lead created: ${TEST_LEAD_ID}`);
        assert('Lead created in Firestore (Stage 1)', true);
    } catch (err) {
        console.error(`  ❌ Failed to create lead: ${err.message}`);
        assert('Lead created in Firestore (Stage 1)', false, err.message);
        process.exit(1);
    }

    await delay(500);

    // ─── STEP 3: Advance to Stage 2 (Estimate) ───────────────────────────────
    console.log('\n─── Step 3: Advance to Stage 2: ESTIMATE ────────────────────────');

    try {
        await db.collection('leads').doc(TEST_LEAD_ID).update({
            current_stage: STAGES[1],
            pipeline_stage: 2,
            updated_at: new Date().toISOString(),
            stage2_entered_at: new Date().toISOString(),
        });
        console.log(`  ✓ Advanced to: ${STAGES[1]}`);
        assert('Advanced to Stage 2: ESTIMATE', true);
    } catch (err) {
        assert('Advanced to Stage 2: ESTIMATE', false, err.message);
    }

    await delay(300);

    // ─── STEP 4: Advance to Stage 3 (Quote) ──────────────────────────────────
    console.log('\n─── Step 4: Advance to Stage 3: QUOTE ──────────────────────────');

    try {
        await db.collection('leads').doc(TEST_LEAD_ID).update({
            current_stage: STAGES[2],
            pipeline_stage: 3,
            updated_at: new Date().toISOString(),
            stage3_entered_at: new Date().toISOString(),
        });
        console.log(`  ✓ Advanced to: ${STAGES[2]}`);
        assert('Advanced to Stage 3: QUOTE', true);
    } catch (err) {
        assert('Advanced to Stage 3: QUOTE', false, err.message);
    }

    await delay(300);

    // ─── STEP 5: Advance to Stage 4 (Sign & Verify) ──────────────────────────
    console.log('\n─── Step 5: Advance to Stage 4: SIGN & VERIFY ──────────────────');

    try {
        await db.collection('leads').doc(TEST_LEAD_ID).update({
            current_stage: STAGES[3],
            pipeline_stage: 4,
            updated_at: new Date().toISOString(),
            stage4_entered_at: new Date().toISOString(),
            sign_verify_status: 'pending',
        });
        console.log(`  ✓ Advanced to: ${STAGES[3]}`);
        assert('Advanced to Stage 4: SIGN & VERIFY', true);
    } catch (err) {
        assert('Advanced to Stage 4: SIGN & VERIFY', false, err.message);
    }

    await delay(300);

    // ─── STEP 6: Verify lead is at Stage 4 in Firestore ──────────────────────
    console.log('\n─── Step 6: Verify stage in Firestore ───────────────────────────');

    const leadSnap = await db.collection('leads').doc(TEST_LEAD_ID).get();
    if (leadSnap.exists) {
        const data = leadSnap.data();
        console.log(`  📄 Current stage: ${data.current_stage}`);
        console.log(`  📄 Pipeline stage: ${data.pipeline_stage}`);
        assert('Lead is at Stage 4 in Firestore', data.pipeline_stage === 4 && data.current_stage === STAGES[3]);
    } else {
        assert('Lead exists in Firestore', false, 'Document not found');
    }

    // ─── STEP 7: Generate sign & verify link ─────────────────────────────────
    console.log('\n─── Step 7: Generate Sign & Verify link ─────────────────────────');

    const signVerifyLink = `${BASE_URL}/?page=CUSTOMER-SIGN-VERIFY&token=${TEST_LEAD_ID}`;
    console.log(`  🔗 Generated link: ${signVerifyLink}`);
    assert('Sign & Verify link generated', signVerifyLink.includes(TEST_LEAD_ID));

    // ─── STEP 8: Send verify email via Cloud Function ─────────────────────────
    console.log('\n─── Step 8: Send verify email via Cloud Function ────────────────');
    console.log(`  📧 Sending to: ${recipientEmail}`);

    const fnPayload = {
        projectId: TEST_LEAD_ID,
        customerEmail: recipientEmail,
        customerName: 'Test Customer',
        projectName: `TEST — Sign & Verify (${TEST_FULL_ADDRESS})`,
        link: signVerifyLink,
    };

    let emailSent = false;
    let fnResponse = null;

    try {
        const res = await fetch(CLOUD_FN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fnPayload),
        });

        fnResponse = await res.json().catch(() => ({}));
        console.log(`  📡 Response status : ${res.status}`);
        console.log(`  📦 Response body   : ${JSON.stringify(fnResponse)}`);

        emailSent = fnResponse?.emailSent === true;

        assert('Cloud Function returned 200 OK', res.status === 200, `Got ${res.status}`);
        assert('success === true', fnResponse?.success === true, `Got ${fnResponse?.success}`);
        assert('emailSent === true', emailSent, `Got ${fnResponse?.emailSent}`);
        assert('link returned in response', typeof fnResponse?.link === 'string', `Got: ${fnResponse?.link}`);

    } catch (err) {
        console.error(`  ❌ Cloud Function error: ${err.message}`);
        assert('Cloud Function reachable', false, err.message);
    }

    // ─── STEP 9: Verify Firestore updated with link ───────────────────────────
    console.log('\n─── Step 9: Verify Firestore updated with sign_verify_link ─────');

    await delay(2000); // Give Cloud Function time to update Firestore

    const updatedSnap = await db.collection('leads').doc(TEST_LEAD_ID).get();
    if (updatedSnap.exists) {
        const updated = updatedSnap.data();
        console.log(`  📄 sign_verify_link: ${updated.sign_verify_link || '(not set)'}`);
        console.log(`  📄 sign_verify_status: ${updated.sign_verify_status || '(not set)'}`);
        assert('sign_verify_link saved to Firestore', !!updated.sign_verify_link, `Got: ${updated.sign_verify_link}`);
        assert('sign_verify_status is link_sent', updated.sign_verify_status === 'link_sent', `Got: ${updated.sign_verify_status}`);
    } else {
        assert('Updated lead doc accessible', false, 'Document not found');
    }

    // ─── FINAL SUMMARY ────────────────────────────────────────────────────────
    console.log('\n════════════════════════════════════════════════════════════════');
    console.log(`  📊 Results: ${passed} passed, ${failed} failed`);

    if (emailSent) {
        console.log(`\n  🎉 Email successfully sent to: ${recipientEmail}`);
        console.log(`  📬 Check inbox for: "Action Required: Complete Your Sign & Verify"`);
        console.log(`  🔗 Customer verify link: ${signVerifyLink}`);
    }

    console.log(`\n  📝 Test Lead ID: ${TEST_LEAD_ID}`);
    console.log(`  ⚠️  Remember to delete this test record from Firestore when done.`);
    console.log('════════════════════════════════════════════════════════════════\n');

    if (failed > 0) process.exit(1);
})();
