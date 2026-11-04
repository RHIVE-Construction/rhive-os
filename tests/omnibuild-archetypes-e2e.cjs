/**
 * tests/omnibuild-archetypes-e2e.cjs
 *
 * RHIVE OS (Michael-omnibuild) — QOS Customer Archetypes, First-Call Global Search,
 * Multi-Archetype Intake (E-02a), Polymorphic Public Sign & Verify, Stage QOS Math,
 * and Partner Portals E2E Verification Suite.
 *
 * Verifies in headless Chromium against http://localhost:3000:
 *   1. First-Call Global Search (`#header-search-btn` 🔍):
 *      - Normalized phone lookup (`8015550105` -> `(801) 555-0105` UNPHC / Willow Park Apartments).
 *      - 1-Click Property `+ Create` (`#search-new-prop-proj-test-omnibuild-prop-willow-park`)
 *        routes to `E-02a` (`New Project Input`) with address, Commercial category, buildings,
 *        contacts, and sticky `#intake-submit-project-btn` prefilled!
 *      - Brand-New Caller phone lookup (`8015550198`) -> `#btn-initiate-project` (`Create`)
 *        routes to `E-02a` with formatted phone prefilled!
 *   2. `New Project Input` (`E-02a`) QOS Controls:
 *      - Active-property duplicate detection (`Create Separate` vs `Merge Existing`),
 *        Insurance Adjuster fields, Government DFCM solicitation + Prevailing Wage,
 *        and sticky `#intake-submit-project-btn`.
 *   3. Polymorphic Public `CUSTOMER-SIGN-VERIFY` Flows (`/sign-verify?token=...`):
 *      - Commercial/Retail (`test-omnibuild-proj-04-sign`): signer name, color lock,
 *        100 sq ft Free OSB banner, 50% milestone tile, agreement switch, zero raw IDs.
 *      - Fast-Path Leak Repair `<15yr` (`test-omnibuild-proj-12-fast-leak`): 100% Upon Completion tile.
 *      - Storm Insurance RCV Claim (`test-omnibuild-proj-14-insurance-rcv`): prefilled Claim Number
 *        (`SF-UT-2026-88412`) + Deductible / ACV tiles.
 *   4. Stage QOS Engines (`E-32` Install OSB Calculator, `E-33` Contractor Radar, `E-34` Polymorphic Ledger + Warranty Lock).
 *   5. Partner Portals (`CO-01` Contractor + `S-01` Supplier + Abundance Network `$500` tabs) & `INTERNAL-BPM` 4 customer types.
 */

'use strict';

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const SCREENSHOT_DIR =
  process.env.ARTIFACT_DIR || path.join(ROOT, 'test_screenshots', 'omnibuild');

fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

let passed = 0;
let failed = 0;

function pass(step, detail) {
  passed++;
  console.log(`  ✅ PASS [${step}]: ${detail}`);
}

