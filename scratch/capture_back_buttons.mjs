import { chromium } from 'playwright';
import path from 'path';

(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();

    const baseDir = "C:\\Users\\USER\\.gemini\\antigravity\\brain\\b31ea27d-aa70-4db6-8106-2433cebdd10d";

    try {
        console.log("1. Navigate to Login...");
        await page.goto('http://localhost:3001/?page=P-06');
        await page.waitForTimeout(5000);

        console.log("2. Clicking Admin Bypass...");
        await page.locator('button:has-text("Admin")').click();
        
        console.log("3. Waiting for dashboard content...");
        await page.waitForTimeout(10000); 
        await page.screenshot({ path: path.join(baseDir, 'preview_dashboard_debug.png'), fullPage: true });

    } catch (err) {
        console.error("Capture failed:", err);
    } finally {
        await browser.close();
        console.log("Done.");
    }
})();
