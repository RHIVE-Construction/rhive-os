import { chromium } from 'playwright';
import path from 'path';

(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext({ viewport: { width: 1280, height: 1600 } });
    const page = await context.newPage();

    const baseDir = "C:\\Users\\USER\\.gemini\\antigravity\\brain\\b31ea27d-aa70-4db6-8106-2433cebdd10d";

    try {
        console.log("1. Navigate to Home...");
        await page.goto('http://localhost:3001/');
        await page.waitForTimeout(5000);

        console.log("2. Opening About Lightbox via Dispatch...");
        await page.evaluate(() => {
            window.dispatchEvent(new CustomEvent('v3-open-lightbox', { detail: 'about' }));
        });
        await page.waitForTimeout(3000);
        
        console.log("3. Capturing Lightbox...");
        await page.screenshot({ path: path.join(baseDir, 'debug_lightbox_about_v2.png') });

    } catch (err) {
        console.error("Capture failed:", err);
    } finally {
        await browser.close();
        console.log("Done.");
    }
})();
