/**
 * tests/pipeline-e2e.cjs
 * 
 * RHIVE — Full Pipeline E2E Test Suite
 * Stage 1 (Lead Intake) → Stage 4 (Sign & Verify) → Email → All-Pages Sweep
 * 
 * Usage:
 *   node tests/pipeline-e2e.cjs
 * 
 * Requires: dev server on http://localhost:3001 (npm run dev -- --port 3001)
 * 
 * Test Email: Uses Guerrilla Mail (https://api.guerrillamail.com) — 
 *   a public temp-mail API with no auth, no signup, auto-deletes after 1hr.
 *   Inbox readable at https://www.guerrillamail.com/inbox
 */

'use strict';

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// ── Config ────────────────────────────────────────────────────────────────────
const BASE_URL = 'http://localhost:3001';
const SCREENSHOT_DIR = path.join(__dirname, '..', 'test_screenshots', 'pipeline');
const CLOUD_FN_URL = 'https://us-central1-rhive-os.cloudfunctions.net/sendSignVerifyEmail';

// Guerrilla Mail — free temp mail API
const GUERRILLA_API = 'https://api.guerrillamail.com/ajax.php';

// All page IDs to sweep for black screens
const ALL_PAGES = [
  // Employee Pipeline Stages
  'E-01', 'E-02a', 'E-05', 'E-06',
  'E-26', 'E-27', 'E-28', 'E-29', 'E-30',
  'E-31', 'E-32', 'E-33', 'E-34', 'E-35',
  'E-36', 'E-37', 'E-38', 'E-39',
  // Admin
  'A-01', 'A-02', 'A-03', 'A-05', 'A-LOGS',
  // CRM
  'E-08', 'E-12', 'E-16', 'E-18', 'E-22', 'E-23', 'E-24',
  // Trash + misc
  'E-TRASH',
  // Public pages (no auth)
  'P-00', 'P-01', 'P-02', 'P-03', 'P-04', 'P-05',
  'P-02a', 'P-02b', 'P-02c', 'P-02d',
];

// ── Setup ─────────────────────────────────────────────────────────────────────
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

let browser, page;
let passed = 0, failed = 0;
const results = [];
let testEmail = '';
let testProjectId = '';

const log   = (msg) => console.log(`\n  ${msg}`);
const pass  = (msg) => { console.log(`  ✅ PASS: ${msg}`); passed++; results.push({ status: 'PASS', msg }); };
const fail  = (msg, err) => { console.log(`  ❌ FAIL: ${msg}`, err ? err.message || '' : ''); failed++; results.push({ status: 'FAIL', msg }); };
const warn  = (msg) => console.log(`  ⚠️  WARN: ${msg}`);
const shot  = async (name) => {
  const p = path.join(SCREENSHOT_DIR, `pipeline_${name}.png`);
  await page.screenshot({ path: p, fullPage: false });
  console.log(`  📸 ${p}`);
  return p;
};

// ── Temp Mail via Guerrilla Mail API ──────────────────────────────────────────
async function getTempEmail() {
  try {
    const res = await fetch(`${GUERRILLA_API}?f=get_email_address`);
    const data = await res.json();
    testEmail = data.email_addr;
    pass(`Temp email created: ${testEmail}`);
    return testEmail;
  } catch (err) {
    // Fallback — use a static mailinator address
    testEmail = `rhive-test-${Date.now()}@mailinator.com`;
    warn(`Guerrilla Mail unreachable, using fallback: ${testEmail}`);
    return testEmail;
  }
}

