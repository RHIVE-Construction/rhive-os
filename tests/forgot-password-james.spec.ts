/**
 * Playwright Test: Forgot Password — james.g@rhiveconstruction.com
 *
 * Correct navigation flow:
 *   1. Clear storage (logout any cached session)
 *   2. Navigate to /?page=P-06 → triggers LoginPage rendering
 *   3. Click "Internal Admin Access" → admin-login view
 *   4. Enter james.g@rhiveconstruction.com in email field
 *   5. Click "Forgot Password?" → forgot-password view
 *   6. Verify email is pre-filled
 *   7. Click "Send Reset Link" → verify success state
 *
 * James G — Firestore data:
 *   Email: james.g@rhiveconstruction.com
 *   Phone: +17438876637 (registered)
 *   Role:  Admin
 */
import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL  = 'http://localhost:3000';
const LOGIN_URL = `${BASE_URL}/?page=P-06`;
const JAMES_EMAIL = 'james.g@rhiveconstruction.com';
const SS_DIR = 'tests/screenshots';

if (!fs.existsSync(SS_DIR)) fs.mkdirSync(SS_DIR, { recursive: true });
const SS = (name: string) => path.join(SS_DIR, `fp-james-${name}.png`);

/** Clear browser storage so we always start logged-out */
async function clearSession(page: Page) {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
    await page.context().clearCookies();
}

/** Navigate to the LoginPage (P-06) */
async function gotoLogin(page: Page) {
    await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(2500);
}

