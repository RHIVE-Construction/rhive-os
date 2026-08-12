/**
 * Debug script: dump what's on the page after load + clear storage
 * Run: npx playwright test tests/debug-page-dump.spec.ts --reporter=list --headed
 */
import { test } from '@playwright/test';
import * as fs from 'fs';

test('Dump page HTML after clearing storage', async ({ page }) => {
    // Clear all storage before navigating
    await page.context().clearCookies();

    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });

    // Clear localStorage & sessionStorage
    await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
    });

    // Reload after clearing
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // Dump text content
    const text = await page.locator('body').textContent();
    console.log('\n=== PAGE TEXT ===\n', text?.slice(0, 1000));

    // Dump button elements
    const buttons = await page.locator('button').allTextContents();
    console.log('\n=== BUTTONS ===\n', buttons.join('\n'));

    // Dump all links
    const links = await page.locator('a').allTextContents();
    console.log('\n=== LINKS ===\n', links.join('\n'));

    // Current URL
    console.log('\n=== URL ===\n', page.url());

    await page.screenshot({ path: 'tests/screenshots/debug-page-dump.png', fullPage: true });
    console.log('\nScreenshot saved to tests/screenshots/debug-page-dump.png');
});
