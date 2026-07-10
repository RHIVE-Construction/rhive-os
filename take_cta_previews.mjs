import { chromium } from 'playwright';

async function run() {
    console.log('Launching browser...');
    const browser = await chromium.launch();
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    console.log('Navigating to V3 Landing Page...');
    await page.goto('http://localhost:3000/?page=P-00-V3');
    await page.waitForTimeout(3000); // Wait for animations

    console.log('Capturing Estimate Tab Active...');
    await page.screenshot({ path: 'C:\\Users\\USER\\.gemini\\antigravity\\brain\\aff148b6-9e36-4e94-a2b7-4cf74677fd41\\estimate_tab_active.png' });

    console.log('Clicking Certified Quote Tab...');
    await page.click('text=Certified Quote');
    await page.waitForTimeout(1000);

    console.log('Capturing Quote Tab Active...');
    await page.screenshot({ path: 'C:\\Users\\USER\\.gemini\\antigravity\\brain\\aff148b6-9e36-4e94-a2b7-4cf74677fd41\\quote_tab_active.png' });

    console.log('Done.');
    await browser.close();
}

run().catch(console.error);
