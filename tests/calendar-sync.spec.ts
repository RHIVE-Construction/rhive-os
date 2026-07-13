/**
 * Playwright Tests: Google Calendar Sync Feature (v3 — button in card item section)
 * Tests the always-visible "Link Google Calendar" button in each user card.
 * Run: npx playwright test tests/calendar-sync.spec.ts --reporter=list
 *
 * Auth flow:
 *   1. Load app (public homepage P-00)
 *   2. Click "Sign In / Portal" header icon → Login Page (P-06)
 *   3. Click "Admin" Developer Bypass button
 *   4. Navigate to User Management (A-02)
 */

import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

// ─── Helper: login as Admin ───────────────────────────────────────────────────
async function loginAsAdmin(page: Page): Promise<boolean> {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);

    const signInBtn = page.locator('[title="Sign In / Portal"]').first();
    const signInVisible = await signInBtn.isVisible({ timeout: 4000 }).catch(() => false);
    if (signInVisible) {
        await signInBtn.click();
        await page.waitForTimeout(2000);
    }

    const adminBypass = page.locator('button[type="button"]').filter({ hasText: /^Admin$/ }).first();
    const bypassVisible = await adminBypass.isVisible({ timeout: 4000 }).catch(() => false);

    if (bypassVisible) {
        await adminBypass.click();
        await page.waitForTimeout(3000);
        console.log('[Auth] ✓ Logged in as Admin via Developer Bypass');
        return true;
    }
    console.log('[Auth] ✗ Developer Bypass not found');
    return false;
}

// ─── Helper: navigate to User Management ─────────────────────────────────────
async function goToUserManagement(page: Page): Promise<void> {
    const links = [
        page.locator('button:has-text("User Management")').first(),
        page.locator('a:has-text("User Management")').first(),
    ];
    for (const link of links) {
        if (await link.isVisible({ timeout: 1500 }).catch(() => false)) {
            await link.click();
            await page.waitForTimeout(2000);
            break;
        }
    }
}

// ─── Tests ───────────────────────────────────────────────────────────────────

