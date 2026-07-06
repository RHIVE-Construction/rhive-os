import { chromium } from 'playwright';

async function run() {
    console.log("=== STARTING SCENARIO 1 PLAYWRIGHT DEBUG ===");
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
        await page.waitForTimeout(1000);

        console.log("--- Running Scenario 1 (Rick Vance) ---");
        await page.waitForSelector('#search-lookup-input');
        await page.fill('#search-lookup-input', '2085550192');
        await page.click('#btn-initiate-project');
        await page.waitForTimeout(500);

        const addrVal = await page.inputValue('input[id="property-address-input"]');
        console.log(`Address input value in form: "${addrVal}"`);
        await page.fill('input[id="property-address-input"]', '1398 West 12115 South');

        await page.fill('input:near(label:has-text("First Name"))', 'Rick');
        await page.fill('input:near(label:has-text("Last Name"))', 'Vance');
        await page.fill('input[placeholder="(000) 000-0000"]', '(208) 555-0192');
        await page.fill('input[type="email"]', 'rick.vance@gmail.com');
        await page.click('button:has-text("Save Contact")');
        await page.waitForTimeout(300);

        await page.click('button:has-text("Replacement")');
        await page.waitForTimeout(200);
        await page.click('text=Need A Ballpark Price');
        
        await page.evaluate(() => {
            const form = document.querySelector('form');
            if (form) {
                form.addEventListener('submit', (e) => {
                    console.log("[BROWSER DEBUG] Form submit event listener triggered!");
                });
                
                // Track HTML5 validation failures
                form.addEventListener('invalid', (e) => {
                    const target = e.target;
                    console.log("[BROWSER DEBUG] HTML5 Invalid Input Found:", {
                        tagName: target.tagName,
                        name: target.name,
                        id: target.id,
                        type: target.type,
                        value: target.value,
                        validationMessage: target.validationMessage
                    });
                }, true); // Use capture phase to catch bubbles from inputs
            } else {
                console.log("[BROWSER DEBUG] Form element not found!");
            }
            
            const btn = document.querySelector('button[type="submit"]');
            if (btn) {
                console.log("[BROWSER DEBUG] Submit button outerHTML:", btn.outerHTML);
                console.log("[BROWSER DEBUG] Submit button disabled attribute:", btn.disabled);
            } else {
                console.log("[BROWSER DEBUG] Submit button not found in DOM!");
            }
        });

        console.log("Submitting Scenario 1 form...");
        await page.click('button[type="submit"]');
        await page.waitForTimeout(1500);

        console.log("Checking DB properties in localStorage...");
        const dbProps = await page.evaluate(() => localStorage.getItem('rhive_db_properties'));
        console.log("rhive_db_properties after Scenario 1:", dbProps);

    } catch (e) {
        console.error("Test failed:", e);
    } finally {
        await browser.close();
        console.log("=== SCENARIO 1 PLAYWRIGHT DEBUG SEQUENCE COMPLETE ===");
    }
}

run();
