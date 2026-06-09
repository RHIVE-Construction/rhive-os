import { chromium } from 'playwright';

(async () => {
    try {
        console.log('Launching browser...');
        const browser = await chromium.launch();
        const context = await browser.newContext({ viewport: { width: 1440, height: 4500 } });
        const page = await context.newPage();
        
        console.log('Navigating to Landing Page V2...');
        await page.goto('http://localhost:3000/?page=P-00-V2');
        
        console.log('Waiting for elements to load...');
        await page.waitForTimeout(5000); // give time for animations to settle
        
        const path = 'C:\\\\Users\\\\USER\\\\.gemini\\\\antigravity\\\\brain\\\\40f8b6f1-af4a-43f3-97ee-9d9414fa26ae\\\\landing_page_v2_preview.png';
        console.log('Capturing screenshot...');
        await page.screenshot({ path: path, fullPage: true });
        
        console.log('Done.');
        await browser.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();

