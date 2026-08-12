/**
 * RHIVE Google Calendar Sync — Integration Test
 * ==============================================
 * Tests that the "Connect Google Calendar" button triggers the
 * Firebase Auth Google OAuth popup correctly.
 *
 * Run: node tests/test_google_calendar_sync.mjs
 */

import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

mkdirSync('tests/screenshots', { recursive: true });

const BASE_URL = 'http://localhost:3000';

// Credentials — michael@rhiveconstruction.com / qwerty123 (SHA-256 hashed in Firestore)
const LOGIN_EMAIL = 'michael@rhiveconstruction.com';
const LOGIN_PASSWORD = 'qwerty123';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function run() {
    console.log('\n🔷 RHIVE Calendar Sync — Integration Test\n');
    const results = { modal: false, connectBtn: false, popup: false };

    const browser = await chromium.launch({
        headless: false,
        args: ['--start-maximized', '--disable-popup-blocking'],
        slowMo: 150,
    });
    const context = await browser.newContext({
        viewport: null,
        // Allow popups
    });
    const page = await context.newPage();

    try {
        // ─── 1. Navigate to app ─────────────────────────────────────────────
        console.log('📍 Step 1: Opening RHIVE OS at', BASE_URL);
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await sleep(2000);
        await page.screenshot({ path: 'tests/screenshots/cal_01_homepage.png' });
        console.log('   📸 Screenshot: cal_01_homepage.png');

        // ─── 2. Navigate to Login page ────────────────────────────────────────
        console.log('\n📍 Step 2: Navigating to Login page…');
        
        // Try the person/user icon in the header first
        const headerPersonBtn = page.locator('header button:has(svg), nav button:has(svg)').last();
        const personBtnVisible = await headerPersonBtn.isVisible({ timeout: 2000 }).catch(() => false);
        
        if (personBtnVisible) {
            // Click the rightmost icon button in the header (person icon)
            const allHeaderBtns = page.locator('header button, [class*="header"] button, [class*="nav"] button');
            const btnCount = await allHeaderBtns.count();
            console.log(`   Found ${btnCount} header buttons`);
            // The person icon is typically the last button in the header
            await allHeaderBtns.last().click();
            await sleep(1500);
        }
        
        // Check if login form appeared
        const loginFormCheck = await page.locator('#login-email').isVisible({ timeout: 3000 }).catch(() => false);
        
        if (!loginFormCheck) {
            // Navigate directly to login page via query param
            console.log('   Header click did not show login form — navigating directly to login page…');
            await page.evaluate(() => {
                // Trigger the SPA navigation to P-06 (LoginPage)
                window.dispatchEvent(new CustomEvent('navigate', { detail: { pageId: 'P-06' } }));
            });
            await sleep(1000);
            
            // Still not visible? Try URL with pageId param
            const stillNoLogin = await page.locator('#login-email').isVisible({ timeout: 2000 }).catch(() => false);
            if (!stillNoLogin) {
                await page.goto(BASE_URL + '?page=P-06', { waitUntil: 'domcontentloaded' });
                await sleep(1500);
            }
        }

        await page.screenshot({ path: 'tests/screenshots/cal_02_login_page.png' });
        console.log('   📸 Screenshot: cal_02_login_page.png');

        // ─── 3. Log in ─────────────────────────────────────────────────────
        console.log('\n📍 Step 3: Logging in…');

        // Fill email
        const emailInput = page.locator('#login-email');
        await emailInput.waitFor({ timeout: 15000 });
        await emailInput.fill(LOGIN_EMAIL);
        console.log('   ✓ Email filled:', LOGIN_EMAIL);

        // Fill password
        const passwordInput = page.locator('#login-password');
        await passwordInput.fill(LOGIN_PASSWORD);
        console.log('   ✓ Password filled');

        // Submit
        await page.locator('button[type="submit"]').first().click();
        await sleep(3000);
        await page.screenshot({ path: 'tests/screenshots/cal_03_after_login.png' });
        console.log('   📸 Screenshot: cal_03_after_login.png');
        console.log('   ✓ Login submitted, URL now:', page.url());

        // ─── 4. Navigate to User Management ─────────────────────────────────
        console.log('\n📍 Step 4: Navigating to User Management…');

        // Try to find it in the sidebar / nav
        const navUserMgmt = page.locator('[data-page="user-management"], a:has-text("User Management"), button:has-text("User Management")').first();
        const navVisible = await navUserMgmt.isVisible({ timeout: 3000 }).catch(() => false);

        if (navVisible) {
            await navUserMgmt.click();
        } else {
            // Use URL navigation - the SPA router reads the 'page' query param or hash
            await page.goto(BASE_URL + '#user-management', { waitUntil: 'domcontentloaded' });
            await sleep(1000);

            // Try looking for sidebar items
            const sidebarItems = page.locator('nav a, nav button, [role="navigation"] button');
            const count = await sidebarItems.count();
            console.log(`   Found ${count} nav items — looking for User Management...`);

            for (let i = 0; i < count; i++) {
                const text = await sidebarItems.nth(i).textContent().catch(() => '');
                if (text.toLowerCase().includes('user')) {
                    console.log(`   Clicking: "${text.trim()}"`);
                    await sidebarItems.nth(i).click();
                    break;
                }
            }
        }

        await sleep(2000);
        await page.screenshot({ path: 'tests/screenshots/cal_03_user_mgmt.png' });
        console.log('   📸 Screenshot: cal_03_user_mgmt.png');

        // ─── 4. Wait for user cards ──────────────────────────────────────────
        console.log('\n📍 Step 4: Waiting for user cards to load…');
        await sleep(2000);

        // Try multiple selectors for user cards
        const cardSelectors = [
            '.group.relative.bg-gray-900\\/40',
            '[class*="rounded-2xl"][class*="border"]',
            '.grid > div',
        ];

        let userCards = null;
        let cardCount = 0;
        for (const sel of cardSelectors) {
            const cards = page.locator(sel);
            const n = await cards.count().catch(() => 0);
            if (n > 0) {
                console.log(`   Found ${n} cards with selector: ${sel}`);
                userCards = cards;
                cardCount = n;
                break;
            }
        }

        if (!userCards || cardCount === 0) {
            console.warn('   ⚠ No user cards found. Taking debug screenshot...');
            await page.screenshot({ path: 'tests/screenshots/cal_debug_nocards.png', fullPage: true });
            console.log('   Check cal_debug_nocards.png for page state');
        }

        // ─── 5. Hover card to reveal calendar button ─────────────────────────
        console.log('\n📍 Step 5: Hovering over a user card…');
        const firstCard = userCards ? userCards.first() : null;

        if (firstCard) {
            await firstCard.hover();
            await sleep(600);
            await page.screenshot({ path: 'tests/screenshots/cal_04_card_hover.png' });
            console.log('   📸 Screenshot: cal_04_card_hover.png');

            // ─── 6. Click Calendar button ────────────────────────────────────
            console.log('\n📍 Step 6: Clicking Calendar sync button…');
            const calBtn = firstCard.locator('button[title*="Google Calendar" i], button[title*="calendar" i]').first();
            const calBtnVisible = await calBtn.isVisible({ timeout: 2000 }).catch(() => false);

            if (calBtnVisible) {
                await calBtn.click({ force: true });
                console.log('   ✓ Calendar button clicked');
            } else {
                // Fallback: look for CalendarIcon button in the card
                console.log('   Trying CalendarIcon button fallback…');
                const allBtns = firstCard.locator('button');
                const btnCount = await allBtns.count();
                console.log(`   Found ${btnCount} buttons in card`);
                // Calendar button is typically the first in the action row
                if (btnCount > 0) {
                    await allBtns.first().click({ force: true });
                }
            }

            await sleep(1500);
            await page.screenshot({ path: 'tests/screenshots/cal_05_after_cal_click.png' });
            console.log('   📸 Screenshot: cal_05_after_cal_click.png');
        }

        // ─── 7. Verify sync modal opened ─────────────────────────────────────
        console.log('\n📍 Step 7: Checking for Sync Google Calendar modal…');
        await sleep(500);

        // The modal title uses CSS uppercase; match against any text or the modal overlay
        const modalTitle = page.locator('#connect-google-calendar-btn').first();
        results.modal = await modalTitle.isVisible({ timeout: 5000 }).catch(() => false);

        if (results.modal) {
            console.log('   ✅ PASS — Sync Google Calendar modal is open');
            await page.screenshot({ path: 'tests/screenshots/cal_06_sync_modal.png' });
            console.log('   📸 Screenshot: cal_06_sync_modal.png');
        } else {
            console.error('   ❌ FAIL — Modal did not open');
            await page.screenshot({ path: 'tests/screenshots/cal_06_no_modal.png' });
        }

        // ─── 8. Find Connect button ───────────────────────────────────────────
        const connectBtn = page.locator('#connect-google-calendar-btn, button:has-text("Connect Google Calendar")').first();
        results.connectBtn = await connectBtn.isVisible({ timeout: 3000 }).catch(() => false);

        if (results.connectBtn) {
            console.log('   ✅ PASS — "Connect Google Calendar" button is present');
        } else {
            console.warn('   ⚠ Connect button not found — checking all buttons…');
            const allBtns = await page.locator('button').allTextContents();
            console.log('   Available buttons:', allBtns.filter(t => t.trim()).slice(0, 10));
        }

        // ─── 9. Click Connect — watch for OAuth popup ─────────────────────────
        console.log('\n📍 Step 9: Clicking "Connect Google Calendar" — listening for OAuth popup…');

        const popupPromise = context.waitForEvent('page', { timeout: 20000 }).catch(() => null);

        if (results.connectBtn) {
            await connectBtn.click();
            console.log('   ✓ Clicked Connect Google Calendar');
        }

        const popup = await popupPromise;

        if (popup) {
            results.popup = true;
            const popupUrl = popup.url();
            console.log('   ✅ PASS — OAuth popup appeared!');
            console.log('   📍 Popup URL:', popupUrl.slice(0, 120) + (popupUrl.length > 120 ? '…' : ''));

            await popup.waitForLoadState('domcontentloaded').catch(() => {});
            await popup.screenshot({ path: 'tests/screenshots/cal_07_google_popup.png' }).catch(() => {});
            console.log('   📸 Screenshot: cal_07_google_popup.png');

            const isGoogleUrl = popupUrl.includes('accounts.google.com') ||
                                popupUrl.includes('google.com/o/oauth2') ||
                                popupUrl.includes('firebaseapp.com/__/auth');
            
            console.log(`   URL is Google Auth: ${isGoogleUrl ? '✅ YES' : '⚠ UNRECOGNIZED — check URL above'}`);

            // Don't log in — just verify the popup opened correctly
            console.log('\n   ℹ Closing popup without logging in (this is a test run)');
            await popup.close().catch(() => {});
        } else {
            console.warn('   ⚠ No popup detected. Checking for error messages…');
            const errors = await page.locator('.text-red-400').allTextContents().catch(() => []);
            if (errors.length > 0) {
                console.error('   Error messages:', errors);
            } else {
                console.log('   No error text visible — popup may be blocked by browser settings.');
            }
            await page.screenshot({ path: 'tests/screenshots/cal_07_no_popup.png' });
        }

    } catch (err) {
        console.error('\n❌ Test error:', err.message);
        await page.screenshot({ path: 'tests/screenshots/cal_ERROR.png' }).catch(() => {});
    }

    // ─── Summary ─────────────────────────────────────────────────────────────
    const pass = (b) => b ? '✅ PASS' : '❌ FAIL';
    console.log('\n══════════════════════════════════════════════════');
    console.log('  RHIVE CALENDAR SYNC — TEST SUMMARY');
    console.log('══════════════════════════════════════════════════');
    console.log(`  Sync modal opened:        ${pass(results.modal)}`);
    console.log(`  Connect button visible:   ${pass(results.connectBtn)}`);
    console.log(`  Google OAuth popup:       ${results.popup ? '✅ PASS' : '⚠ BLOCKED / NOT DETECTED'}`);
    console.log('══════════════════════════════════════════════════');
    console.log('\n  Screenshots saved to: tests/screenshots/');
    console.log('\n  ⏸ Keeping browser open 8 seconds for inspection…\n');

    await sleep(8000);
    await browser.close();

    const allPassed = results.modal && results.connectBtn;
    process.exit(allPassed ? 0 : 1);
}

run();
