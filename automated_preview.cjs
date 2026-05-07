const { chromium } = require('playwright');

async function runCapture() {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    page.on('console', msg => console.log(`[BRWS ${msg.type()}] ${msg.text()}`));

    console.log('Capturing Debug Info...');
    try {
        await page.goto('http://localhost:3002/');
        await page.waitForTimeout(5000);

        const html = await page.evaluate(() => document.body.innerHTML);
        console.log('--- BODY HTML START ---');
        console.log(html.substring(0, 500));
        console.log('--- BODY HTML END ---');

        await page.screenshot({ path: 'C:/Users/mjrob/OneDrive/Desktop/App Repo s/RHIVE-OS-1.0/DEBUG_FINAL.png' });
    } catch (e) {
        console.log(`Failed: ${e.message}`);
    }
    await browser.close();
}
runCapture();
