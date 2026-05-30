import { chromium } from 'playwright';

(async () => {
    console.log("Launching browser for debugging Employee Homepage...");
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER EXCEPTION:', err.toString()));

    console.log("Navigating to Employee Homepage (E-01) with Admin bypass...");
    const response = await page.goto('http://localhost:3000/?bypass=Admin&page=E-01');
    console.log("Navigation response status:", response?.status());
    
    await page.waitForTimeout(3000);

    const html = await page.content();
    console.log("Page HTML length:", html.length);
    console.log("Page title:", await page.title());

    // Check if #root is empty or has content
    const rootContent = await page.evaluate(() => document.getElementById('root')?.innerHTML || 'NOT FOUND');
    console.log("Root content snippet:", rootContent.substring(0, 500));

    await browser.close();
})();
