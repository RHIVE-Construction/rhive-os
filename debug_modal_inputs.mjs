import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/?bypass=Employee&page=E-01');
    await page.waitForTimeout(3000);

    console.log("Clicking New Project in Sidebar...");
    await page.click('aside button:has-text("New Project")');
    await page.waitForTimeout(3000);
    
    const inputDetails = await page.evaluate(() => {
        const list = [];
        document.querySelectorAll('input').forEach(input => {
            list.push({
                id: input.id,
                placeholder: input.placeholder,
                outerHTML: input.outerHTML,
                visible: input.getBoundingClientRect().width > 0
            });
        });
        return list;
    });
    
    console.log("Inputs found in DOM:", inputDetails);
    await browser.close();
})();
