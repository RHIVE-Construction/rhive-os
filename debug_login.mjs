import { chromium } from 'playwright';

(async () => {
    try {
        console.log('Launching browser...');
        const browser = await chromium.launch();
        const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
        const page = await context.newPage();
        
        // Listen to console logs
        page.on('console', msg => console.log(`BROWSER CONSOLE: ${msg.text()}`));
        // Listen to page errors
        page.on('pageerror', err => console.error(`BROWSER ERROR: ${err.message}`));
        
        console.log('Navigating to http://localhost:3000/...');
        await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
        
        console.log('Waiting for Continue as Guest button...');
        const btn = await page.waitForSelector('text="Continue as Guest"');
        console.log('Button found, clicking...');
        await btn.click();
        
        console.log('Waiting 5 seconds for login and redirects...');
        await page.waitForTimeout(5000);
        
        console.log('Current URL:', page.url());
        
        await browser.close();
    } catch (err) {
        console.error('Script error:', err);
        process.exit(1);
    }
})();
