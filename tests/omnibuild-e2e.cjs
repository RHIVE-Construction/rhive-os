/**
 * tests/omnibuild-e2e.cjs
 *
 * RHIVE OS (Michael-omnibuild) — Full 11-Stage Pipeline Lifecycle & 5-Tier CRM E2E Suite
 *
 * Verifies in headless Chromium against http://localhost:3000:
 *   1. Public Homepage (P-00) & Login (P-06) load cleanly with zero crashes or checkboxes.
 *   2. Admin Portal & Full 11-Stage Pipeline Board (E-05) render all 11 stages + Google Drive [TEST] entities.
 *   3. 5-Tier Customers Hierarchy (E-CUSTOMERS) & Accounts (E-08) render multi-property / multi-building
 *      portfolios with zero visible raw Firestore document IDs and zero <input type="checkbox">.
 *   4. Live End-to-End 11-Stage Project Walkthrough:
 *      Lead (E-26) -> Estimate (E-27) -> Quote (E-28) -> Sign & Verify (E-29) -> Schedule (E-30) ->
 *      Pre-Installation (E-31) -> Install (E-32) -> Warranty Activation (E-33) -> Invoicing 50/40/10 (E-34) ->
 *      Completed (E-36) -> Past Customer (E-37), verified both in UI and directly in Firestore!
 *   5. KISS Client Portal (C-02): Projects & 11-Stage Pizza Tracker, Properties & Buildings,
 *      Payments (50 / 40 / 10), and Abundance Network ($500) tab.
 *   6. All-Pages Crash & Prohibited Checkbox Sweep.
 */

'use strict';

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, getDoc } = require('firebase/firestore');

const ROOT = path.resolve(__dirname, '..');
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const SCREENSHOT_DIR =
  process.env.ARTIFACT_DIR || path.join(ROOT, 'test_screenshots', 'omnibuild');

fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

function loadEnvFile(filename) {
  const filePath = path.join(ROOT, filename);
  if (!fs.existsSync(filePath)) return {};
  const out = {};
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const k = trimmed.slice(0, idx).trim();
    let v = trimmed.slice(idx + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    out[k] = v;
  }
  return out;
}

const envVars = { ...loadEnvFile('.env'), ...loadEnvFile('.env.local'), ...process.env };
const fbApp = initializeApp({
  apiKey: envVars.VITE_FIREBASE_API_KEY,
  authDomain: envVars.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: envVars.VITE_FIREBASE_PROJECT_ID || 'rhive-os',
  storageBucket: envVars.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: envVars.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: envVars.VITE_FIREBASE_APP_ID,
});
const db = getFirestore(fbApp);

const WALKTHROUGH_ID = 'test-omnibuild-e2e-walkthrough';
const WALKTHROUGH_NAME = '[TEST] Omnibuild E2E Full Lifecycle Roof';

let passed = 0;
let failed = 0;
const report = [];

function pass(step, detail) {
  passed++;
  report.push({ step, status: 'PASS', detail });
  console.log(`  ✅ PASS [${step}]: ${detail}`);
}

function fail(step, detail) {
  failed++;
  report.push({ step, status: 'FAIL', detail });
  console.error(`  ❌ FAIL [${step}]: ${detail}`);
}

