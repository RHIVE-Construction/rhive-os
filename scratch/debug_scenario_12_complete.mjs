import { chromium } from 'playwright';

async function run() {
    console.log("=== STARTING FULL SCENARIO 12 PLAYWRIGHT RUN ===");
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();

    page.on('console', msg => console.log(`[BROWSER] ${msg.type().toUpperCase()}: ${msg.text()}`));
    page.on('pageerror', err => console.error(`[BROWSER ERROR] ${err.message}`));

    try {
        const BASE_URL = 'http://localhost:3000';
        
        // Load page
        await page.goto(`${BASE_URL}/?bypass=Employee&page=E-02a`);
        await page.waitForTimeout(1000);
        
        // Clear local storage for clean start
        await page.evaluate(() => window.localStorage.clear());
        await page.goto(`${BASE_URL}/?bypass=Employee&page=E-02a`);
        await page.waitForTimeout(1500);

        console.log("--- Step 1: Create Linda Hansen Property ---");
        // Dismiss lookup modal to access the page directly
        await page.waitForSelector('#search-lookup-input');
        await page.fill('#search-lookup-input', '1290 East Appledale Rd');
        await page.click('#btn-initiate-project');
        await page.waitForTimeout(800);

        // Form should now have address filled or we fill it manually
        const addrVal = await page.inputValue('input[id="property-address-input"]');
        console.log(`Address input value in form: "${addrVal}"`);
        if (!addrVal) {
            await page.fill('input[id="property-address-input"]', '1290 East Appledale Rd');
        }

        await page.fill('input:near(label:has-text("First Name"))', 'Linda');
        await page.fill('input:near(label:has-text("Last Name"))', 'Hansen');
        await page.fill('input[placeholder="(000) 000-0000"]', '555-2222');
        await page.fill('input[type="email"]', 'linda.hansen@gmail.com');
        await page.click('button:has-text("Save Contact")');
        await page.waitForTimeout(300);

        await page.click('button:has-text("Replacement")');
        await page.waitForTimeout(200);
        await page.click('text=Need A Ballpark Price');
        
        console.log("Submitting Step 1 form...");
        await page.click('button[type="submit"]');
        await page.waitForTimeout(1500);

        console.log("--- Step 2: Trigger Tyler Hansen Lookup Collision ---");
        // Reload page to start fresh lookup
        await page.goto(`${BASE_URL}/?bypass=Employee&page=E-02a`);
        await page.waitForTimeout(1500);

        console.log("Looking up address again in global search...");
        await page.waitForSelector('#search-lookup-input');
        await page.fill('#search-lookup-input', '1290 East Appledale Rd');
        await page.waitForTimeout(1000);

        const bannerVisible = await page.isVisible('#search-collision-banner');
        console.log(`Is collision banner visible? ${bannerVisible}`);
        if (bannerVisible) {
            const bannerText = await page.textContent('#search-collision-banner');
            console.log(`Banner Text: "${bannerText}"`);
        } else {
            console.log("Banner is not visible! Printing modal container HTML...");
            const modalHtml = await page.evaluate(() => {
                const modal = document.querySelector('#search-lookup-input')?.closest('div');
                return modal ? modal.parentElement?.innerHTML : 'Modal not found';
            });
            console.log(modalHtml);
        }

    } catch (e) {
        console.error("Test failed:", e);
    } finally {
        await browser.close();
        console.log("=== FULL SCENARIO 12 PLAYWRIGHT RUN COMPLETE ===");
    }
}

run();
