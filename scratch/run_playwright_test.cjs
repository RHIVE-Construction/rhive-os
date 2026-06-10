const { chromium } = require('playwright');
const path = require('path');

async function run() {
    console.log("Launching browser...");
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Listen to console events
    page.on('console', msg => {
        console.log(`[BROWSER CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`);
    });

    page.on('pageerror', err => {
        console.error(`[BROWSER PAGEERROR]:`, err);
    });

    console.log("Navigating to app with bypass=admin...");
    await page.goto('http://localhost:3000/?bypass=admin');
    
    // Wait for the dashboard/page to load
    await page.waitForTimeout(3000);

    console.log("Clicking Contact in sidebar...");
    // Let's find and click the contact page link in the sidebar
    // From screenshot we see a button/link with "Contact"
    await page.click('text=Contact');

    await page.waitForTimeout(2000);

    console.log("Taking initial screenshot...");
    await page.screenshot({ path: 'scratch/contacts_before_search.png' });

    console.log("Typing in search bar...");
    // Let's find the input with placeholder "Search name, email, phone, city..."
    const searchInput = page.locator('input[placeholder="Search name, email, phone, city..."]');
    await searchInput.fill('a');

    await page.waitForTimeout(2000);

    console.log("Taking screenshot after search...");
    await page.screenshot({ path: 'scratch/contacts_after_search.png' });

    console.log("Closing browser...");
    await browser.close();
}

run().catch(console.error);