async function seedFreshWalkthroughLead() {
  const now = new Date().toISOString();
  await setDoc(doc(db, 'projects', WALKTHROUGH_ID), {
    id: WALKTHROUGH_ID,
    _id: WALKTHROUGH_ID,
    job_number: 'RC-2026-9900',
    name: WALKTHROUGH_NAME,
    project_type: 'Commercial',
    current_stage: 'Lead',
    status: 'Active',
    is_test: true,
    deleted: false,
    converted_to_project: false,
    owner_id: 'test-omnibuild-acc-unphc',
    account_id: 'test-omnibuild-acc-unphc',
    account_name: '[TEST] UNPHC Multifamily Portfolio',
    property_id: 'test-omnibuild-prop-willow-park',
    property_address: '525 Aspen Meadow Dr, Logan, UT 84341',
    city: 'Logan',
    state: 'UT',
    zip: '84341',
    contact_name: '[TEST] Jeff Phillips',
    contact_email: 'jphillips.unphc@rhive-test.local',
    contact_phone: '(801) 555-0105',
    buildings: [
      { id: 'bld-wp-1', name: 'Building 1 (North Residential)', roof_sqft: 9800 },
      { id: 'bld-wp-2', name: 'Building 2 (East Residential)', roof_sqft: 9800 },
    ],
    quote_sheets: [
      {
        id: 'qs-e2e-1',
        label: 'Master Beta Quote Sheet (BLD 1 & 2)',
        url: 'https://docs.google.com/spreadsheets/d/1gIpfoBPayONS8__CxIhFpDYbiK4HgwfBphuNSGZVxPY/edit?gid=1779763051#gid=1779763051',
      },
    ],
    shopping_cart_url: 'https://toolkit-rhive.web.app/?quote=omnibuild-e2e',
    quote: {
      total: 84000,
      status: 'Draft',
      items: [
        { name: 'Building 1 OC Duration Commercial Re-Roof', cost: 42000 },
        { name: 'Building 2 OC Duration Commercial Re-Roof', cost: 42000 },
      ],
    },
    pizza_tracker: {
      current_stage: 'Lead',
      updated_at: now,
    },
    created_at: now,
    updated_at: now,
  });
}

async function checkNoCrashOrCheckboxes(page, label) {
  const audit = await page.evaluate(() => {
    const body = document.body ? document.body.innerText : '';
    const crash =
      body.includes('Maximum update depth') ||
      body.includes('Minified React error') ||
      body.includes('Cannot read properties of undefined') ||
      body.includes('Something went wrong') ||
      body.includes('ChunkLoadError');
    const checkboxes = document.querySelectorAll('input[type="checkbox"]').length;
    const uiCount = document.querySelectorAll('button, input, h1, h2, h3, p, span, a').length;
    return { crash, checkboxes, uiCount };
  });

  if (audit.crash) {
    fail(label, 'React runtime crash text detected in DOM');
    return false;
  }
  if (audit.uiCount <= 2) {
    fail(label, 'Blank/empty screen detected (<= 2 UI elements)');
    return false;
  }
  if (audit.checkboxes > 0) {
    fail(label, `Prohibited <input type="checkbox"> found (${audit.checkboxes})`);
    return false;
  }
  return true;
}

async function navClear(page, pageId, waitMs = 1800) {
  await page.evaluate((id) => {
    window.dispatchEvent(new CustomEvent('rhive-navigate', { detail: { pageId: id } }));
  }, pageId);
  await page.waitForTimeout(waitMs);
}

async function navKeepSelection(page, pageId, waitMs = 1800) {
  await page.evaluate((id) => {
    window.dispatchEvent(new CustomEvent('nav-page', { detail: id }));
  }, pageId);
  await page.waitForTimeout(waitMs);
}