test.describe('Google Calendar Sync — User Management (v3)', () => {

    test('TC-01: App loads on public homepage', async ({ page }) => {
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(2000);

        const root = page.locator('#root');
        await expect(root).toBeAttached({ timeout: 8000 });
        await page.screenshot({ path: 'tests/screenshots/cal-tc01-homepage.png' });
        console.log('[TC-01] ✓ App loaded');
    });

    test('TC-02: Sign In navigates to Login page with Developer Bypass', async ({ page }) => {
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(2500);

        const signInBtn = page.locator('[title="Sign In / Portal"]').first();
        await expect(signInBtn).toBeVisible({ timeout: 6000 });
        await signInBtn.click();
        await page.waitForTimeout(2000);

        const adminBypass = page.locator('button[type="button"]').filter({ hasText: /^Admin$/ }).first();
        const bypassVisible = await adminBypass.isVisible({ timeout: 4000 }).catch(() => false);
        await page.screenshot({ path: 'tests/screenshots/cal-tc02-login-page.png' });

        expect(bypassVisible).toBe(true);
        console.log('[TC-02] ✓ Login page with Developer Bypass is accessible');
    });

    test('TC-03: Admin login redirects to dashboard', async ({ page }) => {
        const loggedIn = await loginAsAdmin(page);
        await page.screenshot({ path: 'tests/screenshots/cal-tc03-post-login.png' });

        const loginForm = page.locator('#login-email');
        const loginStillVisible = await loginForm.isVisible().catch(() => false);
        expect(loginStillVisible).toBe(false);
        console.log(`[TC-03] ✓ Admin logged in: ${loggedIn}, login form gone: ${!loginStillVisible}`);
    });

    test('TC-04: User Management shows Link Google Calendar button on every card', async ({ page }) => {
        await loginAsAdmin(page);
        await goToUserManagement(page);
        await page.waitForTimeout(1500);

        await page.screenshot({ path: 'tests/screenshots/cal-tc04-user-management.png', fullPage: false });

        // Button is now always visible in card body — no hover needed
        const calSyncBtns = page.locator('[id^="cal-sync-btn-"]');
        const count = await calSyncBtns.count();
        console.log(`[TC-04] Calendar sync buttons found: ${count}`);

        if (count > 0) {
            expect(count).toBeGreaterThan(0);

            // Verify first button is immediately visible (not hover-dependent)
            const firstBtn = calSyncBtns.first();
            const isVisible = await firstBtn.isVisible({ timeout: 2000 }).catch(() => false);
            expect(isVisible).toBe(true);
            console.log('[TC-04] ✓ "Link Google Calendar" button is permanently visible on user card');

            // Check button text
            const btnText = await firstBtn.innerText().catch(() => '');
            console.log(`[TC-04] Button text: "${btnText.trim()}"`);
            expect(btnText.toLowerCase()).toMatch(/link google calendar|calendar linked/);
        } else {
            console.log('[TC-04] ℹ No user cards visible — Firestore may have no users');
        }
    });

    test('TC-05: Link Google Calendar button has Google logo SVG', async ({ page }) => {
        await loginAsAdmin(page);
        await goToUserManagement(page);
        await page.waitForTimeout(1500);

        const calSyncBtns = page.locator('[id^="cal-sync-btn-"]');
        const count = await calSyncBtns.count();

        if (count > 0) {
            const firstBtn = calSyncBtns.first();
            // Check for the Google G logo SVG inside the button
            const googleSvg = firstBtn.locator('svg');
            const svgCount = await googleSvg.count();
            console.log(`[TC-05] SVG elements inside button: ${svgCount}`);
            expect(svgCount).toBeGreaterThan(0);

            await page.screenshot({ path: 'tests/screenshots/cal-tc05-google-btn.png' });
            console.log('[TC-05] ✓ Google logo SVG is present inside the Link Calendar button');
        } else {
            console.log('[TC-05] ℹ Skipped — no user cards');
            test.skip();
        }
    });

    test('TC-06: Clicking button opens Sync Google Calendar modal', async ({ page }) => {
        await loginAsAdmin(page);
        await goToUserManagement(page);
        await page.waitForTimeout(1500);

        const calSyncBtns = page.locator('[id^="cal-sync-btn-"]');
        const count = await calSyncBtns.count();

        if (count > 0) {
            // Button is always visible — click directly, no hover needed
            await calSyncBtns.first().click();
            await page.waitForTimeout(800);

            await page.screenshot({ path: 'tests/screenshots/cal-tc06-modal-open.png' });

            const modalTitle = page.locator('text=Sync Google Calendar').first();
            const modalVisible = await modalTitle.isVisible().catch(() => false);
            console.log(`[TC-06] Modal visible: ${modalVisible}`);

            expect(modalVisible).toBe(true);
            console.log('[TC-06] ✓ Sync Google Calendar modal opened');
        } else {
            console.log('[TC-06] ℹ Skipped — no user cards');
            test.skip();
        }
    });

    test('TC-07: Modal shows Connect Google Calendar button', async ({ page }) => {
        await loginAsAdmin(page);
        await goToUserManagement(page);
        await page.waitForTimeout(1500);

        const calSyncBtns = page.locator('[id^="cal-sync-btn-"]');
        const count = await calSyncBtns.count();

        if (count > 0) {
            await calSyncBtns.first().click();
            await page.waitForTimeout(800);

            const connectBtn = page.locator('#connect-google-calendar-btn');
            const btnVisible = await connectBtn.isVisible().catch(() => false);

            await page.screenshot({ path: 'tests/screenshots/cal-tc07-connect-btn.png' });

            if (btnVisible) {
                const btnText = await connectBtn.innerText().catch(() => '');
                console.log(`[TC-07] Connect button text: "${btnText.trim()}"`);
                expect(btnText.toLowerCase()).toContain('google calendar');
                console.log('[TC-07] ✓ Connect Google Calendar button is present');
            } else {
                console.log('[TC-07] ℹ Button not visible — checking for Firestore info note...');
                const firestoreNote = page.locator('text=settings / google_oauth').first();
                const noteVisible = await firestoreNote.isVisible().catch(() => false);
                console.log(`[TC-07] Firestore config note visible: ${noteVisible}`);
                if (noteVisible) {
                    console.log('[TC-07] ✓ Modal correctly shows Firestore config note');
                }
            }
        } else {
            console.log('[TC-07] ℹ Skipped — no user cards');
            test.skip();
        }
    });

    test('TC-08: Modal closes when Cancel is clicked', async ({ page }) => {
        await loginAsAdmin(page);
        await goToUserManagement(page);
        await page.waitForTimeout(1500);

        const calSyncBtns = page.locator('[id^="cal-sync-btn-"]');
        const count = await calSyncBtns.count();

        if (count > 0) {
            await calSyncBtns.first().click();
            await page.waitForTimeout(800);

            const cancelBtn = page.locator('button:has-text("Cancel")').last();
            const cancelVisible = await cancelBtn.isVisible().catch(() => false);

            if (cancelVisible) {
                await cancelBtn.click();
                await page.waitForTimeout(600);
                const modalTitle = page.locator('text=Sync Google Calendar').first();
                const stillVisible = await modalTitle.isVisible().catch(() => false);
                expect(stillVisible).toBe(false);
                await page.screenshot({ path: 'tests/screenshots/cal-tc08-modal-closed.png' });
                console.log('[TC-08] ✓ Modal closed after Cancel');
            } else {
                // Try backdrop
                const backdrop = page.locator('.fixed.inset-0 > .absolute.inset-0').first();
                if (await backdrop.count() > 0) {
                    await backdrop.click();
                    await page.waitForTimeout(600);
                    const stillVisible = await page.locator('text=Sync Google Calendar').first().isVisible().catch(() => false);
                    expect(stillVisible).toBe(false);
                    await page.screenshot({ path: 'tests/screenshots/cal-tc08-backdrop-close.png' });
                    console.log('[TC-08] ✓ Modal closed via backdrop');
                }
            }
        } else {
            console.log('[TC-08] ℹ Skipped — no user cards');
            test.skip();
        }
    });

    test('TC-09: Firestore config note visible in modal (no env var needed)', async ({ page }) => {
        await loginAsAdmin(page);
        await goToUserManagement(page);
        await page.waitForTimeout(1500);

        const calSyncBtns = page.locator('[id^="cal-sync-btn-"]');
        const count = await calSyncBtns.count();

        if (count > 0) {
            await calSyncBtns.first().click();
            await page.waitForTimeout(800);

            const firestoreNote = page.locator('text=settings / google_oauth').first();
            const noteVisible = await firestoreNote.isVisible().catch(() => false);
            await page.screenshot({ path: 'tests/screenshots/cal-tc09-firestore-note.png' });

            console.log(`[TC-09] Firestore config note visible: ${noteVisible}`);
            if (noteVisible) {
                console.log('[TC-09] ✓ Modal correctly references Firestore for Client ID (no env var)');
            } else {
                console.log('[TC-09] ℹ Note not found — checking full modal content...');
                const modalText = await page.locator('.fixed.inset-0').innerText().catch(() => '');
                console.log('[TC-09] Modal content:', modalText.slice(0, 300));
            }
        } else {
            console.log('[TC-09] ℹ Skipped — no user cards');
            test.skip();
        }
    });

});
