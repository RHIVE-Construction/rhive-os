import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();

    page.on('console', msg => console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`));
    page.on('pageerror', err => console.error(`[BROWSER UNCAUGHT ERROR] ${err.toString()}`));

    try {
        console.log("Navigating to P-12 to check background...");
        await page.goto('http://localhost:3002/?page=P-12', { waitUntil: 'domcontentloaded' });
        
        console.log("Waiting for Landing Page...");
        await page.waitForSelector('h1:has-text("Instant Estimator")', { timeout: 15000 });
        await page.waitForTimeout(3000); // Allow animation to start rendering

        const path = 'C:/Users/Victor/.gemini/antigravity/brain/1856e6a8-b72c-4520-be85-08bb0ab4ff14/estimator_background_check.png';
        await page.screenshot({ path });
        console.log(`Screenshot saved to ${path}`);

    } catch (err) {
        console.error("Error during background check:", err);
    } finally {
        await browser.close();
    }
})();
