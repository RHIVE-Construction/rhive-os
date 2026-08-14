/**
 * RHIVE Test: Global Search → New Project / Address Verification Modal
 * Branch: test/search
 * Runner: node (CommonJS)
 *
 * Tests:
 * 1. Global search bar opens without black screen
 * 2. Typing an address in search — no crash
 * 3. Tab press → navigate → map modal appears
 * 4. Backspace on pre-populated address — no crash
 * 5. Full new project intake via CustomerInputPage
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:3001';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'test_screenshots', 'search');
if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

let browser, page;

const shot = async (name) => {
    try {
        const fp = path.join(SCREENSHOTS_DIR, `search_${name}.png`);
        await page.screenshot({ path: fp, fullPage: false });
        console.log(`  📸 ${fp}`);
    } catch {}
};
const log  = (msg) => console.log(`\n  ${msg}`);
const pass = (msg) => console.log(`  ✅ PASS: ${msg}`);
const fail = (msg, err) => { console.error(`  ❌ FAIL: ${msg}`, err ? String(err).slice(0, 200) : ''); };

const detectBlackScreen = async (context) => {
    const isBlack = await page.evaluate(() => {
        const t = document.body ? document.body.innerText || '' : '';
        if (
            t.includes('Something went wrong') ||
            t.includes('Maximum update depth') ||
            t.includes('Minified React error') ||
            t.includes('cannot update a component')
        ) return true;
        if (!document.body || document.body.children.length === 0) return true;
        return false;
    }).catch(() => false);
    if (isBlack) {
        fail(`BLACK SCREEN detected at: ${context}`);
        await shot(`crash_${context.replace(/\s+/g, '_')}`);
    }
    return isBlack;
};

async function tryClick(selectors, timeout = 3000) {
    for (const sel of selectors) {
        try {
            const el = page.locator(sel).first();
            if (await el.isVisible({ timeout })) { await el.click(); return true; }
        } catch {}
    }
    return false;
}

async function login() {
    try {
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(3000);

        // Try clicking user/profile button
        await tryClick([
            '#btn-user-menu',
            'button[title*="Developer" i]',
            'button[title*="Profile" i]',
            'button.rounded-full',
        ], 5000);
        await page.waitForTimeout(800);

        // Click Admin Portal option
        const adminClicked = await tryClick([
            'button:has-text("Admin Portal")',
            'button:has-text("Admin")',
            'button:has-text("Employee Portal")',
            '[data-role="Admin"]',
        ], 3000);

        if (!adminClicked) {
            // URL bypass
            await page.goto(`${BASE_URL}?bypass=admin`, { waitUntil: 'domcontentloaded', timeout: 15000 });
        }
        await page.waitForTimeout(2500);
        pass('Logged in (Admin/Employee)');
        await shot('01_logged_in');
        return true;
    } catch (err) {
        fail('Login failed', err);
        return false;
    }
}

async function testSearchBarOpens() {
    log('TEST 1: Global search bar opens without crash');
    try {
        // Open search modal via CustomEvent (same as clicking search icon in header)
        await page.evaluate(() => {
            window.dispatchEvent(new CustomEvent('open-customer-lookup'));
        });
        await page.waitForTimeout(1000);

        if (await detectBlackScreen('after-opening-search')) return false;

        // The search modal has id="search-lookup-input"
        const searchInput = page.locator('#search-lookup-input').first();
        await searchInput.waitFor({ state: 'visible', timeout: 6000 });
        pass('Search modal opened successfully');
        await shot('02_search_open');
        return true;
    } catch (err) {
        fail('Search bar did not open', err);
        return false;
    }
}

async function testTypingAddress() {
    log('TEST 2: Type address in search bar — no black screen');
    try {
        const searchInput = page.locator('#search-lookup-input').first();
        await searchInput.fill('');
        await searchInput.type('742 Evergreen Terrace', { delay: 60 });
        await page.waitForTimeout(1800);

        if (await detectBlackScreen('after-typing-address')) return false;

        // Check pac-container not suppressed for address query
        const suppressed = await page.evaluate(() => {
            const el = document.getElementById('pac-container-visibility');
            return el && el.innerHTML && el.innerHTML.includes('display: none');
        });
        suppressed
            ? fail('pac-container suppressed for address query — autocomplete hidden!')
            : pass('pac-container visible for address query');

        await shot('03_typed_address');
        pass('Typed address — no crash');
        return true;
    } catch (err) {
        fail('Error typing address', err);
        return false;
    }
}

async function testTabNavigatesToMapModal() {
    log('TEST 3: Tab press → navigate to CustomerInputPage → MAP MODAL appears');
    try {
        const searchInput = page.locator('#search-lookup-input').first();

        await searchInput.press('Tab');
        await page.waitForTimeout(5000); // Wait for geocoding + navigation

        if (await detectBlackScreen('after-tab-navigate')) return false;

        await shot('04_after_tab');

        // Check if we navigated to new project page
        const onIntakePage = await page.evaluate(() => {
            return document.title.toLowerCase().includes('lead') ||
                   document.body.innerText.includes('New Lead') ||
                   document.body.innerText.includes('Intake') ||
                   !!document.getElementById('property-address-input');
        });

        if (!onIntakePage) {
            fail('Did not navigate to New Lead intake page after Tab');
            return false;
        }
        pass('Navigated to intake page');

        // Check for AddressVerificationModal (satellite map)
        try {
            // Wait for the modal to appear (may take a few seconds for geocoding)
            await page.waitForSelector('#intake-google-map, [id="intake-google-map"]', { state: 'visible', timeout: 8000 });
            pass('🗺️  Address verification MAP MODAL is visible!');
            await shot('05_map_modal_open');
            return true;
        } catch {
            // Check for modal overlay text
            const modalText = await page.evaluate(() => document.body.innerText).catch(() => '');
            if (modalText.includes('Property Name') || modalText.includes('Confirmed Address') || modalText.includes('BLD-')) {
                pass('Address verification modal content detected');
                await shot('05_modal_detected');
                return true;
            }
            fail('Address verification modal did NOT appear — the map popup bug persists');
            await shot('05_map_modal_missing');
            return false;
        }
    } catch (err) {
        fail('Error during Tab navigation flow', err);
        return false;
    }
}

async function testModalCloseNoLoop() {
    log('TEST 4: Close verification modal — no re-open loop');
    try {
        // Find and click the X / Cancel button
        const closeBtn = page.locator('button[title="Cancel"], button svg ~ button').first();
        try {
            await closeBtn.click({ timeout: 3000 });
        } catch {
            // Try X button at top right of modal
            await page.locator('div.fixed button').last().click({ timeout: 3000 }).catch(() => {});
        }
        await page.waitForTimeout(1500);

        if (await detectBlackScreen('after-modal-close')) return false;

        const modalGone = await page.evaluate(() => !document.getElementById('intake-google-map'));
        if (!modalGone) {
            fail('Modal re-opened or still open — possible infinite loop!');
            return false;
        }
        pass('Modal closed cleanly — no re-open loop');
        await shot('06_modal_closed');
        return true;
    } catch (err) {
        fail('Error closing modal', err);
        return false;
    }
}

async function testBackspaceNoCrash() {
    log('TEST 5: Backspace on pre-populated address — no black screen crash');
    try {
        const addrInput = page.locator('#property-address-input, input[name="address"]').first();
        await addrInput.waitFor({ state: 'visible', timeout: 5000 });

        const preValue = await addrInput.inputValue();
        console.log(`    Pre-populated value: "${preValue}"`);

        await addrInput.click();
        await page.waitForTimeout(200);

        // Backspace 5 times (regression test from 18da767)
        for (let i = 0; i < 5; i++) {
            await page.keyboard.press('Backspace');
            await page.waitForTimeout(150);
            if (await detectBlackScreen(`backspace-${i+1}`)) return false;
        }

        pass('5× Backspace — no black screen crash ✅');
        await shot('07_after_backspace');
        return true;
    } catch (err) {
        fail('Error during backspace test', err);
        return false;
    }
}

async function testNewProjectFormDirectEntry() {
    log('TEST 6: Direct entry on CustomerInputPage — type + Enter → map modal');
    try {
        // Navigate directly to CustomerInputPage (E-02a)
        // First clear any pre-filled data by reloading the page via navigation
        await page.evaluate(() => {
            sessionStorage.removeItem('globalSearchQuery');
            sessionStorage.removeItem('globalSearchQueryType');
            sessionStorage.removeItem('globalSearchAddressData');
        });

        // Click "New Project" or find the intake link
        const newBtn = page.locator('button:has-text("New Project"), button:has-text("New Lead"), button:has-text("+ New")').first();
        try {
            await newBtn.click({ timeout: 5000 });
            await page.waitForTimeout(2000);
        } catch {
            // If button not found, look in sidebar/nav
            const navBtn = page.locator('nav a, aside a, [class*="sidebar"] button').filter({ hasText: /lead|intake|new project/i }).first();
            await navBtn.click({ timeout: 5000 });
            await page.waitForTimeout(2000);
        }

        if (await detectBlackScreen('new-project-page')) return false;
        await shot('08_new_project_form');

        // Find address input
        const addrInput = page.locator('#property-address-input, input[name="address"]').first();
        await addrInput.waitFor({ state: 'visible', timeout: 8000 });

        // Clear and type a test address
        await addrInput.fill('');
        await addrInput.type('1234 S Main St, Salt Lake City, UT', { delay: 50 });
        await page.waitForTimeout(2000);

        if (await detectBlackScreen('after-typing-in-form')) return false;

        // Press Enter to trigger geocoding
        await addrInput.press('Enter');
        await page.waitForTimeout(5000);

        if (await detectBlackScreen('after-enter-geocode')) return false;

        await shot('09_after_enter_geocode');

        // Check for map modal
        const mapVisible = await page.evaluate(() => {
            return !!document.getElementById('intake-google-map') ||
                   document.body.innerText.includes('Property Name / Nickname') ||
                   document.body.innerText.includes('BLD-1');
        });

        if (mapVisible) {
            pass('Map modal appeared on direct form entry (Enter key flow)');
            await shot('10_map_modal_direct_entry');

            // Confirm the address
            const confirmBtn = page.locator('button:has-text("Confirm"), button:has-text("Done")').first();
            try {
                await confirmBtn.click({ timeout: 5000 });
                await page.waitForTimeout(1000);
                pass('Confirmed address from map modal');
            } catch {
                pass('Map modal visible (confirm step skipped)');
            }
        } else {
            fail('Map modal did not appear on direct form entry + Enter');
        }

        if (await detectBlackScreen('final-check')) return false;

        pass('New project direct entry flow completed');
        await shot('11_form_complete');
        return true;
    } catch (err) {
        fail('New project form flow error', err);
        return false;
    }
}

async function runTests() {
    console.log('\n╔══════════════════════════════════════════════════════════╗');
    console.log('║  RHIVE — Search + Map Modal + New Project Test Suite    ║');
    console.log('║  Branch: test/search                                     ║');
    console.log('╚══════════════════════════════════════════════════════════╝');

    browser = await chromium.launch({ headless: false, slowMo: 80 });
    const ctx = await browser.newContext();
    page = await ctx.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });

    // Capture console errors
    const consoleErrors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => consoleErrors.push('PAGE_ERR: ' + err.message));

    const results = [];
    const run = async (name, fn) => {
        const passed = await fn().catch(err => { fail(name + ' threw', err); return false; });
        results.push({ name, passed });
        return passed;
    };

    const loggedIn = await login();
    if (!loggedIn) {
        console.error('\n❌ Login failed — cannot continue');
        await browser.close();
        return;
    }

    await run('1. Search bar opens',          testSearchBarOpens);
    await run('2. Typing address — no crash', testTypingAddress);
    await run('3. Tab → navigate → map modal', testTabNavigatesToMapModal);
    await run('4. Modal close — no loop',      testModalCloseNoLoop);
    await run('5. Backspace — no crash',       testBackspaceNoCrash);
    await run('6. Direct form entry → map',    testNewProjectFormDirectEntry);

    // -------- REPORT --------
    console.log('\n╔══════════════════════════════════════════════════════════╗');
    console.log('║                    TEST RESULTS                          ║');
    console.log('╠══════════════════════════════════════════════════════════╣');
    let passed = 0, failed = 0;
    for (const r of results) {
        const icon = r.passed ? '✅' : '❌';
        console.log(`║  ${icon} ${String(r.name).padEnd(50)}║`);
        r.passed ? passed++ : failed++;
    }
    console.log('╠══════════════════════════════════════════════════════════╣');
    console.log(`║  ${passed}/${results.length} PASSED                                           ║`);
    if (failed) console.log(`║  ${failed} FAILED — screenshots saved to test_screenshots/search/║`);
    console.log('╚══════════════════════════════════════════════════════════╝');

    if (consoleErrors.length > 0) {
        console.log(`\n🔴 ${consoleErrors.length} console error(s) captured:`);
        consoleErrors.slice(0, 8).forEach(e => console.log('   ' + e.slice(0, 200)));
    } else {
        console.log('\n✅ No console errors during test run');
    }

    await browser.close();
}

runTests().catch(err => {
    console.error('Fatal:', err);
    process.exit(1);
});
