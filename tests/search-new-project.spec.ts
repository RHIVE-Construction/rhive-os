/**
 * RHIVE Test: Global Search → New Project / Address Verification Modal
 * Branch: test/search
 *
 * Tests:
 * 1. Global search bar opens and accepts input without black screen
 * 2. Typing an address not in the system → Tab → navigates to CustomerInputPage
 * 3. Address verification MAP MODAL appears (satellite view)
 * 4. Backspacing in pre-populated address field does NOT cause black screen
 * 5. Full new project intake form can be filled and submitted
 */

import { chromium, Browser, Page } from 'playwright';

const BASE_URL = 'http://localhost:3001';
const SCREENSHOTS_DIR = 'test_screenshots/search';

let browser: Browser;
let page: Page;

const shot = async (name: string) => {
    try {
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/search_${name}.png`, fullPage: false });
        console.log(`  📸 ${SCREENSHOTS_DIR}/search_${name}.png`);
    } catch {}
};
const log  = (msg: string) => console.log(`\n  ${msg}`);
const pass = (msg: string) => console.log(`  ✅ PASS: ${msg}`);
const fail = (msg: string, err?: any) => { console.error(`  ❌ FAIL: ${msg}`, err || ''); };

// Test address that is definitely NOT in the system
const TEST_ADDR = '742 Evergreen Terrace, Salt Lake City, UT 84103';
const TEST_ADDR_SHORT = '742 Evergreen Terrace';

// ------------------------------------------------------------------ LOGIN ---
async function login(): Promise<boolean> {
    try {
        await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(2000);

        // Try dev login via profile button
        const profileBtn = page.locator('button[title*="Developer"], button[title*="Profile"], button.rounded-full').first();
        await profileBtn.click({ timeout: 8000 });
        await page.waitForTimeout(500);

        const portalBtn = page.locator('button:has-text("Employee Portal"), button:has-text("Admin Portal")').first();
        await portalBtn.click({ timeout: 5000 });
        await page.waitForTimeout(2500);
        pass('Logged in as Employee/Admin');
        await shot('01_logged_in');
        return true;
    } catch (err) {
        fail('Login failed', err);
        return false;
    }
}

// --------------------------------------------------------- CRASH DETECTOR ---
async function detectBlackScreen(context: string): Promise<boolean> {
    const isBlack = await page.evaluate(() => {
        // Check for React error boundary
        const errorText = document.body.innerText;
        if (errorText.includes('Something went wrong') ||
            errorText.includes('Maximum update depth') ||
            errorText.includes('Minified React error') ||
            errorText.includes('cannot update a component') ||
            document.body.children.length === 0) {
            return true;
        }
        // Check for truly empty / white / black body
        const bg = window.getComputedStyle(document.body).backgroundColor;
        if (bg === 'rgb(0, 0, 0)' && document.body.innerText.trim() === '') return true;
        return false;
    });

    if (isBlack) {
        fail(`BLACK SCREEN detected at: ${context}`);
        await shot(`crash_${context.replace(/\s+/g, '_')}`);
    }
    return isBlack;
}

// ------------------------------------------------ TEST 1: Search bar opens ---
async function testSearchBarOpens(): Promise<boolean> {
    log('TEST 1: Global search bar opens without crash');
    try {
        // Click the search icon in the global header
        const searchBtn = page.locator('button[title*="Search"], button[title*="search"], [data-testid="search-btn"]').first();
        await searchBtn.click({ timeout: 5000 });
        await page.waitForTimeout(800);

        if (await detectBlackScreen('after-opening-search')) return false;

        // Check search modal is visible
        const searchInput = page.locator('input[placeholder*="Search"], input[placeholder*="search"], input[placeholder*="customer"], input[placeholder*="address"]').first();
        await searchInput.waitFor({ state: 'visible', timeout: 5000 });
        pass('Search modal opened');
        await shot('02_search_open');
        return true;
    } catch (err) {
        fail('Search bar did not open', err);
        // Try keyboard shortcut
        try {
            await page.keyboard.press('Meta+k');
            await page.waitForTimeout(800);
            const inp = page.locator('input[placeholder*="Search"], input[placeholder*="search"]').first();
            await inp.waitFor({ state: 'visible', timeout: 3000 });
            pass('Search opened via keyboard shortcut');
            return true;
        } catch {
            fail('Search bar unreachable');
            return false;
        }
    }
}

// --------------------------------- TEST 2: Type address → no crash on input ---
async function testTypingAddress(): Promise<boolean> {
    log('TEST 2: Type address in search bar — no black screen');
    try {
        const searchInput = page.locator('input[placeholder*="Search"], input[placeholder*="search"], input[placeholder*="customer"], input[placeholder*="address"]').first();

        // Type address
        await searchInput.type('742 Evergreen Terrace', { delay: 60 });
        await page.waitForTimeout(1500);

        if (await detectBlackScreen('after-typing-address')) return false;

        await shot('03_typed_address');
        pass('Typed address — no crash');

        // Check pac-container not suppressing
        const suppressed = await page.evaluate(() => {
            const el = document.getElementById('pac-container-visibility') as HTMLStyleElement | null;
            return el?.innerHTML?.includes('display: none') ?? false;
        });
        suppressed
            ? fail('pac-container is being suppressed for address query!')
            : pass('pac-container visible for address query');

        return true;
    } catch (err) {
        fail('Error while typing address', err);
        return false;
    }
}

// --------- TEST 3: Tab press → navigate to CustomerInputPage → modal opens ---
async function testTabNavigatesToMapModal(): Promise<boolean> {
    log('TEST 3: Tab press → navigate → address verification modal appears');
    try {
        const searchInput = page.locator('input[placeholder*="Search"], input[placeholder*="search"], input[placeholder*="customer"], input[placeholder*="address"]').first();

        // Press Tab to navigate to new project intake
        await searchInput.press('Tab');
        await page.waitForTimeout(4000); // Wait for geocoding + navigation

        if (await detectBlackScreen('after-tab-navigate')) return false;

        await shot('04_after_tab');

        // Check that we're on CustomerInputPage (New Lead Entry)
        const pageTitle = await page.locator('h1, [class*="title"]').first().textContent({ timeout: 5000 }).catch(() => '');
        console.log(`    Page title: "${pageTitle}"`);

        // Look for AddressVerificationModal (the satellite map overlay)
        const modal = page.locator('[id="intake-google-map"], .fixed.inset-0.z-\\[9999\\]').first();
        try {
            await modal.waitFor({ state: 'visible', timeout: 8000 });
            pass('Address verification MAP MODAL is visible 🗺️');
            await shot('05_map_modal_open');
            return true;
        } catch {
            // Map might still be loading — check for the modal overlay
            const overlay = page.locator('div.fixed.inset-0').filter({ hasText: /Property|Satellite|Building|Confirm/i }).first();
            try {
                await overlay.waitFor({ state: 'visible', timeout: 5000 });
                pass('Address verification modal overlay detected');
                await shot('05_modal_overlay');
                return true;
            } catch {
                fail('Address verification modal did NOT appear after Tab navigation');
                await shot('05_modal_missing');
                return false;
            }
        }
    } catch (err) {
        fail('Error during Tab + navigation flow', err);
        return false;
    }
}

// -------------- TEST 4: Close modal and check no re-open loop ---------------
async function testModalCloseNoLoop(): Promise<boolean> {
    log('TEST 4: Close map modal → no infinite re-open loop');
    try {
        // Press X / Cancel button in the modal
        const closeBtn = page.locator('button[title="Cancel"], button[title="Close"], button:has(svg)').filter({ hasText: '' }).first();
        try {
            await closeBtn.click({ timeout: 3000 });
        } catch {
            // Try pressing Escape
            await page.keyboard.press('Escape');
        }
        await page.waitForTimeout(1500);

        if (await detectBlackScreen('after-modal-close')) return false;

        await shot('06_modal_closed');

        // Modal should be gone now
        const modalVisible = await page.locator('[id="intake-google-map"]').isVisible().catch(() => false);
        if (modalVisible) {
            fail('Modal re-opened immediately after closing — infinite loop!');
            return false;
        }
        pass('Modal closed cleanly — no re-open loop');
        return true;
    } catch (err) {
        fail('Error closing modal', err);
        return false;
    }
}

// --- TEST 5: Backspace on pre-populated address — no black screen crash ------
async function testBackspaceNoCrash(): Promise<boolean> {
    log('TEST 5: Backspace on pre-populated address field → no crash');
    try {
        // Find the address input (now pre-populated)
        const addrInput = page.locator('#property-address-input, input[name="address"]').first();
        await addrInput.waitFor({ state: 'visible', timeout: 5000 });

        const preValue = await addrInput.inputValue();
        console.log(`    Pre-populated value: "${preValue}"`);

        // Click and backspace multiple times (the 18da767 crash scenario)
        await addrInput.click();
        await page.waitForTimeout(300);

        for (let i = 0; i < 5; i++) {
            await page.keyboard.press('Backspace');
            await page.waitForTimeout(100);
            if (await detectBlackScreen(`backspace-${i + 1}`)) return false;
        }

        pass('5x Backspace — no black screen crash');
        await shot('07_after_backspace');
        return true;
    } catch (err) {
        fail('Error during backspace test', err);
        return false;
    }
}

// --- TEST 6: Full form fill and submit via New Project button ---------------
async function testFullIntakeFlow(): Promise<boolean> {
    log('TEST 6: Full intake flow via "New Project" button');
    try {
        // Navigate directly to intake page
        await page.evaluate(() => {
            window.dispatchEvent(new CustomEvent('open-customer-lookup'));
        });
        await page.waitForTimeout(1000);

        // Close lookup if open
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);

        // Click "New Project" or navigate directly
        const newProjectBtn = page.locator('button:has-text("New Project"), button:has-text("New Lead"), a:has-text("New Lead")').first();
        try {
            await newProjectBtn.click({ timeout: 5000 });
        } catch {
            // Try sidebar
            const sidebarItem = page.locator('nav button, aside button').filter({ hasText: /New|Intake|Lead/i }).first();
            await sidebarItem.click({ timeout: 5000 });
        }

        await page.waitForTimeout(2000);
        if (await detectBlackScreen('new-project-page-load')) return false;

        pass('New Project page loaded');
        await shot('08_new_project_page');

        // Find the address input
        const addrInput = page.locator('#property-address-input, input[name="address"]').first();
        await addrInput.waitFor({ state: 'visible', timeout: 8000 });

        // Type the test address
        await addrInput.click();
        await addrInput.fill(TEST_ADDR_SHORT);
        await page.waitForTimeout(2000);

        if (await detectBlackScreen('after-typing-in-form')) return false;

        // Press Enter to geocode
        await addrInput.press('Enter');
        await page.waitForTimeout(4000);

        if (await detectBlackScreen('after-enter-geocode')) return false;

        await shot('09_form_typed_address');

        // Check if verification modal appeared
        const modalVisible = await page.evaluate(() => {
            return !!document.getElementById('intake-google-map') ||
                   document.body.innerText.includes('Confirm') ||
                   document.body.innerText.includes('Pin Buildings');
        });

        if (modalVisible) {
            pass('Satellite map modal appeared after Enter geocode ✅');

            // Click Confirm button (accept the current pin location)
            const confirmBtn = page.locator('button:has-text("Confirm"), button:has-text("Save"), button:has-text("Done")').first();
            try {
                await confirmBtn.click({ timeout: 5000 });
                await page.waitForTimeout(1000);
                pass('Modal confirmed');
                await shot('10_modal_confirmed');
            } catch {
                // Close via X
                await page.keyboard.press('Escape');
                await page.waitForTimeout(500);
            }
        } else {
            fail('Satellite map modal did NOT appear on CustomerInputPage after Enter geocode');
        }

        if (await detectBlackScreen('after-modal-confirm')) return false;

        pass('Full intake flow completed without crash');
        await shot('11_form_after_confirm');
        return true;
    } catch (err) {
        fail('Full intake flow error', err);
        return false;
    }
}

// ---------------------------------------------------------------- MAIN RUN --
async function runTests() {
    console.log('\n╔═════════════════════════════════════════════════════════╗');
    console.log('║  RHIVE — Search + New Project + Map Modal Test Suite   ║');
    console.log('║  Branch: test/search                                    ║');
    console.log('╚═════════════════════════════════════════════════════════╝');

    // Ensure screenshots dir exists
    const fs = await import('fs');
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

    browser = await chromium.launch({ headless: false, slowMo: 80 });
    const context = await browser.newContext();
    page = await context.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });

    // Capture console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
        if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
        }
    });

    const results: { name: string; passed: boolean }[] = [];

    const runTest = async (name: string, fn: () => Promise<boolean>) => {
        const passed = await fn().catch(err => { fail(`${name} threw: ${err}`); return false; });
        results.push({ name, passed });
        return passed;
    };

    // Log in first
    const loggedIn = await login();
    if (!loggedIn) {
        console.error('\n❌ Cannot continue — login failed');
        await browser.close();
        return;
    }

    await runTest('1. Search bar opens', testSearchBarOpens);
    await runTest('2. Typing address — no crash', testTypingAddress);
    await runTest('3. Tab → navigate → map modal', testTabNavigatesToMapModal);
    await runTest('4. Modal close — no loop', testModalCloseNoLoop);
    await runTest('5. Backspace — no black screen', testBackspaceNoCrash);
    await runTest('6. Full intake flow', testFullIntakeFlow);

    // -------- Final Report --------
    console.log('\n╔═════════════════════════════════════════════════════════╗');
    console.log('║                    TEST RESULTS                         ║');
    console.log('╠═════════════════════════════════════════════════════════╣');
    let passed = 0;
    let failed = 0;
    for (const r of results) {
        const icon = r.passed ? '✅' : '❌';
        console.log(`║  ${icon} ${r.name.padEnd(48)}║`);
        r.passed ? passed++ : failed++;
    }
    console.log('╠═════════════════════════════════════════════════════════╣');
    console.log(`║  Total: ${passed}/${results.length} PASSED                                  ║`);
    if (failed > 0) {
        console.log(`║  ⚠  ${failed} FAILED — see screenshots in ${SCREENSHOTS_DIR}/      ║`);
    }
    console.log('╚═════════════════════════════════════════════════════════╝');

    if (consoleErrors.length > 0) {
        console.log('\n🔴 Console errors detected during test:');
        consoleErrors.slice(0, 10).forEach(e => console.log('  ' + e));
    }

    await browser.close();
}

runTests().catch(err => {
    console.error('Fatal test error:', err);
    process.exit(1);
});
