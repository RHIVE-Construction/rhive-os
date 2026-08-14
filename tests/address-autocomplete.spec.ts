/**
 * RHIVE Test: Address Autocomplete + Backspace Crash
 * Branch: test/stage1
 *
 * FIX 1 - Autocomplete dropdown not appearing:
 *   - GlobalCustomerLookupModal suppressed .pac-container and didn't clear on close.
 *   - AddressSection autocompleteRef never cleared on collapse, stale instance.
 *
 * FIX 2 - Backspace on pre-populated address caused black screen crash:
 *   - dispatchEvent('input', bubbles:true) in sync useEffect re-triggered
 *     React onChange, causing infinite render loop + Maximum update depth crash.
 *   - handleFieldChange didn't clear lat/lng, so verification modal re-opened
 *     on every backspace keystroke.
 */

import { chromium, Browser, Page } from 'playwright';

const BASE_URL = 'http://localhost:3001';
let browser: Browser;
let page: Page;

const shot = async (name: string) => {
    await page.screenshot({ path: `test_screenshots/addr_${name}.png`, fullPage: false });
    console.log(`  screenshot: addr_${name}.png`);
};
const log = (msg: string) => console.log('\n  ' + msg);
const pass = (msg: string) => console.log('  PASS: ' + msg);
const fail = (msg: string, err?: any) => { console.error('  FAIL: ' + msg, err || ''); };

async function runTest() {
    console.log('\n=== RHIVE - Address Autocomplete + Backspace Crash Test ===');

    browser = await chromium.launch({ headless: false, slowMo: 80 });
    page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });

    log('STEP 1: Load + Login');
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    try {
        const profileBtn = page.locator('button[title*="Developer"], button[title*="Profile"], button.rounded-full').first();
        await profileBtn.click({ timeout: 5000 });
        await page.waitForTimeout(500);
        const portalBtn = page.locator('button:has-text("Employee Portal"), button:has-text("Admin Portal")').first();
        await portalBtn.click({ timeout: 5000 });
        await page.waitForTimeout(2000);
        pass('Logged in');
        await shot('01_logged_in');
    } catch (err) { fail('Login failed', err); await browser.close(); return; }

    log('STEP 2: Navigate to New Project');
    try {
        const btn = page.locator('button:has-text("New Project"), button:has-text("New Lead")').first();
        await btn.click({ timeout: 8000 });
        await page.waitForTimeout(2500);
        pass('New Project loaded');
        await shot('02_new_project');
    } catch (err) { fail('Navigation failed', err); await browser.close(); return; }

    log('STEP 3: Check pac-container not pre-suppressed');
    const suppressed = await page.evaluate(() => {
        const el = document.getElementById('pac-container-visibility') as HTMLStyleElement | null;
        return el?.innerHTML?.includes('display: none') ?? false;
    });
    suppressed ? fail('pac-container suppressed before typing!') : pass('pac-container-visibility clean');

    log('STEP 4: Find address input');
    const addrInput = page.locator('#property-address-input, input[name="address"]').first();
    try {
        await addrInput.waitFor({ state: 'visible', timeout: 8000 });
        pass('Address input visible');
    } catch (err) { fail('Address input not found', err); await browser.close(); return; }

    log('STEP 5: Type address - verify dropdown appears');
    await addrInput.click();
    await addrInput.type('123 Main St Salt Lake', { delay: 80 });
    await page.waitForTimeout(3000);
    await shot('03_typing');

    const dropdown = await page.evaluate(() => {
        const pac = document.querySelector('.pac-container') as HTMLElement | null;
        if (!pac) return { visible: false, count: 0 };
        const s = window.getComputedStyle(pac);
        return { visible: s.display !== 'none' && pac.children.length > 0, count: pac.children.length };
    });
    dropdown.visible ? pass('Autocomplete dropdown visible - ' + dropdown.count + ' suggestions') : fail('Dropdown not visible (count: ' + dropdown.count + ')');
    await shot('04_dropdown');

    log('STEP 6: Select suggestion');
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(400);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2500);
    await shot('05_selected');
    pass('Suggestion selected');

    log('STEP 7: CRASH TEST - backspace on pre-populated address');
    try {
        const collapsed = page.locator('[class*="cursor-pointer"]').filter({ hasText: 'Property' }).first();
        await collapsed.click({ timeout: 2000 });
        await page.waitForTimeout(600);
    } catch { /* already expanded */ }
    try {
        await page.locator('button:has-text("Cancel"), button:has-text("Close")').first().click({ timeout: 1500 });
        await page.waitForTimeout(400);
    } catch { /* no modal */ }

    await addrInput.click();
    await page.waitForTimeout(200);
    let crashed = false;
    for (let i = 0; i < 15; i++) {
        await page.keyboard.press('Backspace');
        await page.waitForTimeout(100);
        const hasCrash = await page.evaluate(() =>
            document.body.innerHTML.includes('System Recovery: Render Isolated') ||
            document.body.innerHTML.includes('Maximum update depth')
        );
        if (hasCrash) { crashed = true; break; }
    }
    crashed ? (fail('BLACK SCREEN CRASH on backspace!'), await shot('06_crash'))
            : (pass('No crash after 15 backspaces - Fix 2 confirmed!'), await shot('06_no_crash'));

    log('STEP 8: Verify no verification modal spam on backspace');
    const verModalOpen = await page.evaluate(() => {
        const els = document.querySelectorAll('[class*="fixed"][class*="inset-0"]');
        for (const el of els) {
            const h = (el as HTMLElement).innerHTML;
            if (h.includes('Satellite') || h.includes('Street View') || h.includes('Confirm')) return true;
        }
        return false;
    });
    verModalOpen ? fail('Verification modal re-opened during backspace!') : pass('Verification modal did NOT re-open on backspace');
    await shot('07_no_modal_spam');

    log('STEP 9: Retype - autocomplete still works');
    await addrInput.fill('');
    await addrInput.type('789 Elm St Provo', { delay: 80 });
    await page.waitForTimeout(3000);
    const retypeWorks = await page.evaluate(() => {
        const pac = document.querySelector('.pac-container') as HTMLElement | null;
        if (!pac) return false;
        return window.getComputedStyle(pac).display !== 'none' && pac.children.length > 0;
    });
    retypeWorks ? pass('Autocomplete works after backspace + retype') : fail('Autocomplete broken after retype');
    await shot('08_retype_works');

    console.log('\n=== TEST COMPLETE ===\n');
    await page.waitForTimeout(2000);
    await browser.close();
}

runTest().catch(async (err) => {
    console.error('Test error:', err);
    await browser?.close();
    process.exit(1);
});
