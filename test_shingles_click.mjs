import { chromium } from 'playwright';
import path from 'path';

(async () => {
    console.log("Launching headless browser...");
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();

    const brainDir = 'C:\\Users\\USER\\.gemini\\antigravity\\brain\\6ac36afc-2dc8-48c6-bc73-3d59f0599a52';
    
    try {
        // --- TEST 1: VIEW DURATION SHINGLES ---
        console.log("\n--- TEST 1: VIEW DURATION SHINGLES ---");
        console.log("Navigating to V3...");
        await page.goto('http://localhost:3000/?page=P-00-V3');
        await page.waitForTimeout(2000);

        console.log("Dispatching v3-open-lightbox event for 'residential'...");
        await page.evaluate(() => {
            window.dispatchEvent(new CustomEvent('v3-open-lightbox', { detail: 'residential' }));
        });
        await page.waitForTimeout(1000);

        console.log("Locating 'View Duration Shingles' button...");
        const viewShinglesBtn = page.locator('button:has-text("View Duration Shingles")');
        await viewShinglesBtn.waitFor({ state: 'visible', timeout: 5000 });

        console.log("Clicking 'View Duration Shingles'...");
        await viewShinglesBtn.click();
        await page.waitForTimeout(2000);

        console.log("URL after click:", page.url());
        console.log("Capturing screen after clicking 'View Duration Shingles'...");
        await page.screenshot({ path: path.join(brainDir, 'v3_after_clicking_shingles.png') });

        // --- TEST 2: EXPLORE GUTTER SYSTEMS ---
        console.log("\n--- TEST 2: EXPLORE GUTTER SYSTEMS ---");
        console.log("Navigating back to V3...");
        await page.goto('http://localhost:3000/?page=P-00-V3');
        await page.waitForTimeout(2000);

        console.log("Dispatching v3-open-lightbox event for 'gutters'...");
        await page.evaluate(() => {
            window.dispatchEvent(new CustomEvent('v3-open-lightbox', { detail: 'gutters' }));
        });
        await page.waitForTimeout(1000);

        console.log("Locating 'Explore Gutter Systems' button...");
        const guttersBtn = page.locator('button:has-text("Explore Gutter Systems")');
        await guttersBtn.waitFor({ state: 'visible', timeout: 5000 });

        console.log("Clicking 'Explore Gutter Systems'...");
        await guttersBtn.click();
        await page.waitForTimeout(2000);

        console.log("URL after click:", page.url());
        console.log("Capturing screen after clicking 'Explore Gutter Systems'...");
        await page.screenshot({ path: path.join(brainDir, 'v3_after_clicking_gutters.png') });

        // --- TEST 3: EXPLORE ICE MANAGEMENT ---
        console.log("\n--- TEST 3: EXPLORE ICE MANAGEMENT ---");
        console.log("Navigating back to V3...");
        await page.goto('http://localhost:3000/?page=P-00-V3');
        await page.waitForTimeout(2000);

        console.log("Dispatching v3-open-lightbox event for 'icedefense'...");
        await page.evaluate(() => {
            window.dispatchEvent(new CustomEvent('v3-open-lightbox', { detail: 'icedefense' }));
        });
        await page.waitForTimeout(1000);

        console.log("Locating 'Explore Ice Management' button...");
        const iceBtn = page.locator('button:has-text("Explore Ice Management")');
        await iceBtn.waitFor({ state: 'visible', timeout: 5000 });

        console.log("Clicking 'Explore Ice Management'...");
        await iceBtn.click();
        await page.waitForTimeout(2000);

        console.log("URL after click:", page.url());
        console.log("Capturing screen after clicking 'Explore Ice Management'...");
        await page.screenshot({ path: path.join(brainDir, 'v3_after_clicking_ice.png') });

        console.log("\nAll tests finished!");
    } catch (err) {
        console.error("Test failed:", err);
    } finally {
        await browser.close();
    }
})();