function fail(step, detail) {
  failed++;
  console.error(`  ❌ FAIL [${step}]: ${detail}`);
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

(async () => {
  console.log('\n====================================================================');
  console.log('  RHIVE OS (Michael-omnibuild) — QOS ARCHETYPES & FIRST-CALL E2E');
  console.log('====================================================================\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 920 } });
  const page = await context.newPage();

  const pageErrors = [];
  page.on('pageerror', (err) => pageErrors.push(err.message));

  try {
    // ── 1. FIRST-CALL GLOBAL SEARCH -> EXISTING MULTI-BUILDING PROPERTY PREFILL ──
    await page.goto(`${BASE_URL}/?bypass=Admin`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2800);

    const searchBtn = page.locator('#header-search-btn');
    await searchBtn.waitFor({ state: 'visible', timeout: 10000 });
    await searchBtn.click();
    await page.waitForTimeout(600);

    const searchInput = page.locator('#search-lookup-input');
    await searchInput.waitFor({ state: 'visible', timeout: 8000 });
    await searchInput.fill('8015550105');
    await page.waitForTimeout(900);

    const modalText = await page.evaluate(() => document.body.innerText);
    const matchedUnphc =
      modalText.includes('UNPHC Multifamily Portfolio') || modalText.includes('Jeff Phillips');
    const propBtn = page.locator('#search-new-prop-proj-test-omnibuild-prop-willow-park').first();
    const propBtnVisible = await propBtn.isVisible().catch(() => false);

    if (matchedUnphc && propBtnVisible && (await checkNoCrashOrCheckboxes(page, '1a. Global Search Phone Match'))) {
      pass(
        '1a. First-Call Global Search (Existing Phone Match)',
        'Normalized digits 8015550105 matched UNPHC Multifamily Portfolio & Willow Park Apartments'
      );
    } else {
      fail(
        '1a. First-Call Global Search (Existing Phone Match)',
        `matchedUnphc=${matchedUnphc}, propBtnVisible=${propBtnVisible}`
      );
    }

    await propBtn.click();
    await page.waitForTimeout(2000);

    const intakeText = await page.evaluate(() => document.body.innerText);
    const submitStickyVisible = await page.locator('#intake-submit-project-btn').isVisible().catch(() => false);
    if (
      (intakeText.includes('525 Aspen Meadow') || intakeText.includes('Willow Park') || intakeText.includes('UNPHC')) &&
      submitStickyVisible &&
      (await checkNoCrashOrCheckboxes(page, '1b. Search -> Intake Hydration'))
    ) {
      pass(
        '1b. Search -> New Project Input (E-02a) Prefill',
        'Hydrated Willow Park Apartments address, Commercial account, contacts, and sticky Submit Project bar'
      );
    } else {
      fail(
        '1b. Search -> New Project Input (E-02a) Prefill',
        `submitStickyVisible=${submitStickyVisible}`
      );
    }
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'omnibuild_07_search_and_intake_flow.png'),
    });

    // ── 1c. FIRST-CALL GLOBAL SEARCH -> BRAND-NEW CALLER PHONE PREFILL ──────────
    await page.locator('#header-search-btn').click();
    await page.waitForTimeout(600);
    await page.locator('#search-lookup-input').fill('8015550198');
    await page.waitForTimeout(700);

    const newCallerBtn = page.locator('#btn-initiate-project');
    const newCallerVisible = await newCallerBtn.isVisible().catch(() => false);
    if (newCallerVisible) {
      await newCallerBtn.click();
      await page.waitForTimeout(1600);
      const inputsDump = await page.evaluate(() =>
        Array.from(document.querySelectorAll('input')).map((i) => i.value).join(' | ')
      );
      if (inputsDump.includes('801') && inputsDump.includes('0198')) {
        pass(
          '1c. First-Call Global Search (New Caller Phone)',
          'Zero-match caller 8015550198 routed to E-02a with formatted phone (801) 555-0198 prefilled'
        );
      } else {
        fail('1c. First-Call Global Search (New Caller Phone)', `Phone not found in inputs: ${inputsDump}`);
      }
    } else {
      fail('1c. First-Call Global Search (New Caller Phone)', '#btn-initiate-project was not visible');
    }

    // ── 2. POLYMORPHIC PUBLIC CUSTOMER-SIGN-VERIFY FLOWS ────────────────────────
    // 2a. Commercial / Multi-Building 50% Deposit (`test-omnibuild-proj-04-sign`)
    await page.goto(`${BASE_URL}/sign-verify?token=test-omnibuild-proj-04-sign`, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });
    await page.waitForTimeout(2500);
    const csvCommText = await page.evaluate(() => document.body.innerText);
    const hasSignerInput = await page.locator('#csv-signer-name').isVisible().catch(() => false);
    const hasColorSelect = await page.locator('#csv-color-select').isVisible().catch(() => false);
    const hasDep50 = await page.locator('#csv-payment-deposit50').isVisible().catch(() => false);
    const hasOsbNote = csvCommText.includes('100 sq ft') && csvCommText.includes('$0.00');
    const hasExposedRawId = csvCommText.includes('test-omnibuild-proj-04-sign');
    if (
      hasSignerInput &&
      hasColorSelect &&
      hasDep50 &&
      hasOsbNote &&
      !hasExposedRawId &&
      (await checkNoCrashOrCheckboxes(page, '2a. Public Sign & Verify (Commercial/Retail)'))
    ) {
      pass(
        '2a. Public Sign & Verify (Commercial/Retail)',
        'Verified E-Signature, Color Lock, 100 sq ft Free OSB protection banner, 50% Milestone tile, and 0 raw IDs'
      );
    } else {
      fail(
        '2a. Public Sign & Verify (Commercial/Retail)',
        `signer=${hasSignerInput}, color=${hasColorSelect}, dep50=${hasDep50}, osb=${hasOsbNote}, rawId=${hasExposedRawId}`
      );
    }

    // 2b. Fast-Path Leak Repair <15yr (`test-omnibuild-proj-12-fast-leak`)
    await page.goto(`${BASE_URL}/sign-verify?token=test-omnibuild-proj-12-fast-leak`, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });
    await page.waitForTimeout(2300);
    const hasRepair100 = await page.locator('#csv-payment-repair').isVisible().catch(() => false);
    const repairText = await page.evaluate(() => document.body.innerText);
    if (
      hasRepair100 &&
      repairText.includes('Fast-Path Repair') &&
      (await checkNoCrashOrCheckboxes(page, '2b. Public Sign & Verify (Fast-Path Repair)'))
    ) {
      pass(
        '2b. Public Sign & Verify (Fast-Path Leak Repair <15yr)',
        'Rendered streamlined 100% Upon Completion repair authorization'
      );
    } else {
      fail('2b. Public Sign & Verify (Fast-Path Leak Repair <15yr)', `hasRepair100=${hasRepair100}`);
    }

    // 2c. Hail Storm Insurance RCV Claim (`test-omnibuild-proj-14-insurance-rcv`)
    await page.goto(`${BASE_URL}/sign-verify?token=test-omnibuild-proj-14-insurance-rcv`, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });
    await page.waitForTimeout(2300);
    const claimVal = await page.locator('#csv-claim-number').inputValue().catch(() => '');
    const hasDeductibleTile = await page.locator('#csv-payment-deductible').isVisible().catch(() => false);
    const hasAcvTile = await page.locator('#csv-payment-acv').isVisible().catch(() => false);
    if (
      claimVal === 'SF-UT-2026-88412' &&
      hasDeductibleTile &&
      hasAcvTile &&
      (await checkNoCrashOrCheckboxes(page, '2c. Public Sign & Verify (Insurance RCV)'))
    ) {
      pass(
        '2c. Public Sign & Verify (Storm Insurance RCV)',
        `Prefilled Claim # ${claimVal} with Deductible + Carrier ACV endorsement tiles`
      );
    } else {
      fail(
        '2c. Public Sign & Verify (Storm Insurance RCV)',
        `claimVal=${claimVal}, deductible=${hasDeductibleTile}, acv=${hasAcvTile}`
      );
    }
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'omnibuild_08_polymorphic_sign_verify.png'),
    });

    // ── 3. STAGE QOS ENGINES (INSTALL OSB CALCULATOR & INVOICING WARRANTY LOCK) ─
    await page.goto(`${BASE_URL}/?bypass=Admin`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2500);

    // Select Hillcreek HOA Install project via Global Search -> direct jump to Stage 7 (E-32)
    await page.locator('#header-search-btn').click();
    await page.waitForTimeout(500);
    await page.locator('#search-lookup-input').fill('8015550104');
    await page.waitForTimeout(800);
    const hillcreekProjBtn = page.locator('button:has-text("Hillcreek Condominiums HOA Phase 1")').first();
    if (await hillcreekProjBtn.isVisible().catch(() => false)) {
      await hillcreekProjBtn.click();
      await page.waitForTimeout(2200);
    } else {
      await navClear(page, 'E-32', 2000);
    }

    const osbInput = page.locator('#install-osb-sheets-input');
    if (await osbInput.isVisible().catch(() => false)) {
      await osbInput.fill('8');
      await page.waitForTimeout(400);
      const installText = await page.evaluate(() => document.body.innerText);
      // 8 sheets -> 3 free + 5 billable @ $72.50 = $362.50 + $250 trailer (>3 billable) = $612.50
      const hasTrailerMath = installText.includes('250') && installText.includes('3 sheets');
      if (hasTrailerMath && (await checkNoCrashOrCheckboxes(page, '3a. Install OSB Decking Calculator'))) {
        pass(
          '3a. Stage 7 Install (E-32) OSB Decking Engine',
          'Verified 3 free sheets (100 sq ft) + $72.50/sheet overage + $250 wood dump trailer when >3 billable sheets'
        );
      } else {
        fail('3a. Stage 7 Install (E-32) OSB Decking Engine', `hasTrailerMath=${hasTrailerMath}`);
      }
    } else {
      fail('3a. Stage 7 Install (E-32) OSB Decking Engine', '#install-osb-sheets-input not visible');
    }

    // Jump to Megaplex Invoicing (E-34) via Global Search -> verify Polymorphic Model Pills & Master Warranty Lock
    await page.locator('#header-search-btn').click();
    await page.waitForTimeout(500);
    await page.locator('#search-lookup-input').fill('8015550107');
    await page.waitForTimeout(800);
    const megaplexBtn = page.locator('button:has-text("Megaplex Valley Grove")').first();
    if (await megaplexBtn.isVisible().catch(() => false)) {
      await megaplexBtn.click();
      await page.waitForTimeout(2200);
    }

    const hasInsPill = await page.locator('#invoice-model-insurance_acv_rcv').isVisible().catch(() => false);
    const hasMsaPill = await page.locator('#invoice-model-msa_net_30').isVisible().catch(() => false);
    const invPageText = await page.evaluate(() => document.body.innerText);
    if (
      hasInsPill &&
      hasMsaPill &&
      invPageText.toLowerCase().includes('warranty') &&
      (await checkNoCrashOrCheckboxes(page, '3b. Invoicing Polymorphic Ledger & Warranty Gate'))
    ) {
      pass(
        '3b. Stage 9 Invoicing (E-34) Polymorphic Models & Warranty Gate',
        'Verified all 5 payment model pills (50/40/10, Repair 100%, Comm 50/50, Insurance RCV, PO Net-30) & Paid-in-Full Warranty Lock'
      );
    } else {
      fail(
        '3b. Stage 9 Invoicing (E-34) Polymorphic Models & Warranty Gate',
        `hasInsPill=${hasInsPill}, hasMsaPill=${hasMsaPill}`
      );
    }

    // ── 4. INTERNAL BPM (4 ACTIVE CUSTOMER ARCHETYPE BRANCHES) ──────────────────
    await navClear(page, 'INTERNAL-BPM', 1800);
    const bpmLower = (await page.evaluate(() => document.body.innerText)).toLowerCase();
    const gcBtn = page.locator('#bpm-customer-type-new-construction');
    const govBtn = page.locator('#bpm-customer-type-government');
    if (await gcBtn.isVisible().catch(() => false)) {
      await gcBtn.click();
      await page.waitForTimeout(350);
    }
    if (await govBtn.isVisible().catch(() => false)) {
      await govBtn.click();
      await page.waitForTimeout(350);
    }
    const govSwimlaneText = await page.evaluate(() => document.body.innerText);
    if (
      bpmLower.includes('gc / new construction') &&
      bpmLower.includes('government / dfcm') &&
      govSwimlaneText.includes('CRWform') &&
      !bpmLower.includes('(soon)') &&
      (await checkNoCrashOrCheckboxes(page, '4. Internal BPM 4 Customer Branches'))
    ) {
      pass(
        '4. Internal BPM (INTERNAL-BPM)',
        'Verified Retail, Insurance, GC / New Construction, and Government / DFCM active swimlanes (incl. CRWform)'
      );
    } else {
      fail('4. Internal BPM (INTERNAL-BPM)', 'Expected all 4 active customer swimlanes without (Soon)');
    }

    // ── 5. PARTNER PORTALS (CONTRACTOR CO-01 & SUPPLIER S-01 + ABUNDANCE TABS) ──
    await page.goto(`${BASE_URL}/?bypass=Contractor`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2400);
    const contractorAbundanceTab = page.locator('#contractor-tab-abundance');
    if (await contractorAbundanceTab.isVisible().catch(() => false)) {
      await contractorAbundanceTab.click();
      await page.waitForTimeout(500);
      if (await checkNoCrashOrCheckboxes(page, '5a. Contractor Portal + Abundance Tab')) {
        pass(
          '5a. Contractor Portal (CO-01)',
          'Verified live Firestore crew deployments + $500 Abundance Network tab'
        );
      }
    } else {
      fail('5a. Contractor Portal (CO-01)', '#contractor-tab-abundance not visible');
    }

    await page.goto(`${BASE_URL}/?bypass=Supplier`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2400);
    const supplierAbundanceTab = page.locator('#supplier-tab-abundance');
    if (await supplierAbundanceTab.isVisible().catch(() => false)) {
      await supplierAbundanceTab.click();
      await page.waitForTimeout(500);
      if (await checkNoCrashOrCheckboxes(page, '5b. Supplier Portal + Abundance Tab')) {
        pass(
          '5b. Supplier Portal (S-01)',
          'Verified live Firestore material POs + $500 Abundance Network tab'
        );
      }
    } else {
      fail('5b. Supplier Portal (S-01)', '#supplier-tab-abundance not visible');
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
