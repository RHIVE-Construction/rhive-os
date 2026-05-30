import { chromium } from 'playwright';

async function run() {
    console.log("=== STARTING HEADLESS DEBUG SEQUENCE ===");
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();

    page.on('console', msg => console.log(`[BROWSER CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`));
    page.on('pageerror', err => console.error(`[BROWSER ERROR]: ${err.message}`));

    try {
        const url = 'http://localhost:3000/?bypass=Employee&page=E-02a';
        console.log(`Navigating to ${url}...`);
        await page.goto(url);
        
        console.log("Waiting 5 seconds for page assembly...");
        await page.waitForTimeout(5000);

        const title = await page.title();
        console.log(`Page title: "${title}"`);

        const bodyHtml = await page.evaluate(() => document.body.innerHTML);
        console.log(`DOM length: ${bodyHtml.length} characters`);
        
        const lookupExists = await page.locator('#search-lookup-input').count() > 0;
        console.log(`Is #search-lookup-input in DOM? ${lookupExists}`);

        const screenshotPath = 'C:\\Users\\mjrob\\.gemini\\antigravity\\brain\\a8707e63-7c28-4d28-8bd0-01caacf0c810\\debug_screenshot.png';
        console.log(`Capturing screenshot to ${screenshotPath}...`);
        await page.screenshot({ path: screenshotPath });

    } catch (e) {
        console.error("Debug run failed with exception:", e);
    } finally {
        await browser.close();
        console.log("=== HEADLESS DEBUG SEQUENCE COMPLETE ===");
    }
}

run();