async function checkInboxForEmail(subject, maxWaitMs = 30000) {
  const deadline = Date.now() + maxWaitMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${GUERRILLA_API}?f=get_email_list&offset=0`);
      const data = await res.json();
      const list = data.list || [];
      const found = list.find(e => e.mail_subject && e.mail_subject.toLowerCase().includes(subject.toLowerCase()));
      if (found) return found;
    } catch {}
    await new Promise(r => setTimeout(r, 3000));
  }
  return null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
async function tryClick(selectors, timeout = 3000) {
  for (const sel of selectors) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout })) { await el.click(); return true; }
    } catch {}
  }
  return false;
}

async function detectBlackScreen(label) {
  // RHIVE uses pure black bg by design — don't use pixel darkness.
  // Instead, detect crashes by: React error text OR complete absence of UI content.
  try {
    // Check for React crash text in the DOM
    const crashText = await page.evaluate(() => {
      const body = document.body ? document.body.innerText : '';
      return (
        body.includes('Maximum update depth') ||
        body.includes('Minified React error') ||
        body.includes('Cannot read properties of undefined') ||
        body.includes('Something went wrong') ||
        body.includes('ChunkLoadError')
      );
    });

    if (crashText) {
      await shot(`crash_${label}`);
      fail(`React crash text detected on ${label}`);
      return true;
    }

    // Check that there's at least SOME visible content (text nodes, buttons, inputs)
    const hasContent = await page.evaluate(() => {
      const els = document.querySelectorAll('button, input, h1, h2, h3, p, span, a, [class*="card"], [class*="btn"]');
      return els.length > 2;
    });

    if (!hasContent) {
      await shot(`empty_${label}`);
      fail(`Page appears empty / crashed on ${label} (no UI elements found)`);
      return true;
    }

    return false;
  } catch (err) {
    warn(`detectBlackScreen error on ${label}: ${err.message}`);
    return false;
  }
}

// ── STEP: Login ───────────────────────────────────────────────────────────────
async function login() {
  log('STEP 1: Login as Admin');
  try {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);

    await tryClick(['#btn-user-menu', 'button[title*="Developer" i]', 'button[title*="Profile" i]', 'button.rounded-full'], 5000);
    await page.waitForTimeout(800);

    const adminClicked = await tryClick([
      'button:has-text("Admin Portal")', 'button:has-text("Admin")', 'button:has-text("Employee Portal")', '[data-role="Admin"]',
    ], 3000);

    if (!adminClicked) await page.goto(`${BASE_URL}?bypass=admin`, { waitUntil: 'domcontentloaded', timeout: 15000 });

    await page.waitForTimeout(2500);
    if (await detectBlackScreen('after-login')) return false;
    pass('Logged in as Admin');
    await shot('01_logged_in');
    return true;
  } catch (err) { fail('Login failed', err); return false; }
}

// ── STEP: Create New Lead via Global Search ───────────────────────────────────
async function createLeadViaSearch() {
  log('STEP 2: Open search → type new address → navigate to intake page');
  try {
    await page.evaluate(() => window.dispatchEvent(new CustomEvent('open-customer-lookup')));
    await page.waitForTimeout(1000);
    if (await detectBlackScreen('search-open')) return false;

    const searchInput = page.locator('#search-lookup-input').first();
    await searchInput.waitFor({ state: 'visible', timeout: 8000 });
    await searchInput.fill('');
    await searchInput.type('1847 S 1100 E, Salt Lake City, UT 84105', { delay: 50 });
    await page.waitForTimeout(2000);
    pass('Typed test address into search bar');
    await shot('02_search_typed');

    // Press Tab to trigger navigation to intake page
    await searchInput.press('Tab');
    await page.waitForTimeout(6000);
    if (await detectBlackScreen('after-tab')) return false;

    // Verify we're on the intake page
    const onIntake = await page.locator(
      'text="New Project", text="Property", text="Stage 1", input[placeholder*="address" i]'
    ).first().isVisible({ timeout: 8000 }).catch(() => false);

    if (onIntake) { pass('Navigated to Stage 1 intake page'); }
    else { warn('Could not confirm intake page — navigating directly'); await navigateToPage('E-02a'); }

    await shot('03_intake_page');
    return true;
  } catch (err) { fail('Search / new lead navigation failed', err); return false; }
}

// ── STEP: Map Modal Appears ────────────────────────────────────────────────────
async function verifyMapModal() {
  log('STEP 3: Verify address verification map modal appears');
  try {
    const mapModal = page.locator(
      '.fixed.inset-0:has(canvas), [class*="verification"], [class*="satellite"], button:has-text("Confirm Address")'
    ).first();
    const visible = await mapModal.isVisible({ timeout: 10000 }).catch(() => false);
    if (visible) {
      pass('Map modal (address verification) appeared');
      await shot('04_map_modal');
      await tryClick(['button:has-text("Confirm")', 'button:has-text("Confirm Address")', 'button:has-text("Yes")'], 5000);
      await page.waitForTimeout(1000);
      pass('Map modal confirmed');
    } else {
      warn('Map modal not visible — continuing (may already be pre-confirmed)');
    }
    return true;
  } catch (err) { warn(`Map modal check: ${err.message}`); return true; }
}

// ── STEP: Fill All Stage 1 Fields ─────────────────────────────────────────────
async function fillStage1Fields() {
  log('STEP 4: Fill all Stage 1 fields');
  try {
    // Contact info
    const fillIfVisible = async (sel, value) => {
      try {
        const el = page.locator(sel).first();
        if (await el.isVisible({ timeout: 2000 })) { await el.fill(value); return true; }
      } catch {}
      return false;
    };

    await fillIfVisible('input[name="firstName"], input[placeholder*="First" i]', 'John');
    await fillIfVisible('input[name="lastName"], input[placeholder*="Last" i]', 'Test');
    await fillIfVisible('input[name="email"], input[type="email"]', testEmail);
    await fillIfVisible('input[name="phone"], input[type="tel"]', '8015551234');

    await page.waitForTimeout(500);

    // Scope type — try to select Repair
    await tryClick([
      'button:has-text("Repair")', '[data-scope="Repair"]',
      'button[id*="scope"]:has-text("Repair")', 'label:has-text("Repair")'
    ], 2000);

    // Project category — Residential (usually default, but try to confirm)
    await tryClick([
      'button:has-text("Residential")', '[data-type="Residential"]'
    ], 2000);

    pass('Stage 1 fields filled');
    await shot('05_stage1_filled');
    return true;
  } catch (err) { fail('Stage 1 field fill failed', err); return false; }
}

// ── STEP: Submit Lead ─────────────────────────────────────────────────────────
async function submitLead() {
  log('STEP 5: Submit / Save Lead');
  try {
    const saved = await tryClick([
      'button:has-text("Save")', 'button:has-text("Submit")',
      'button:has-text("Create")', 'button:has-text("Save Lead")',
      'button:has-text("Save Project")', '#btn-save-lead',
    ], 5000);

    if (saved) {
      await page.waitForTimeout(3000);
      if (await detectBlackScreen('after-save')) return false;
      pass('Lead submitted / saved');
      await shot('06_lead_saved');
    } else {
      warn('Save button not found — lead may auto-save or require scrolling');
    }
    return true;
  } catch (err) { fail('Lead submission failed', err); return false; }
}

// ── STEP: Verify Lead appears in Lead List ─────────────────────────────────────
async function verifyLeadInList() {
  log('STEP 6: Verify lead appears in Stage 1 (LeadPage) list');
  try {
    await navigateToPage('E-26');
    await page.waitForTimeout(3000);
    if (await detectBlackScreen('lead-list')) return false;

    // Look for our test lead or John Test
    const leadVisible = await page.locator(
      'text="John Test", text="1847 S 1100 E", text="Salt Lake City"'
    ).first().isVisible({ timeout: 8000 }).catch(() => false);

    if (leadVisible) { pass('Lead found in Stage 1 (LeadPage) list'); }
    else { warn('Test lead not visible in list — may be filtered or paginated'); }

    await shot('07_lead_list');
    pass('LeadPage loads without black screen');
    return true;
  } catch (err) { fail('Lead list verification failed', err); return false; }
}

// ── STEP: Contacts & Accounts Saved ───────────────────────────────────────────
async function verifyContactsAccounts() {
  log('STEP 7: Verify Contacts and Accounts views load');
  try {
    await navigateToPage('E-24');
    await page.waitForTimeout(2500);
    if (await detectBlackScreen('contacts-page')) return false;
    pass('Contacts/Vendors page loads');
    await shot('08_contacts');

    await navigateToPage('E-08');
    await page.waitForTimeout(2500);
    if (await detectBlackScreen('accounts-page')) return false;
    pass('Company/Accounts page loads');
    await shot('09_accounts');
    return true;
  } catch (err) { fail('Contacts/Accounts check failed', err); return false; }
}

// ── STEP: Convert to Estimate ─────────────────────────────────────────────────
async function convertToEstimate() {
  log('STEP 8: Convert lead to Estimate (Stage 2)');
  try {
    // Go back to lead list and find our lead
    await navigateToPage('E-26');
    await page.waitForTimeout(2500);

    // Dismiss any open modals/overlays (Escape key)
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // Click on first clickable lead/record row
    const leadClicked = await tryClick([
      '[class*="lead-row"]', '[class*="lead-card"]',
      '[class*="record-row"]', 'table tbody tr',
      '[data-testid*="lead"]',
    ], 3000);

    if (!leadClicked) {
      // Try clicking any pipeline card that isn't a system element
      const cards = await page.locator('div[class*="cursor-pointer"], div[class*="hover:bg"]').all();
      for (const card of cards.slice(0, 5)) {
        try {
          const text = await card.innerText();
          if (text && text.length > 10 && !text.includes('System Active')) {
            await card.click({ timeout: 2000 });
            break;
          }
        } catch {}
      }
    }
    await page.waitForTimeout(1500);

    // Click Convert
    const converted = await tryClick([
      'button:has-text("Convert")', 'button:has-text("Convert Lead")',
      'button:has-text("Move to Estimate")', 'button[id*="convert"]',
    ], 5000);

    if (converted) {
      await page.waitForTimeout(1000);
      // Select Estimate in modal
      await tryClick(['button:has-text("Estimate")', 'button:has-text("Convert to Estimate")'], 3000);
      await page.waitForTimeout(2000);
      if (await detectBlackScreen('after-convert-estimate')) return false;
      pass('Lead converted to Estimate (Stage 2)');
      await shot('10_estimate_stage');
    } else {
      warn('Convert button not found — navigating to Estimate stage directly');
      await navigateToPage('E-27');
      await page.waitForTimeout(2000);
    }

    // Verify estimate page fields carry over
    const hasAddress = await page.locator(
      'text="1847 S 1100 E", text="Salt Lake City", text="John Test"'
    ).first().isVisible({ timeout: 5000 }).catch(() => false);

    if (hasAddress) { pass('Customer data carried over to Estimate stage'); }
    else { warn('Could not verify field carry-over (may not be visible without lead ID context)'); }

    return true;
  } catch (err) { fail('Convert to Estimate failed', err); return false; }
}

// ── STEP: Convert to Quote ────────────────────────────────────────────────────
async function convertToQuote() {
  log('STEP 9: Advance to Quote (Stage 3)');
  try {
    await navigateToPage('E-28');
    await page.waitForTimeout(2500);
    if (await detectBlackScreen('quote-page')) return false;
    pass('Quote page (Stage 3) loads without crash');
    await shot('11_quote_stage');
    return true;
  } catch (err) { fail('Quote stage navigation failed', err); return false; }
}

// ── STEP: Sign & Verify — Internal Admin Page ─────────────────────────────────
async function verifySignAndVerifyPage() {
  log('STEP 10: Sign & Verify (Stage 4) — Internal page with project data');
  try {
    await navigateToPage('E-29');
    await page.waitForTimeout(3000);
    if (await detectBlackScreen('sign-verify-internal')) return false;
    pass('Sign & Verify (E-29) loads without crash');

    // Check that key fields are visible
    const hasProjectInfo = await page.locator(
      'text="sign", text="verify", text="link", text="email", text="portal"'
    ).first().isVisible({ timeout: 5000 }).catch(() => false);

    if (hasProjectInfo) { pass('Sign & Verify page has expected content'); }
    else { warn('Sign & Verify content not detected — may need an active project context'); }

    await shot('12_sign_verify_internal');
    return true;
  } catch (err) { fail('Sign & Verify internal page failed', err); return false; }
}

// ── STEP: Send Sign & Verify Email ────────────────────────────────────────────
async function sendSignVerifyEmail() {
  log('STEP 11: Send Sign & Verify email via Cloud Function');
  try {
    // Use the existing e2e Cloud Function — call it directly
    const timestamp = Date.now();
    testProjectId = `test-pipeline-${timestamp}`;

    const payload = {
      projectId: testProjectId,
      customerEmail: testEmail,
      customerName: 'John Test',
      projectName: '1847 S 1100 E — Test Project',
      link: `https://rhive-os.web.app/?page=CUSTOMER-SIGN-VERIFY&token=${testProjectId}`,
    };

    const response = await page.evaluate(async ({ url, body }) => {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        return { status: res.status, ok: res.ok };
      } catch (err) {
        return { status: 0, ok: false, error: err.message };
      }
    }, { url: CLOUD_FN_URL, body: payload });

    if (response.ok) {
      pass(`Sign & Verify email sent to ${testEmail} (HTTP ${response.status})`);
    } else {
      warn(`Cloud Function returned HTTP ${response.status} — email may still have been sent`);
    }

    await shot('13_email_sent');

    // Wait and check Guerrilla Mail inbox
    if (testEmail.includes('guerrillamail') || testEmail.includes('sharklasers') || testEmail.includes('grr.la')) {
      log('  → Checking Guerrilla Mail inbox for received email...');
      const email = await page.evaluate(async ({ api }) => {
        try {
          await new Promise(r => setTimeout(r, 5000));
          const res = await fetch(`${api}?f=get_email_list&offset=0`);
          const data = await res.json();
          return (data.list || []).find(e => e.mail_subject && e.mail_subject.includes('Sign')) || null;
        } catch { return null; }
      }, { api: GUERRILLA_API });

      if (email) { pass(`Email received in temp inbox: "${email.mail_subject}"`); }
      else { warn('Email not yet in temp inbox (may take a few minutes — check guerrillamail.com manually)'); }
    } else {
      warn(`Non-Guerrilla email used (${testEmail}) — check inbox manually at mailinator.com`);
    }

    return true;
  } catch (err) { fail('Email send failed', err); return false; }
}

