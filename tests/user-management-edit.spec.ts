import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3001';

async function loginAsSuperAdmin(page: any) {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    const emailInput = page.locator('input[type="email"]').first();
    if (await emailInput.isVisible({ timeout: 4000 }).catch(() => false)) {
        await emailInput.fill('victor.v@rhiveconstruction.com');
        await page.locator('input[type="password"]').first().fill('Admin@123');
        await page.locator('button[type="submit"]').first().click();
        await page.waitForTimeout(3000);
    }
}

test.describe('UserManagementPage - Edit User Blank Screen Fix', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsSuperAdmin(page);
    });

    test('TC-01: Page loads without crash', async ({ page }) => {
        await page.goto(BASE_URL + '/#A-02', { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(3000);
        const body = await page.locator('body').textContent();
        expect(body!.trim().length).toBeGreaterThan(100);
        await expect(page.locator('text=User Management').first()).toBeVisible({ timeout: 10000 });
        await page.screenshot({ path: 'tests/screenshots/um-tc01-page-loaded.png' });
        console.log('PASS TC-01: Page loaded without crash');
    });

    test('TC-02: Edit modal opens - no blank screen', async ({ page }) => {
        await page.goto(BASE_URL + '/#A-02', { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(3000);
        await page.locator('[title="Edit user"]').first().click({ force: true });
        await page.waitForTimeout(800);
        await expect(page.locator('text=Edit Internal User').first()).toBeVisible({ timeout: 5000 });
        const body = await page.locator('body').textContent();
        expect(body!.trim().length).toBeGreaterThan(100);
        await page.screenshot({ path: 'tests/screenshots/um-tc02-edit-modal-open.png' });
        console.log('PASS TC-02: Edit modal opened - no blank screen');
    });

    test('TC-03: Email locked in edit mode', async ({ page }) => {
        await page.goto(BASE_URL + '/#A-02', { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(3000);
        await page.locator('[title="Edit user"]').first().click({ force: true });
        await page.waitForTimeout(800);
        await expect(page.locator('text=Edit Internal User').first()).toBeVisible({ timeout: 5000 });
        const emailInput = page.locator('input[type="email"]').first();
        const disabled = await emailInput.getAttribute('disabled');
        const readonly = await emailInput.getAttribute('readonly');
        expect(disabled !== null || readonly !== null).toBeTruthy();
        await expect(page.locator('text=Email cannot be changed after registration')).toBeVisible();
        await page.screenshot({ path: 'tests/screenshots/um-tc03-email-locked.png' });
        console.log('PASS TC-03: Email is locked in edit mode');
    });

    test('TC-04: Submit edit does NOT blank the page', async ({ page }) => {
        await page.goto(BASE_URL + '/#A-02', { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(3000);
        await page.locator('[title="Edit user"]').first().click({ force: true });
        await page.waitForTimeout(800);
        await expect(page.locator('text=Edit Internal User').first()).toBeVisible({ timeout: 5000 });
        // Submit without changes - just click confirm
        await page.locator('button[type="submit"]').first().click();
        await page.waitForTimeout(2000);
        // CRITICAL: body must NOT be blank after submit
        const body = await page.locator('body').textContent();
        expect(body!.trim().length).toBeGreaterThan(100);
        // Heading must still be visible
        await expect(page.locator('text=User Management').first()).toBeVisible({ timeout: 5000 });
        // Modal must be gone
        const modalVisible = await page.locator('text=Edit Internal User').isVisible().catch(() => false);
        expect(modalVisible).toBe(false);
        await page.screenshot({ path: 'tests/screenshots/um-tc04-after-submit-no-blank.png' });
        console.log('PASS TC-04: Edit submitted - page intact, no blank screen');
    });

    test('TC-05: Cancel closes modal cleanly', async ({ page }) => {
        await page.goto(BASE_URL + '/#A-02', { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(3000);
        await page.locator('[title="Edit user"]').first().click({ force: true });
        await page.waitForTimeout(800);
        await expect(page.locator('text=Edit Internal User').first()).toBeVisible({ timeout: 5000 });
        await page.locator('button', { hasText: 'Cancel' }).first().click();
        await page.waitForTimeout(500);
        await expect(page.locator('text=User Management').first()).toBeVisible({ timeout: 3000 });
        const modalGone = !(await page.locator('text=Edit Internal User').isVisible().catch(() => false));
        expect(modalGone).toBe(true);
        await page.screenshot({ path: 'tests/screenshots/um-tc05-cancel-works.png' });
        console.log('PASS TC-05: Cancel closes modal cleanly');
    });
});
