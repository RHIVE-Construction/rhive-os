import { test, expect } from '@playwright/test';
import fs from 'fs';

test('system scan sidebar visibility based on scroll', async ({ page }) => {
    // 1. Load the landing page (which defaults to V3)
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

    // Wait a bit for layout to settle
    await page.waitForTimeout(500);

    const sidebarTab = page.locator('button:has-text("System Scan")');

    // 2. Initially, at the top of the page, the sidebar should not be visible
    await expect(sidebarTab).toBeHidden();

    // Take a screenshot of the top of the page showing it is hidden
    const artifactDir = 'C:\\Users\\USER\\.gemini\\antigravity\\brain\\37434385-8b4a-4a67-9826-8b022b343241';
    const topScreenshot = await page.screenshot();
    fs.writeFileSync(`${artifactDir}\\scroll_top_hidden.png`, topScreenshot);

    // 3. Scroll to the Capability Catalog section (#services)
    const servicesSection = page.locator('#services');
    await expect(servicesSection).toBeVisible();
    await servicesSection.scrollIntoViewIfNeeded();

    // Wait for scroll and polling check
    await page.waitForTimeout(800);

    // 4. Now the sidebar tab should be visible
    await expect(sidebarTab).toBeVisible();

    // Take a screenshot showing the sidebar tab is visible
    const bottomScreenshot = await page.screenshot();
    fs.writeFileSync(`${artifactDir}\\scroll_down_visible.png`, bottomScreenshot);

    // 5. Scroll back to the top of the main container
    await page.locator('main').evaluate(el => el.scrollTop = 0);

    // Wait for animations and polling check
    await page.waitForTimeout(800);

    // 6. The sidebar tab should be hidden again
    await expect(sidebarTab).toBeHidden();

    // Take a final screenshot showing it is hidden again
    const finalScreenshot = await page.screenshot();
    fs.writeFileSync(`${artifactDir}\\scroll_back_top_hidden.png`, finalScreenshot);
});