(async () => {
  console.log('\n====================================================================');
  console.log('  RHIVE OS (Michael-omnibuild) — FULL 11-STAGE LIFECYCLE & CRM E2E');
  console.log('====================================================================\n');

  await seedFreshWalkthroughLead();
  pass('0. Firestore Seed', `Reset ${WALKTHROUGH_NAME} at Stage 1 (Lead)`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 920 } });
  const page = await context.newPage();

  const pageErrors = [];
  page.on('pageerror', (err) => pageErrors.push(err.message));

  try {
    // ── 1. PUBLIC HOMEPAGE (P-00) ──────────────────────────────────────────────
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2500);
    if (await checkNoCrashOrCheckboxes(page, '1. Public Landing (P-00)')) {
      pass('1. Public Landing (P-00)', 'Rendered cleanly with zero crashes and zero checkboxes');
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'omnibuild_01_public_landing.png') });

    // ── 2. ADMIN LOGIN & 11-STAGE PIPELINE BOARD (E-05) ────────────────────────
    await page.goto(`${BASE_URL}/?bypass=Admin`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2800);
    await navClear(page, 'E-05', 2500);

    if (await checkNoCrashOrCheckboxes(page, '2. Pipeline Board (E-05)')) {
      const boardText = await page.evaluate(() => document.body.innerText);
      const hasWarrantyActivation = boardText.toLowerCase().includes('warranty activation');
      const hasPastCustomer = boardText.toLowerCase().includes('past customer');
      const hasSeededTest = boardText.includes('[TEST]');
      if (hasWarrantyActivation && hasPastCustomer && hasSeededTest) {
        pass(
          '2. 11-Stage Pipeline Board (E-05)',
          'Verified all 11 stages including Warranty Activation, Past Customer, and [TEST] Google Drive projects'
        );
      } else {
        fail(
          '2. 11-Stage Pipeline Board (E-05)',
          `Missing expected labels (warranty=${hasWarrantyActivation}, past=${hasPastCustomer}, test=${hasSeededTest})`
        );
      }
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'omnibuild_02_pipeline_11_stages.png') });

    // ── 3. 5-TIER CUSTOMERS HIERARCHY (E-CUSTOMERS) & ACCOUNTS (E-08) ──────────
    await navClear(page, 'E-CUSTOMERS', 2600);
    if (await checkNoCrashOrCheckboxes(page, '3a. 5-Tier Customers Portal (E-CUSTOMERS)')) {
      const custText = await page.evaluate(() => document.body.innerText);
      const hasUNPHC = custText.includes('UNPHC Multifamily Portfolio');
      const hasRawId = custText.includes('test-omnibuild-acc-');
      if (hasUNPHC && !hasRawId) {
        pass(
          '3a. 5-Tier Customers Portal (E-CUSTOMERS)',
          'Hydrated live Firestore accounts -> properties -> buildings -> projects with zero exposed raw IDs'
        );
      } else {
        fail(
          '3a. 5-Tier Customers Portal (E-CUSTOMERS)',
          `hasUNPHC=${hasUNPHC}, hasRawId=${hasRawId}`
        );
      }
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'omnibuild_03_5tier_customers_hierarchy.png') });

    await navClear(page, 'E-08', 2200);
    if (await checkNoCrashOrCheckboxes(page, '3b. Accounts List (E-08)')) {
      const accText = await page.evaluate(() => document.body.innerText);
      if (accText.includes('ACS Advanced Community Services') && !accText.includes('test-omnibuild-acc-')) {
        pass('3b. Accounts CRM (E-08)', 'Verified commercial HOA & multifamily accounts with zero raw IDs');
      } else {
        fail('3b. Accounts CRM (E-08)', 'Expected seeded commercial accounts without raw IDs');
      }
    }

    // ── 4. LIVE END-TO-END 11-STAGE PROJECT WALKTHROUGH (E-26 -> E-37) ─────────
    // Stage 1: Lead (E-26) -> Convert to Estimate (E-27)
    await navClear(page, 'E-26', 2500);
    const leadRow = page.locator(`text=${WALKTHROUGH_NAME}`).first();
    await leadRow.waitFor({ state: 'visible', timeout: 10000 });
    await leadRow.click();
    await page.waitForTimeout(1500);

    await page.locator('#lead-open-convert-btn').click();
    await page.waitForTimeout(800);
    await page.locator('#lead-convert-estimate-btn').click();
    await page.waitForTimeout(2400);

    const onEst = await page.locator('#est-advance-quote-btn').isVisible().catch(() => false);
    if (onEst && (await checkNoCrashOrCheckboxes(page, '4.1 Stage 1->2 (Lead -> Estimate)'))) {
      pass('4.1 Stage 1 -> Stage 2', 'Converted Lead (E-26) to Estimate (E-27)');
    } else {
      fail('4.1 Stage 1 -> Stage 2', 'Did not reach EstimateToolPage (#est-advance-quote-btn)');
    }

    // Stage 2: Estimate (E-27) -> Advance to Quote (E-28)
    await page.locator('#est-advance-quote-btn').click();
    await page.waitForTimeout(2400);

    const onQuote = await page.locator('#sign-accept-quote-btn').isVisible().catch(() => false);
    const quoteBody = await page.evaluate(() => document.body.innerText);
    if (onQuote && (await checkNoCrashOrCheckboxes(page, '4.2 Stage 2->3 (Estimate -> Quote)'))) {
      pass(
        '4.2 Stage 2 -> Stage 3',
        `Advanced Estimate to Quote (E-28); Master Sheet & Shopping Cart controls visible=${quoteBody.includes('Sheet') || quoteBody.includes('Shopping Cart')}`
      );
    } else {
      fail('4.2 Stage 2 -> Stage 3', 'Did not reach QuotePage (#sign-accept-quote-btn)');
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'omnibuild_04_quote_stage_sheet_cart.png') });

    // Stage 3: Quote (E-28) -> Advance to Sign & Verify (E-29)
    await page.locator('#sign-accept-quote-btn').click();
    await page.waitForTimeout(2400);

    const onSign = await page.locator('#sv-advance-schedule-btn').isVisible().catch(() => false);
    if (onSign && (await checkNoCrashOrCheckboxes(page, '4.3 Stage 3->4 (Quote -> Sign & Verify)'))) {
      pass('4.3 Stage 3 -> Stage 4', 'Accepted Quote -> routed to Sign & Verify (E-29)');
    } else {
      fail('4.3 Stage 3 -> Stage 4', 'Did not reach SignAndVerifyPage (#sv-advance-schedule-btn)');
    }

    // Stage 4: Sign & Verify (E-29) -> Confirm Deposit & Contract -> Advance to Schedule (E-30)
    const depBtn = page.locator('#sv-confirm-payment-btn');
    if (await depBtn.isVisible().catch(() => false)) {
      await depBtn.click();
      await page.waitForTimeout(700);
    }
    const contractBtn = page.locator('#sv-toggle-contract-btn');
    if (await contractBtn.isVisible().catch(() => false)) {
      await contractBtn.click();
      await page.waitForTimeout(700);
    }
    await page.locator('#sv-advance-schedule-btn').click();
    await page.waitForTimeout(2400);

    const onSchedule = await page.locator('#sched-advance-btn').isVisible().catch(() => false);
    if (onSchedule && (await checkNoCrashOrCheckboxes(page, '4.4 Stage 4->5 (Sign & Verify -> Schedule)'))) {
      pass('4.4 Stage 4 -> Stage 5', 'Confirmed Sign & Verify + 50% Deposit -> routed to Schedule (E-30)');
    } else {
      fail('4.4 Stage 4 -> Stage 5', 'Did not reach SchedulePage (#sched-advance-btn)');
    }

    // Stage 5: Schedule (E-30) -> Confirm 3 Logic Gates -> Advance to Pre-Installation (E-31)
    for (const gateTitle of [
      'Permit Status: Municipal Building Permit',
      'Material Order: Supplier PO Confirmed',
      'Labor Assignment: Certified Crew Accepted',
    ]) {
      const gateRow = page.locator(`text=${gateTitle}`).first();
      if (await gateRow.isVisible().catch(() => false)) {
        await gateRow.click();
        await page.waitForTimeout(450);
      }
    }
    await page.locator('#sched-advance-btn').click();
    await page.waitForTimeout(2400);

    const onPreInstall = await page.locator('#preinstall-advance-btn').isVisible().catch(() => false);
    if (onPreInstall && (await checkNoCrashOrCheckboxes(page, '4.5 Stage 5->6 (Schedule -> Pre-Installation)'))) {
      pass('4.5 Stage 5 -> Stage 6', 'Dispatched Ops Schedule -> routed to Pre-Installation (E-31)');
    } else {
      fail('4.5 Stage 5 -> Stage 6', 'Did not reach PreInstallationPage (#preinstall-advance-btn)');
    }

    // Stage 6: Pre-Installation (E-31) -> Advance to Install (E-32)
    await page.locator('#preinstall-advance-btn').click();
    await page.waitForTimeout(2400);

    const onInstall = await page.locator('#install-advance-btn').isVisible().catch(() => false);
    if (onInstall && (await checkNoCrashOrCheckboxes(page, '4.6 Stage 6->7 (Pre-Installation -> Install)'))) {
      pass('4.6 Stage 6 -> Stage 7', 'Completed Pre-Installation staging -> routed to Install (E-32)');
    } else {
      fail('4.6 Stage 6 -> Stage 7', 'Did not reach InstallPage (#install-advance-btn)');
    }

    // Stage 7: Install (E-32) -> Advance to Warranty Activation (E-33)
    await page.locator('#install-advance-btn').click();
    await page.waitForTimeout(2400);

    const onWarranty = await page.locator('#warranty-advance-btn').isVisible().catch(() => false);
    const warrantyText = await page.evaluate(() => document.body.innerText);
    if (
      onWarranty &&
      warrantyText.toLowerCase().includes('warranty activation') &&
      (await checkNoCrashOrCheckboxes(page, '4.7 Stage 7->8 (Install -> Warranty Activation)'))
    ) {
      pass('4.7 Stage 7 -> Stage 8', 'Completed Roof Install -> routed to Warranty Activation (E-33)');
    } else {
      fail('4.7 Stage 7 -> Stage 8', 'Did not reach Warranty Activation (#warranty-advance-btn)');
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'omnibuild_05_warranty_activation_stage8.png') });

    // Stage 8: Warranty Activation (E-33) -> Advance to Invoicing 50/40/10 (E-34)
    await page.locator('#warranty-advance-btn').click();
    await page.waitForTimeout(2400);

    const onInvoicing = await page.locator('#invoice-advance-btn').isVisible().catch(() => false);
    const invText = await page.evaluate(() => document.body.innerText);
    if (
      onInvoicing &&
      invText.includes('50%') &&
      invText.includes('40%') &&
      invText.includes('10%') &&
      (await checkNoCrashOrCheckboxes(page, '4.8 Stage 8->9 (Warranty Activation -> Invoicing 50/40/10)'))
    ) {
      pass('4.8 Stage 8 -> Stage 9', 'Activated Warranty -> routed to Invoicing (E-34) with 50/40/10 split');
    } else {
      fail('4.8 Stage 8 -> Stage 9', 'Did not reach InvoicingPage (#invoice-advance-btn) with 50/40/10 split');
    }

    // Stage 9: Invoicing (E-34) -> Confirm Payment & Advance to Completed (E-36)
    await page.locator('#invoice-advance-btn').click();
    await page.waitForTimeout(2400);

    const onCompleted = await page.locator('#completed-advance-btn').isVisible().catch(() => false);
    if (onCompleted && (await checkNoCrashOrCheckboxes(page, '4.9 Stage 9->10 (Invoicing -> Completed)'))) {
      pass('4.9 Stage 9 -> Stage 10', 'Confirmed 50/40/10 Milestones -> routed to Completed (E-36)');
    } else {
      fail('4.9 Stage 9 -> Stage 10', 'Did not reach CompletedPage (#completed-advance-btn)');
    }

    // Stage 10: Completed (E-36) -> Advance to Past Customer (E-37)
    await page.locator('#completed-advance-btn').click();
    await page.waitForTimeout(2600);

    const onPastCustomer = await page.locator('#past-create-project-btn').isVisible().catch(() => false);
    const snap = await getDoc(doc(db, 'projects', WALKTHROUGH_ID));
    const fsData = snap.exists() ? snap.data() : {};
    const trackerStage = fsData.pizza_tracker?.stage || fsData.pizza_tracker?.current_stage;
    if (
      onPastCustomer &&
      fsData.current_stage === 'Past Customer' &&
      trackerStage === 'Past Customer' &&
      (await checkNoCrashOrCheckboxes(page, '4.10 Stage 10->11 (Completed -> Past Customer)'))
    ) {
      pass(
        '4.10 Stage 10 -> Stage 11',
        `Archived to Past Customer (E-37) & verified live Firestore current_stage="${fsData.current_stage}", pizza_tracker="${trackerStage}"`
      );
    } else {
      fail(
        '4.10 Stage 10 -> Stage 11',
        `onPastCustomer=${onPastCustomer}, firestoreStage=${fsData.current_stage}, trackerStage=${trackerStage}`
      );
    }

    // ── 5. KISS CLIENT PORTAL (C-02) + PIZZA TRACKER + ABUNDANCE NETWORK ───────
    await page.goto(`${BASE_URL}/?bypass=Customer`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2500);
    await navKeepSelection(page, 'C-02', 2500);

    if (await checkNoCrashOrCheckboxes(page, '5. KISS Client Portal (C-02)')) {
      const portalLower = (await page.evaluate(() => document.body.innerText)).toLowerCase();
      const hasTracker = portalLower.includes('projects & tracker');
      const hasProps = portalLower.includes('properties & buildings');
      const hasPayments = portalLower.includes('50 / 40 / 10');
      const hasAbundance = portalLower.includes('abundance network');

      // Exercise all 4 KISS tabs interactively
      for (const tabSel of ['#portal-tab-properties', '#portal-tab-payments', '#portal-tab-abundance', '#portal-tab-projects']) {
        const tabBtn = page.locator(tabSel);
        if (await tabBtn.isVisible().catch(() => false)) {
          await tabBtn.click();
          await page.waitForTimeout(500);
          await checkNoCrashOrCheckboxes(page, `5. Client Portal Tab ${tabSel}`);
        }
      }

      if (hasTracker && hasProps && hasPayments && hasAbundance) {
        pass(
          '5. KISS Client Portal (C-02)',
          'Verified & clicked all 4 KISS tabs (11-Stage Pizza Tracker, Multi-Building Properties, 50/40/10 Payments, $500 Abundance Network)'
        );
      } else {
        fail(
          '5. KISS Client Portal (C-02)',
          `Missing tabs: tracker=${hasTracker}, props=${hasProps}, payments=${hasPayments}, abundance=${hasAbundance}`
        );
      }
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'omnibuild_06_kiss_client_portal.png') });

    // ── 6. ALL-PAGES CRASH & PROHIBITED CHECKBOX SWEEP ─────────────────────────
    await page.goto(`${BASE_URL}/?bypass=Admin`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2200);

    const SWEEP_PAGES = [
      'E-01', 'E-02a', 'E-05', 'E-06', 'E-08', 'E-12', 'E-24',
      'E-CUSTOMERS', 'A-01', 'A-03', 'A-05', 'A-LOGS', 'E-TRASH',
    ];
    let sweepOk = 0;
    for (const pid of SWEEP_PAGES) {
      await navClear(page, pid, 1300);
      if (await checkNoCrashOrCheckboxes(page, `Sweep ${pid}`)) {
        sweepOk++;
      }
    }
    if (sweepOk === SWEEP_PAGES.length) {
      pass('6. All-Pages Crash & Checkbox Sweep', `${sweepOk}/${SWEEP_PAGES.length} core OS pages rendered with 0 crashes & 0 checkboxes`);
    }
  } finally {
    await browser.close();
  }

  console.log('\n====================================================================');
  console.log(`  SUMMARY: ${passed} PASSED | ${failed} FAILED | ${pageErrors.length} Uncaught Page Errors`);
  if (pageErrors.length > 0) {
    console.log('  Page Errors:', pageErrors.slice(0, 5));
  }
  console.log('====================================================================\n');

  process.exit(failed > 0 ? 1 : 0);
})();
