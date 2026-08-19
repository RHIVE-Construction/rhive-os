import { chromium } from 'playwright';

async function run() {
    console.log("Starting debug browser...");
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // Listen to console messages and page errors
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log(`BROWSER ERROR: ${msg.text()}`);
        } else {
            console.log(`BROWSER LOG: ${msg.text()}`);
        }
    });

    page.on('pageerror', err => {
        console.log(`PAGE ERROR CRASH: ${err.message}`);
        console.log(err.stack);
    });

    console.log("Navigating to http://localhost:3000/ ...");
    await page.goto('http://localhost:3000/', { waitUntil: 'load' });
    await page.waitForTimeout(2000);

    console.log("Clicking 'Emergency Leak' tab...");
    // Try to find the button with "Emergency Leak" text
    await page.locator('button:has-text("Emergency Leak")').click();
    await page.waitForTimeout(2000);

    console.log("Clicking 'Certified Quote' tab...");
    await page.locator('button:has-text("Certified Quote")').click();
    await page.waitForTimeout(2000);

    console.log("Clicking 'Instant Estimate' tab...");
    await page.locator('button:has-text("Instant Estimate")').click();
    await page.waitForTimeout(2000);

    await browser.close();
    console.log("Done debug run.");
}

run().catch(err => {
    console.error("Test failed:", err);
});
