import { chromium } from 'playwright';
import path from 'path';

(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();

    const baseDir = "C:\\Users\\USER\\.gemini\\antigravity\\brain\\b31ea27d-aa70-4db6-8106-2433cebdd10d";

    try {
        console.log("1. Navigate to Home...");
        await page.goto('http://localhost:3001/');
        await page.waitForTimeout(5000);

        console.log("2. Opening About Lightbox...");
        // Search for 'Built by RHIVE.AI' and click it (it opens rhive-ai lightbox)
        // Or click 'View Our 10-Stage Process'
        await page.click('text="Built by RHIVE.AI"');
        await page.waitForTimeout(3000);
        
        console.log("3. Checking for Back Button...");
        const backBtn = page.locator('button:has-text("BACK")');
        const closeBtn = page.locator('button[title="Close"]');
        
        console.log("Back button visible:", await backBtn.isVisible());
        console.log("Close button visible:", await closeBtn.isVisible());

        await page.screenshot({ path: path.join(baseDir, 'debug_lightbox_top.png') });

        // Get inner HTML of the buttons container
        const html = await page.evaluate(() => {
            const el = document.querySelector('.absolute.top-6.right-6');
            return el ? el.innerHTML : 'NOT FOUND';
        });
        console.log("Buttons container HTML:", html);

    } catch (err) {
        console.error("Capture failed:", err);
    } finally {
        await browser.close();
        console.log("Done.");
    }
})();
