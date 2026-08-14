import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();

    page.on('console', msg => console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`));
    page.on('pageerror', err => console.error(`[BROWSER UNCAUGHT ERROR] ${err.toString()}`));

    console.log("Setting query in sessionStorage and navigating...");
    try {
        await page.goto('http://localhost:3002/?bypass=Public&page=P-12', { waitUntil: 'domcontentloaded' });
        await page.evaluate(() => {
            sessionStorage.setItem('globalSearchQuery', '9329 Tortellini Dr, Sandy, UT 84093, USA');
        });
        await page.reload({ waitUntil: 'domcontentloaded' });
        
        console.log("Waiting for map confirmation page...");
        await page.waitForSelector('button:has-text("CONFIRM ADDRESS")', { timeout: 25000 });
        await page.click('button:has-text("CONFIRM ADDRESS")');
        
        console.log("Waiting for RoofOptions step...");
        await page.waitForTimeout(2000);
        await page.waitForSelector('button:has-text("Continue")', { timeout: 15000 });
        await page.click('button:has-text("Continue")');

        console.log("Waiting for Gutters step...");
        await page.waitForTimeout(2000);
        await page.waitForSelector('button:has-text("No, I\'ll consider it later.")', { timeout: 15000 });
        await page.click('button:has-text("No, I\'ll consider it later.")');

        console.log("Waiting for HeatTrace step...");
        await page.waitForTimeout(2000);
        await page.waitForSelector('button:has-text("No thanks, I\'ll risk it.")', { timeout: 15000 });
        await page.click('button:has-text("No thanks, I\'ll risk it.")');

        console.log("Waiting for Dashboard Shingle Options page...");
        await page.waitForTimeout(2000);
        await page.waitForSelector('button:has-text("MEASUREMENTS SUMMARY")', { timeout: 20000 });

        console.log("Clicking MEASUREMENTS SUMMARY...");
        await page.click('button:has-text("MEASUREMENTS SUMMARY")');

        console.log("Waiting for Measurements Summary Modal...");
        await page.waitForTimeout(2500);
        await page.waitForSelector('button:has-text("Pricing")', { timeout: 15000 });

        console.log("Clicking Pricing tab...");
        await page.click('button:has-text("Pricing")');
        await page.waitForTimeout(2500);

        const path = 'C:/Users/Victor/.gemini/antigravity/brain/1856e6a8-b72c-4520-be85-08bb0ab4ff14/measurements_summary_scroll.png';
        await page.screenshot({ path });
        console.log(`Screenshot saved to ${path}`);

    } catch (err) {
        console.error("Error during navigation verification:", err);
        const failPath = 'C:/Users/Victor/.gemini/antigravity/brain/1856e6a8-b72c-4520-be85-08bb0ab4ff14/verify_scroll_failure.png';
        await page.screenshot({ path: failPath });
        console.log(`Failure screenshot saved to ${failPath}`);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();
