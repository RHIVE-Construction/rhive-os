import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/?bypass=Employee&page=E-01');
    await page.waitForTimeout(3000);

    console.log("Current page ID before click:", await page.evaluate(() => window.location.search));
    
    // Take screenshot before click
    await page.screenshot({ path: 'debug_before_click.png' });
    
    console.log("Clicking New Project in Sidebar...");
    await page.click('aside button:has-text("New Project")');
    await page.waitForTimeout(3000);
    
    // Take screenshot after click
    await page.screenshot({ path: 'debug_after_click.png' });
    
    const pageState = await page.evaluate(() => {
        return {
            url: window.location.href,
            activePageId: document.body.innerHTML.includes('Global Command Search') ? 'Modal is visible' : 'Modal is NOT visible',
            bodyText: document.body.textContent?.slice(0, 500)
        };
    });
    
    console.log("Page state:", pageState);
    await browser.close();
})();
