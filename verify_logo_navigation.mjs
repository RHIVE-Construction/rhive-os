import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();

    page.on('console', msg => console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`));
    page.on('pageerror', err => console.error(`[BROWSER UNCAUGHT ERROR] ${err.toString()}`));

    try {
        console.log("Navigating to Estimate Tool (public)...");
        await page.goto('http://localhost:3002/?page=P-12', { waitUntil: 'domcontentloaded' });
        
        console.log("Waiting for Landing Page of the Estimator...");
        await page.waitForSelector('h1:has-text("Instant Estimator")', { timeout: 15000 });
        await page.waitForTimeout(2000);

        console.log("Clicking the top-left logo button...");
        await page.click('button[aria-label="Back to start"]');
        await page.waitForTimeout(2000);

        console.log("Verifying redirection to the homepage (P-00-V3 / finish on top text)...");
        await page.waitForSelector('text=FINISH ON TOP', { timeout: 15000 });
        console.log("SUCCESS: Clicked logo and successfully redirected back to the main homepage!");

        // Now test the BACK TO START button navigation
        console.log("Navigating back to P-12...");
        await page.goto('http://localhost:3002/?page=P-12', { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('h1:has-text("Instant Estimator")', { timeout: 15000 });
        await page.waitForTimeout(2000);

        console.log("Clicking the BACK TO START button...");
        await page.click('button:has-text("BACK TO START")');
        await page.waitForTimeout(2000);

        console.log("Verifying redirection to the homepage (P-00-V3)...");
        await page.waitForSelector('text=FINISH ON TOP', { timeout: 15000 });
        console.log("SUCCESS: Clicked BACK TO START and successfully redirected back to the main homepage!");

        // Take a screenshot of the homepage for verification
        const path = 'C:/Users/Victor/.gemini/antigravity/brain/1856e6a8-b72c-4520-be85-08bb0ab4ff14/homepage_redirect_verification.png';
        await page.screenshot({ path });
        console.log(`Screenshot saved to ${path}`);

    } catch (err) {
        console.error("Error during navigation verification:", err);
        const failPath = 'C:/Users/Victor/.gemini/antigravity/brain/1856e6a8-b72c-4520-be85-08bb0ab4ff14/verify_logo_navigation_failure.png';
        await page.screenshot({ path: failPath });
        console.log(`Failure screenshot saved to ${failPath}`);
    } finally {
        await browser.close();
    }
})();
