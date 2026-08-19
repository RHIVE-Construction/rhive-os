import { chromium } from 'playwright';

const artifactDir = "C:\\Users\\USER\\.gemini\\antigravity\\brain\\527ff627-4596-4872-b9ab-bcb2971d15db";

(async () => {
    let browser;
    try {
        console.log("Launching browser to debug Google Maps...");
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({ viewport: { width: 1440, height: 950 } });
        const page = await context.newPage();

        // Listen for console logs
        page.on('console', msg => {
            console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`);
        });

        // Listen for page errors
        page.on('pageerror', err => {
            console.log(`[BROWSER ERROR] ${err.toString()}`);
        });

        // Listen for failed requests
        page.on('requestfailed', request => {
            console.log(`[REQUEST FAILED] ${request.method()} ${request.url()}: ${request.failure()?.errorText || 'Failed'}`);
        });

        // Listen for responses to log statuses
        page.on('response', response => {
            if (response.status() >= 400) {
                console.log(`[RESPONSE ERROR] ${response.status()} ${response.url()}`);
            }
        });

        console.log("Navigating to http://localhost:3001/ ...");
        await page.goto('http://localhost:3001/', { waitUntil: 'load' });
        await page.waitForTimeout(3000);

        // Evaluate window status
        const windowStatus = await page.evaluate(() => {
            return {
                hasGoogle: typeof window.google !== 'undefined',
                hasMaps: typeof window.google?.maps !== 'undefined',
                hasPlaces: typeof window.google?.maps?.places !== 'undefined',
                googleMapsApiLoaded: window.googleMapsApiLoaded,
                googleMapsApiFailed: window.googleMapsApiFailed,
            };
        });
        console.log("Window API Status:", windowStatus);

        // Check if there are script tags with maps.googleapis.com
        const scriptTags = await page.evaluate(() => {
            const scripts = Array.from(document.querySelectorAll('script'));
            return scripts.map(s => s.src).filter(src => src.includes('maps.googleapis.com'));
        });
        console.log("Google Maps script tags in page:", scriptTags);

        console.log("Locating input field with placeholder ENTER PROJECT ADDRESS...");
        const input = page.locator('input[placeholder="ENTER PROJECT ADDRESS"]').first();
        await input.waitFor({ timeout: 5000 });

        console.log("Focusing input and typing '123' character-by-character...");
        await input.focus();
        await input.pressSequentially('123', { delay: 150 });
        await page.waitForTimeout(4000); // Wait for suggestions to fetch

        // Check if .pac-container exists in DOM
        const pacExists = await page.evaluate(() => {
            return document.querySelector('.pac-container') !== null;
        });
        console.log("Does .pac-container exist in DOM:", pacExists);

        // Check if .pac-container is visible
        const pacVisible = await page.evaluate(() => {
            const el = document.querySelector('.pac-container');
            return el ? (el.style.display !== 'none' && window.getComputedStyle(el).display !== 'none') : false;
        });
        console.log("Is .pac-container visible in CSS:", pacVisible);

        if (pacExists) {
            const pacContent = await page.evaluate(() => {
                const el = document.querySelector('.pac-container');
                return el ? el.innerHTML : '';
            });
            console.log("Content of .pac-container:", pacContent);
        }

        // Take a screenshot of the form
        await page.screenshot({ path: `${artifactDir}\\scratch\\google_maps_test.png` });
        console.log("Screenshot saved.");

    } catch (err) {
        console.error("Error running script:", err);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
})();
