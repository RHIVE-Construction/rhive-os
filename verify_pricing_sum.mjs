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

        console.log("Waiting for dashboard...");
        await page.waitForTimeout(2000);
        await page.waitForSelector('text=Live Estimate Breakdown', { timeout: 15000 });
        await page.waitForTimeout(2000);

        // Extract values
        const textContent = await page.evaluate(() => {
            const rows = Array.from(document.querySelectorAll('.space-y-1 > div'));
            return rows.map(r => r.textContent.trim());
        });

        console.log("Found rows in breakdown:", textContent);

        // Find specific items: Materials, Labor, Overhead, Profit, Total
        let materials = 0, labor = 0, overhead = 0, profit = 0, total = 0;
        textContent.forEach(row => {
            if (row.includes('Materials')) {
                materials = parseInt(row.replace(/[^\d]/g, ''), 10);
            } else if (row.includes('Labor')) {
                labor = parseInt(row.replace(/[^\d]/g, ''), 10);
            } else if (row.includes('Overhead')) {
                overhead = parseInt(row.replace(/[^\d]/g, ''), 10);
            } else if (row.includes('Profit')) {
                profit = parseInt(row.replace(/[^\d]/g, ''), 10);
            } else if (row.includes('Total')) {
                total = parseInt(row.replace(/[^\d]/g, ''), 10);
            }
        });

        console.log(`Extracted: Materials=$${materials}, Labor=$${labor}, Overhead=$${overhead}, Profit=$${profit}, Total=$${total}`);
        const computedTotal = materials + labor + overhead + profit;
        console.log(`Computed Total = $${computedTotal}`);

        if (computedTotal === total) {
            console.log("SUCCESS: Computed sum matches displayed Total perfectly!");
        } else {
            throw new Error(`FAILED: Discrepancy detected! Computed sum: ${computedTotal}, Displayed Total: ${total}`);
        }

        const path = 'C:/Users/Victor/.gemini/antigravity/brain/1856e6a8-b72c-4520-be85-08bb0ab4ff14/pricing_sum_check.png';
        await page.screenshot({ path });
        console.log(`Screenshot saved to ${path}`);

    } catch (err) {
        console.error("Error during background check:", err);
        const failPath = 'C:/Users/Victor/.gemini/antigravity/brain/1856e6a8-b72c-4520-be85-08bb0ab4ff14/pricing_sum_fail.png';
        await page.screenshot({ path: failPath });
        console.log(`Failure screenshot saved to ${failPath}`);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();