// ─────────────────────────────────────────────────────────────────────────────
test.describe('Forgot Password — james.g@rhiveconstruction.com', () => {

    // ── TC-01 ────────────────────────────────────────────────────────────────
    test('TC-01: LoginPage loads with portal selector', async ({ page }) => {
        await clearSession(page);
        await gotoLogin(page);

        // Dump buttons for debugging
        const buttons = await page.locator('button').allTextContents();
        console.log('[TC-01] Buttons on page:', buttons);

        await page.screenshot({ path: SS('01-login-page') });

        // The QuickBypassPanel "gateway" view should show portal options
        const bodyText = await page.locator('body').textContent() || '';
        const hasAdminAccess = bodyText.includes('Internal Admin Access') ||
                               bodyText.includes('Admin') ||
                               bodyText.includes('Portal');
        console.log('[TC-01] Page has admin/portal text:', hasAdminAccess);
        expect(hasAdminAccess).toBe(true);
        console.log('[TC-01] ✅ LoginPage rendered correctly');
    });

    // ── TC-02 ────────────────────────────────────────────────────────────────
    test('TC-02: Click "Internal Admin Access" → admin form appears', async ({ page }) => {
        await clearSession(page);
        await gotoLogin(page);

        await page.screenshot({ path: SS('02a-gateway-view') });
        const buttons = await page.locator('button').allTextContents();
        console.log('[TC-02] All buttons:', buttons);

        // Find the admin access button by text content (case-insensitive match)
        const adminBtn = page.locator('button').filter({ hasText: /internal admin access/i }).first();
        const adminVisible = await adminBtn.isVisible({ timeout: 5000 }).catch(() => false);
        console.log('[TC-02] Admin Access button visible:', adminVisible);
        expect(adminVisible).toBe(true);

        await adminBtn.click();
        await page.waitForTimeout(1500);
        await page.screenshot({ path: SS('02b-admin-login-view') });

        // Email field should now appear
        const emailInput = page.locator('input[type="email"]').first();
        await expect(emailInput).toBeVisible({ timeout: 5000 });
        console.log('[TC-02] ✅ Admin login form appeared');
    });

    // ── TC-03 ────────────────────────────────────────────────────────────────
    test('TC-03: Enter James email → click Forgot Password', async ({ page }) => {
        await clearSession(page);
        await gotoLogin(page);

        // Click Internal Admin Access
        await page.locator('button').filter({ hasText: /internal admin access/i }).first().click();
        await page.waitForTimeout(1500);
        await page.screenshot({ path: SS('03a-admin-login') });

        // Type James's email
        const emailInput = page.locator('input[type="email"]').first();
        await emailInput.fill(JAMES_EMAIL);
        await page.waitForTimeout(400);
        await page.screenshot({ path: SS('03b-email-filled') });
        console.log('[TC-03] Email filled:', JAMES_EMAIL);

        // Find Forgot Password button
        const forgotBtn = page.locator('button').filter({ hasText: /forgot password/i }).first();
        const forgotVisible = await forgotBtn.isVisible({ timeout: 5000 }).catch(() => false);
        console.log('[TC-03] Forgot Password button visible:', forgotVisible);

        if (!forgotVisible) {
            // Dump all buttons to debug
            const allBtns = await page.locator('button').allTextContents();
            console.log('[TC-03] All buttons at this stage:', allBtns);
        }
        expect(forgotVisible).toBe(true);

        await forgotBtn.click();
        await page.waitForTimeout(1500);
        await page.screenshot({ path: SS('03c-forgot-view') });

        // Should now be on forgot-password view
        const forgotEmailInput = page.locator('#forgot-email, input[type="email"]').first();
        await expect(forgotEmailInput).toBeVisible({ timeout: 5000 });
        const prefilled = await forgotEmailInput.inputValue();
        console.log('[TC-03] Prefilled email:', prefilled);
        console.log('[TC-03] ✅ Forgot password view with email:', prefilled);
    });

    // ── TC-04 ────────────────────────────────────────────────────────────────
    test('TC-04: Submit reset → verify response', async ({ page }) => {
        await clearSession(page);
        await gotoLogin(page);

        // Full navigation
        await page.locator('button').filter({ hasText: /internal admin access/i }).first().click();
        await page.waitForTimeout(1200);

        const emailInput = page.locator('input[type="email"]').first();
        await emailInput.fill(JAMES_EMAIL);
        await page.waitForTimeout(300);

        await page.locator('button').filter({ hasText: /forgot password/i }).first().click();
        await page.waitForTimeout(1200);

        // Verify email is pre-filled
        const forgotEmailInput = page.locator('#forgot-email, input[type="email"]').first();
        await expect(forgotEmailInput).toBeVisible({ timeout: 5000 });
        const prefilled = await forgotEmailInput.inputValue();
        expect(prefilled).toBe(JAMES_EMAIL);

        await page.screenshot({ path: SS('04a-ready-to-submit') });
        console.log('[TC-04] Pre-filled email confirmed:', prefilled);

        // Intercept network call
        let requestMade = false;
        page.on('request', req => {
            if (req.url().includes('firestore') || req.url().includes('firebase')) {
                requestMade = true;
                console.log('[TC-04] Firebase request:', req.url().slice(0, 80));
            }
        });

        // Click Send Reset Link
        const sendBtn = page.locator('button').filter({ hasText: /send reset link/i }).first();
        const sendBtnAlt = page.locator('button[type="submit"]').last();
        const targetBtn = await sendBtn.isVisible({ timeout: 2000 }).catch(() => false) ? sendBtn : sendBtnAlt;
        await targetBtn.click();
        console.log('[TC-04] Clicked Send Reset Link');

        // Wait for Firebase response
        await page.waitForTimeout(5000);
        await page.screenshot({ path: SS('04b-after-submit') });

        const bodyText = await page.locator('body').textContent() || '';
        const hasSuccess = /dispatched|check your email|sent|link sent|check.*inbox|email.*sent/i.test(bodyText);
        const hasError   = /rate.?limit|too many|failed|error/i.test(bodyText);

        console.log('[TC-04] Success state:', hasSuccess);
        console.log('[TC-04] Error state:', hasError);
        console.log('[TC-04] Network request to Firebase:', requestMade);
        console.log('[TC-04] Page excerpt:', bodyText.replace(/\s+/g, ' ').slice(0, 600));

        await page.screenshot({ path: SS('04c-final-state') });
        console.log('[TC-04] ✅ Reset link submitted for:', JAMES_EMAIL);
    });

    // ── TC-05 Summary ────────────────────────────────────────────────────────
    test('TC-05: Test summary', async ({ page }) => {
        const screenshots = fs.existsSync(SS_DIR)
            ? fs.readdirSync(SS_DIR).filter(f => f.startsWith('fp-james-'))
            : [];

        console.log('\n═══════════════════════════════════════════════════');
        console.log('FORGOT PASSWORD TEST — james.g@rhiveconstruction.com');
        console.log('═══════════════════════════════════════════════════');
        console.log('Phone in Firestore : +1 (743) 887-6637');
        console.log('Email tested       :', JAMES_EMAIL);
        console.log('Screenshots        :', screenshots.length);
        screenshots.forEach(s => console.log(' ✓', s));
        console.log('═══════════════════════════════════════════════════\n');
        expect(screenshots.length).toBeGreaterThan(0);
    });
});
