import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/?bypass=Employee&page=E-01');
    await page.waitForTimeout(3000);
    
    const buttons = await page.evaluate(() => {
        const list = [];
        document.querySelectorAll('aside button').forEach(b => {
            list.push(b.textContent || '');
        });
        return list;
    });
    
    console.log("Sidebar buttons found:", buttons);
    await browser.close();
})();
