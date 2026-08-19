import { chromium } from 'playwright';
import { spawn } from 'child_process';

const artifactDir = "C:\\Users\\USER\\.gemini\\antigravity\\brain\\994cea94-22ec-4648-bf49-c1bf89e34b12";

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
    let browser;
    try {
        console.log("Launching browser to check autocomplete...");
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({ viewport: { width: 1440, height: 950 } });
        const page = await context.newPage();

        console.log("Navigating to http://localhost:3000/ ...");
        await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
        await wait(2000);

        console.log("Locating search input...");
        const input = page.locator('input[placeholder*="ADDRESS"], input[type="text"]').first();
        await input.waitFor({ timeout: 5000 });
        
        console.log("Focusing and typing '123 William St' to trigger autocomplete dropdown...");
        await input.focus();
        await input.fill('123 William St');
        await wait(2000); // Wait for API response and dropdown render

        console.log("Checking if google maps autocomplete dropdown container (.pac-container) is visible...");
        const pacContainer = page.locator('.pac-container');
        const isVisible = await pacContainer.isVisible();
        
        if (isVisible) {
            console.log("SUCCESS: Google Places Autocomplete dropdown container is visible!");
            // Take screenshot showing input + dropdown
            await page.screenshot({ path: `${artifactDir}\\3_autocomplete_dropdown_preview.png` });
            console.log(`Saved 3_autocomplete_dropdown_preview.png`);
        } else {
            console.warn("WARNING: Autocomplete dropdown container is NOT visible. Checking if places API is loaded...");
            const isPlacesLoaded = await page.evaluate(() => typeof window.google?.maps?.places !== 'undefined');
            console.log("google.maps.places exists:", isPlacesLoaded);
            await page.screenshot({ path: `${artifactDir}\\3_autocomplete_failed_preview.png` });
        }
    } catch (err) {
        console.error("Error during autocomplete verification:", err);
    } finally {
        if (browser) {
            await browser.close();
        }
        console.log("Done verification.");
    }
})();
