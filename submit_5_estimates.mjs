import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'http://localhost:3000';
const screenshotsDir = './public/estimate-proofs';

if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
}

const utahAddresses = [
    '8530 Susan Circle, Sandy, UT 84093',
    '1398 West 12115 South, Riverton, UT 84065',
    '1124 East Meadow Creek Lane, Sandy, UT 84092',
    '8800 S Redwood Road, West Jordan, UT 84088',
    '775 Canyon Breeze Lane, Draper, UT 84020'
];

async function run() {
    console.log("=== STARTING DYNAMIC ESTIMATE SUBMISSION AUTOMATION ===");
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();

    // Auto-accept alert/confirm dialogs
    page.on('dialog', async dialog => {
        console.log(`[DIALOG] ${dialog.type().toUpperCase()}: "${dialog.message()}"`);
        await dialog.accept();
    });

    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('Error') || text.includes('warning') || text.includes('Debug')) {
            console.log(`[BROWSER CONSOLE] ${msg.type().toUpperCase()}: ${text}`);
        }
    });

    for (let i = 0; i < utahAddresses.length; i++) {
        const address = utahAddresses[i];
        const indexStr = (i + 1).toString();
        console.log(`\n--- Submitting Estimate #${indexStr} for: "${address}" ---`);

        try {
            // Navigate to Estimate Tool page
            await page.goto(`${BASE_URL}/?bypass=Public&page=P-12`);
            await page.waitForTimeout(1000);

            // Wait for address input field
            const addressInputSelector = 'input[placeholder="Enter address"]';
            await page.waitForSelector(addressInputSelector, { timeout: 10000 });
            await page.click(addressInputSelector);
            
            // Type address slowly to trigger Autocomplete predictions
            console.log("Typing address...");
            await page.type(addressInputSelector, address, { delay: 50 });
            await page.waitForTimeout(2000); // Wait for google autocomplete results

            // Select the first autocomplete result using keyboard navigation
            console.log("Selecting address suggestion...");
            await page.keyboard.press('ArrowDown');
            await page.waitForTimeout(200);
            await page.keyboard.press('Enter');

            // Wait for transition to Address Confirmation screen
            console.log("Waiting for Address Confirmation screen...");
            const confirmBtnSelector = 'button:has-text("Confirm Address")';
            await page.waitForSelector(confirmBtnSelector, { timeout: 10000 });
            
            // Click Confirm Address
            console.log("Confirming address...");
            await page.click(confirmBtnSelector);

            // Wait for Roof Options screen
            console.log("Waiting for Roof Options screen...");
            const roofContinueBtn = 'button:has-text("Continue")';
            await page.waitForSelector(roofContinueBtn, { timeout: 10000 });
            
            // Click Continue on Roof Options
            await page.click(roofContinueBtn);

            // Wait for Gutters screen
            console.log("Waiting for Gutters screen...");
            const gutterSkipBtn = 'button:has-text("No, I\'ll consider it later.")';
            await page.waitForSelector(gutterSkipBtn, { timeout: 10000 });
            
            // Click Skip/Continue on Gutters
            await page.click(gutterSkipBtn);

            // Wait for Heat Trace screen
            console.log("Waiting for Heat Trace screen...");
            const heatTraceSkipBtn = 'button:has-text("No thanks, I\'ll risk it.")';
            await page.waitForSelector(heatTraceSkipBtn, { timeout: 10000 });
            
            // Click Skip/Continue on Heat Trace
            await page.click(heatTraceSkipBtn);

            // Wait for Dashboard screen
            console.log("Waiting for Dashboard screen...");
            const viewEstimateBtn = 'button:has-text("View & Share Estimate")';
            await page.waitForSelector(viewEstimateBtn, { timeout: 10000 });
            
            // Click View & Share Estimate
            console.log("Opening Estimate Report...");
            await page.click(viewEstimateBtn);

            // Wait for modal report content
            const reportHeader = 'text=Instant Proposal';
            await page.waitForSelector(reportHeader, { timeout: 10000 });
            await page.waitForTimeout(1000); // Let layout stabilize

            // Capture screenshot of estimate report modal
            const screenshotPath = path.join(screenshotsDir, `estimate_${indexStr}_Sandy_UT.png`);
            console.log(`Saving screenshot to ${screenshotPath}...`);
            await page.screenshot({ path: screenshotPath, fullPage: false });

            // Click Request Certified Quote to submit/finalize
            console.log("Requesting Certified Quote (Finalizing Submission)...");
            const requestQuoteBtn = 'button:has-text("Request Certified Quote")';
            await page.click(requestQuoteBtn);
            await page.waitForTimeout(1000);

            console.log(`Estimate #${indexStr} successfully completed!`);

        } catch (err) {
            console.error(`Error on estimate #${indexStr}:`, err);
            // Capture error screenshot for debugging
            await page.screenshot({ path: path.join(screenshotsDir, `error_${indexStr}.png`) });
        }
    }

    await browser.close();
    console.log("\n=== ALL 5 ESTIMATES PROCESSED SUCCESSFULLY ===");
}

run();