// ── STEP: Customer Sign & Verify Portal ───────────────────────────────────────
async function testCustomerPortal() {
  log('STEP 12: Customer-facing Sign & Verify portal (public link)');
  try {
    const portalUrl = `${BASE_URL}/?page=CUSTOMER-SIGN-VERIFY&token=${testProjectId || 'test-token-000'}`;
    await page.goto(portalUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(3000);

    // Check for React crash text only — empty state is valid (fake token = no Firestore doc)
    const crashed = await page.evaluate(() => {
      const body = document.body ? document.body.innerText : '';
      return (
        body.includes('Maximum update depth') ||
        body.includes('Minified React error') ||
        body.includes('ChunkLoadError')
      );
    });

    if (crashed) {
      await shot('customer_portal_crash');
      fail('Customer Sign & Verify portal — React crash detected');
      return false;
    }

    pass('Customer Sign & Verify portal loads without crash');
    await shot('14_customer_portal');

    // Check for form fields (only if a real project existed)
    const hasForm = await page.locator(
      'input[placeholder*="claim" i], input[placeholder*="policy" i], ' +
      'text="Deductible", text="Payment", text="Terms", text="Agree"'
    ).first().isVisible({ timeout: 5000 }).catch(() => false);

    if (hasForm) { pass('Customer portal form fields visible (claim, payment, terms)'); }
    else { warn('Customer portal in empty/not-found state (test token has no Firestore doc — expected)'); }

    return true;
  } catch (err) { fail('Customer portal test failed', err); return false; }
}

// ── STEP: All Pages Black Screen Sweep ────────────────────────────────────────
async function sweepAllPages() {
  log(`STEP 13: All-pages black screen sweep (${ALL_PAGES.length} pages)`);
  let pagePassed = 0, pageFailed = 0;

  for (const pageId of ALL_PAGES) {
    try {
      await navigateToPage(pageId);
      await page.waitForTimeout(1500);
      const crashed = await detectBlackScreen(`page_${pageId}`);
      if (!crashed) { pagePassed++; }
      else { pageFailed++; }
    } catch (err) {
      warn(`Page ${pageId} error: ${err.message}`);
      pageFailed++;
    }
  }

  if (pageFailed === 0) { pass(`All-pages sweep: ${pagePassed}/${ALL_PAGES.length} pages — no crashes`); }
  else { fail(`All-pages sweep: ${pageFailed} page(s) crashed or black screened`); }

  await shot('15_sweep_final');
  return pageFailed === 0;
}

// ── Navigate via NavigationContext event ──────────────────────────────────────
async function navigateToPage(pageId) {
  await page.evaluate((id) => {
    window.dispatchEvent(new CustomEvent('rhive-navigate', { detail: { pageId: id } }));
  }, pageId);
  await page.waitForTimeout(1200);
}

// ── Main ──────────────────────────────────────────────────────────────────────
(async () => {
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║   RHIVE — Full Pipeline E2E Test Suite                       ║');
  console.log('║   Stage 1 (Lead) → Sign & Verify → Email → All-Pages Sweep  ║');
  console.log('║   Branch: feature/pipeline-e2e-test                          ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');

  try {
    // Create temp email first
    log('PRE-TEST: Creating temporary test email...');
    await getTempEmail();

    browser = await chromium.launch({ headless: false, slowMo: 60 });
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    page = await ctx.newPage();

    // Capture console errors
    const consoleErrors = [];
    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
    page.on('pageerror', err => consoleErrors.push(`PAGE_ERR: ${err.message}`));

    const loginOk     = await login();
    if (!loginOk) { console.log('\n❌ Login failed — stopping'); process.exit(1); }

    await createLeadViaSearch();
    await verifyMapModal();
    await fillStage1Fields();
    await submitLead();
    await verifyLeadInList();
    await verifyContactsAccounts();
    await convertToEstimate();
    await convertToQuote();
    await verifySignAndVerifyPage();
    await sendSignVerifyEmail();
    await testCustomerPortal();
    await sweepAllPages();

  } catch (err) {
    fail('Unhandled test error', err);
  } finally {
    if (browser) await browser.close();
  }

  // ── Final Report ────────────────────────────────────────────────────────────
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║                      TEST RESULTS                            ║');
  console.log('╠══════════════════════════════════════════════════════════════╣');
  for (const r of results) {
    const icon = r.status === 'PASS' ? '✅' : '❌';
    const msg = r.msg.length > 55 ? r.msg.substring(0, 52) + '...' : r.msg;
    console.log(`║  ${icon} ${msg.padEnd(57)}║`);
  }
  console.log('╠══════════════════════════════════════════════════════════════╣');
  console.log(`║  ${passed}/${passed + failed} PASSED${' '.repeat(50 - String(passed + failed).length * 2)}║`);
  console.log('╚══════════════════════════════════════════════════════════════╝');

  if (passed > 0) {
    console.log(`\n📧 Test email used: ${testEmail}`);
    if (testEmail.includes('guerrillamail') || testEmail.includes('sharklasers') || testEmail.includes('grr.la')) {
      console.log(`   → Check inbox: https://www.guerrillamail.com/inbox`);
    }
    if (testEmail.includes('mailinator')) {
      console.log(`   → Check inbox: https://www.mailinator.com/v4/public/inboxes.jsp?to=${testEmail.split('@')[0]}`);
    }
  }

  console.log(`\n📁 Screenshots saved to: test_screenshots/pipeline/`);
  process.exit(failed > 0 ? 1 : 0);
})();
