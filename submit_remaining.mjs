import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'http://localhost:3000';
const screenshotsDir = './public/estimate-proofs';

if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function run() {
    console.log("=== RUNNING REMAINING ESTIMATE SUBMISSION ===");
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();

    page.on('dialog', async dialog => {
        console.log(`[DIALOG] ${dialog.type().toUpperCase()}: "${dialog.message()}"`);
        await dialog.accept();
    });

    const address = '8530 Susan Circle, Sandy, UT 84093';
    console.log(`Submitting Estimate #1 for: "${address}"`);

    try {
        // Use domcontentloaded to avoid hanging on external resources like Google Maps
        await page.goto(`${BASE_URL}/?bypass=Public&page=P-12`, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.waitForTimeout(2000);

        const addressInputSelector = 'input[placeholder="Enter address"]';
        await page.waitForSelector(addressInputSelector, { timeout: 30000 });
        await page.click(addressInputSelector);
        
        await page.type(addressInputSelector, address, { delay: 50 });
        await page.waitForTimeout(3000);

        await page.keyboard.press('ArrowDown');
        await page.waitForTimeout(500);
        await page.keyboard.press('Enter');

        const confirmBtnSelector = 'button:has-text("Confirm Address")';
        await page.waitForSelector(confirmBtnSelector, { timeout: 30000 });
        await page.click(confirmBtnSelector);

        const roofContinueBtn = 'button:has-text("Continue")';
        await page.waitForSelector(roofContinueBtn, { timeout: 30000 });
        await page.click(roofContinueBtn);

        const gutterSkipBtn = 'button:has-text("No, I\'ll consider it later.")';
        await page.waitForSelector(gutterSkipBtn, { timeout: 30000 });
        await page.click(gutterSkipBtn);

        const heatTraceSkipBtn = 'button:has-text("No thanks, I\'ll risk it.")';
        await page.waitForSelector(heatTraceSkipBtn, { timeout: 30000 });
        await page.click(heatTraceSkipBtn);

        const viewEstimateBtn = 'button:has-text("View & Share Estimate")';
        await page.waitForSelector(viewEstimateBtn, { timeout: 30000 });
        await page.click(viewEstimateBtn);

        const reportHeader = 'text=Instant Proposal';
        await page.waitForSelector(reportHeader, { timeout: 30000 });
        await page.waitForTimeout(2000);

        const screenshotPath = path.join(screenshotsDir, `estimate_1_Sandy_UT.png`);
        console.log(`Saving screenshot to ${screenshotPath}...`);
        await page.screenshot({ path: screenshotPath, fullPage: false });

        const requestQuoteBtn = 'button:has-text("Request Certified Quote")';
        await page.click(requestQuoteBtn);
        await page.waitForTimeout(1000);

        console.log(`Estimate #1 successfully completed!`);
    } catch (err) {
        console.error(`Error:`, err);
    } finally {
        await browser.close();
    }
}

run();
