/**
 * RHIVE Test: Address Autocomplete — New Project Form
 * Branch: test/stage1
 *
 * Regression test for the bug where the Google Places autocomplete dropdown
 * (pac-container) was not appearing when typing in "Street Address or
 * Business Name" field on the New Lead Entry / New Project form.
 *
 * Root causes fixed:
 *   1. GlobalCustomerLookupModal injected `display: none !important` on
 *      .pac-container for non-address queries and didn't clear it on close.
 *   2. AddressSection autocompleteRef was never cleared on collapse, leaving
 *      a stale (detached) instance that silently blocked re-initialization.
 */

import { chromium, Browser, Page } from 'playwright';

const BASE_URL = 'http://localhost:3001';

let browser: Browser;
let page: Page;

const shot = async (name: string) => {
    await page.screenshot({ path: `test_screenshots/address_autocomplete_${name}.png`, fullPage: false });
    console.log(`  📸 ${name}.png`);
};
const log = (msg: string) => console.log(`\n  ${msg}`);
const pass = (msg: string) => console.log(`  ✅ PASS: ${msg}`);
const fail = (msg: string, err?: any) => { console.error(`  ❌ FAIL: ${msg}`, err || ''); };

async function runTest() {
    console.log('\n══════════════════════════════════════════════════════════');
    console.log('  RHIVE TEST — Address Autocomplete: New Project Form');
    console.log('══════════════════════════════════════════════════════════');

    browser = await chromium.launch({ headless: false, slowMo: 80 });
    page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });

    // ─── Step 1: Load app ─────────────────────────────────────────────────────
    log('STEP 1: Loading app...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    pass('App loaded');

    // ─── Step 2: Login as Employee/Admin ─────────────────────────────────────
    log('STEP 2: Logging in...');
    try {
        const profileBtn = page.locator('button[title*="Developer"], button[title*="Profile"], button.rounded-full').first();
        await profileBtn.click({ timeout: 5000 });
        await page.waitForTimeout(500);
        const portalBtn = page.locator('button:has-text("Employee Portal"), button:has-text("Admin Portal")').first();
        await portalBtn.click({ timeout: 5000 });
        await page.waitForTimeout(2000);
        pass('Logged in');
        await shot('01_logged_in');
    } catch (err) {
        fail('Could not log in', err);
        await browser.close();
        return;
    }

    // ─── Step 3: Navigate to New Project (E-02a) ──────────────────────────────
    log('STEP 3: Navigating to New Project form (E-02a)...');
    try {
        const newProjectBtn = page.locator(
            'button:has-text("New Project"), [data-page-id="E-02a"], button:has-text("New Lead")'
        ).first();
        await newProjectBtn.click({ timeout: 8000 });
        await page.waitForTimeout(2500);
        pass('New Project page loaded');
        await shot('02_new_project_page');
    } catch (err) {
        fail('Could not navigate to New Project', err);
        await browser.close();
        return;
    }

    // ─── Step 4: Find the Street Address input ────────────────────────────────
    log('STEP 4: Finding Street Address input...');
    const addressInput = page.locator(
        '#property-address-input, input[placeholder*="address"], input[name="address"]'
    ).first();

    try {
        await addressInput.waitFor({ state: 'visible', timeout: 8000 });
        pass('Address input found and visible');
    } catch (err) {
        fail('Address input not found', err);
        await shot('03_address_input_missing');
        await browser.close();
        return;
    }

    // ─── Step 5: Check pac-container-visibility is not suppressing ────────────
    log('STEP 5: Checking pac-container-visibility style is not active...');
    const pacHiddenBeforeType = await page.evaluate(() => {
        const styleEl = document.getElementById('pac-container-visibility') as HTMLStyleElement | null;
        return styleEl?.innerHTML?.includes('display: none') ?? false;
    });
    if (pacHiddenBeforeType) {
        fail('pac-container is being suppressed BEFORE any typing — GlobalCustomerLookupModal bleed detected!');
    } else {
        pass('pac-container-visibility style is clean (not suppressing)');
    }

    // ─── Step 6: Type address and wait for autocomplete dropdown ──────────────
    log('STEP 6: Typing address and waiting for autocomplete dropdown...');
    await addressInput.click();
    await page.waitForTimeout(300);
    await addressInput.type('123 Main St Salt Lake', { delay: 80 });
    await page.waitForTimeout(3000); // Google Places API needs ~2-3s

    await shot('04_after_typing');

    // Check pac-container visibility suppression after typing
    const pacHiddenAfterType = await page.evaluate(() => {
        const styleEl = document.getElementById('pac-container-visibility') as HTMLStyleElement | null;
        return styleEl?.innerHTML?.includes('display: none') ?? false;
    });
    if (pacHiddenAfterType) {
        fail('pac-container is being suppressed AFTER typing address — fix did not work!');
        await shot('04b_pac_suppressed');
    } else {
        pass('pac-container-visibility style is NOT suppressing the dropdown');
    }

    const pacContainerVisible = await page.evaluate(() => {
        const pac = document.querySelector('.pac-container') as HTMLElement | null;
        if (!pac) return { visible: false, reason: 'pac-container element not found in DOM' };
        const style = window.getComputedStyle(pac);
        return {
            visible: style.display !== 'none' && style.visibility !== 'hidden' && pac.children.length > 0,
            display: style.display,
            visibility: style.visibility,
            childCount: pac.children.length
        };
    });

    console.log('  pac-container state:', pacContainerVisible);

    if ((pacContainerVisible as any).visible) {
        pass('Google Places autocomplete dropdown is VISIBLE with results!');
    } else {
        fail(`Autocomplete dropdown not visible. State: ${JSON.stringify(pacContainerVisible)}`);
    }

    await shot('05_autocomplete_dropdown');

    // ─── Step 7: Test clear + retype (regression for stale ref bug) ───────────
    log('STEP 7: Testing clear and retype (stale autocompleteRef regression)...');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    await addressInput.click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Delete');
    await page.waitForTimeout(300);
    await addressInput.type('456 Oak Ave Sandy', { delay: 80 });
    await page.waitForTimeout(3000);

    const pacVisibleAfterRetype = await page.evaluate(() => {
        const pac = document.querySelector('.pac-container') as HTMLElement | null;
        if (!pac) return false;
        const style = window.getComputedStyle(pac);
        return style.display !== 'none' && pac.children.length > 0;
    });

    if (pacVisibleAfterRetype) {
        pass('Autocomplete still works after clearing and retyping');
    } else {
        fail('Autocomplete failed after clear and retype (stale ref bug may still exist)');
    }

    await shot('06_retype_autocomplete');

    // ─── Summary ─────────────────────────────────────────────────────────────
    console.log('\n══════════════════════════════════════════════════════════');
    console.log('  TEST COMPLETE — Check screenshots in test_screenshots/');
    console.log('══════════════════════════════════════════════════════════\n');

    await page.waitForTimeout(2000);
    await browser.close();
}

runTest().catch(async (err) => {
    console.error('Unhandled error:', err);
    await browser?.close();
    process.exit(1);
});
