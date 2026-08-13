import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();

    page.on('console', msg => console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`));
    page.on('pageerror', err => console.error(`[BROWSER UNCAUGHT ERROR] ${err.toString()}`));

    console.log("Setting query in sessionStorage and navigating...");
    try {
        await page.goto('http://localhost:3002/');
        await page.evaluate(() => {
            sessionStorage.setItem('globalSearchQuery', '9329 Tortellini Dr, Sandy, UT 84093, USA');
        });
        await page.goto('http://localhost:3002/?bypass=Public&page=P-12', { waitUntil: 'domcontentloaded' });
        
        console.log("Waiting for map confirmation page...");
        await page.waitForSelector('button:has-text("CONFIRM ADDRESS")', { timeout: 25000 });
        await page.waitForTimeout(2000); // Wait for solar data to fetch and load

        console.log("Locating the BLDG 1 input field...");
        const inputVal = await page.$eval('input[type="text"]', el => el.value);
        console.log(`BLDG 1 input value is currently: "${inputVal}"`);

        if (inputVal === '22.47') {
            console.log("SUCCESS: Onset value is correctly set to Google Solar API value 22.47!");
        } else {
            console.error(`FAILED: Onset value is "${inputVal}", expected "22.47"`);
        }

        console.log("Capturing screenshot of the confirmation page...");
        const path = 'C:/Users/Victor/.gemini/antigravity/brain/1856e6a8-b72c-4520-be85-08bb0ab4ff14/solar_onset_value.png';
        await page.screenshot({ path });
        console.log(`Screenshot saved to ${path}`);

        console.log("Clicking CONFIRM ADDRESS...");
        await page.click('button:has-text("CONFIRM ADDRESS")');
        
        console.log("Waiting for RoofOptions step...");
        await page.waitForTimeout(2000);
        await page.waitForSelector('button:has-text("Continue")', { timeout: 10000 });
        await page.click('button:has-text("Continue")');

        console.log("Waiting for Gutters step...");
        await page.waitForTimeout(2000);
        await page.waitForSelector('button:has-text("Continue")', { timeout: 10000 });
        await page.click('button:has-text("Continue")');

        console.log("Waiting for HeatTrace step...");
        await page.waitForTimeout(2000);
        await page.waitForSelector('button:has-text("Continue")', { timeout: 10000 });
        await page.click('button:has-text("Continue")');

        console.log("Waiting for the Shingle Options page...");
        await page.waitForTimeout(2000);
        await page.waitForSelector('input[type="number"]', { timeout: 15000 });
        await page.waitForTimeout(2000); // Wait for calculations to stabilize

        const optionsVal = await page.$eval('input[type="number"]', el => el.value);
        console.log(`Options page Total Roof Squares value is currently: "${optionsVal}"`);

        if (optionsVal === '22.47') {
            console.log("SUCCESS: Options page Total Roof Squares matches Google Solar API value 22.47 SQ!");
        } else {
            console.error(`FAILED: Options page Total Roof Squares is "${optionsVal}", expected "22.47"`);
        }

        const path2 = 'C:/Users/Victor/.gemini/antigravity/brain/1856e6a8-b72c-4520-be85-08bb0ab4ff14/options_page_squares.png';
        await page.screenshot({ path: path2 });
        console.log(`Screenshot saved to ${path2}`);

    } catch (err) {
        console.error("Error during navigation verification:", err);
    } finally {
        await browser.close();
    }
})();
