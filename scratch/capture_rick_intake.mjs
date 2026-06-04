import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'http://localhost:3000';
const screenshotsDir = 'C:\\Users\\mjrob\\.gemini\\antigravity\\brain\\a8707e63-7c28-4d28-8bd0-01caacf0c810\\test-proofs';

if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function run() {
    console.log("=== STARTING CAPTURING RICK INTAKE STEPS ===");
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1280, height: 950 } });
    const page = await context.newPage();

    page.on('console', msg => console.log(`[BROWSER CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`));
    page.on('pageerror', err => console.error(`[BROWSER ERROR]: ${err.message}`));

    // Clear state
    await page.goto(`${BASE_URL}/?bypass=Employee&page=E-01`);
    await page.evaluate(() => { window.localStorage.clear(); window.sessionStorage.clear(); });
    await page.goto(`${BASE_URL}/?bypass=Employee&page=E-01`);
    await page.waitForTimeout(1500);

    // ==========================================
    // 1. Rick Vance Name Lookup
    // ==========================================
    console.log("Step 1: Clicking New Project in sidebar...");
    await page.click('button:has-text("New Project")');
    await page.waitForTimeout(800);
    
    console.log("Typing Rick Vance name in lookup...");
    await page.locator('#search-lookup-input').fill('');
    await page.type('#search-lookup-input', 'Rick Vance', { delay: 100 });
    await page.waitForTimeout(800);
    await page.keyboard.press('Escape'); // dismiss maps autocomplete if any
    await page.waitForTimeout(200);

    await page.screenshot({ path: path.join(screenshotsDir, '01a_rick_name_lookup.png'), fullPage: false });
    console.log("Saved name lookup screenshot.");

    console.log("Pressing Tab key to autofill and close lookup...");
    await page.keyboard.press('Tab');
    await page.waitForTimeout(1000);

    await page.screenshot({ path: path.join(screenshotsDir, '01b_rick_name_autofilled.png'), fullPage: true });
    console.log("Saved name autofilled page screenshot.");

    // ==========================================
    // 2. Rick Vance Address Lookup
    // ==========================================
    console.log("Step 2: Going back to E-01 and searching address...");
    await page.goto(`${BASE_URL}/?bypass=Employee&page=E-01`);
    await page.waitForTimeout(1000);

    console.log("Clicking New Project...");
    await page.click('button:has-text("New Project")');
    await page.waitForTimeout(800);

    console.log("Typing Rick's address in lookup...");
    await page.locator('#search-lookup-input').fill('');
    await page.type('#search-lookup-input', '1398 West 12115 South', { delay: 100 });
    await page.waitForTimeout(800);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);

    await page.screenshot({ path: path.join(screenshotsDir, '02a_rick_address_lookup.png'), fullPage: false });
    console.log("Saved address lookup screenshot.");

    console.log("Pressing Tab key to autofill and close lookup...");
    await page.keyboard.press('Tab');
    await page.waitForTimeout(1200); // Wait for geocoding / verification modal

    await page.screenshot({ path: path.join(screenshotsDir, '02b_rick_address_autofilled.png'), fullPage: true });
    console.log("Saved address autofilled page screenshot.");

    // Dismiss verification modal for next test
    if (await page.locator('button:has-text("Confirm Target")').isVisible()) {
        await page.click('button:has-text("Start Over")');
        await page.waitForTimeout(500);
    }

    // ==========================================
    // 3. Rick Vance Phone Lookup
    // ==========================================
    console.log("Step 3: Going back to E-01 and searching phone...");
    await page.goto(`${BASE_URL}/?bypass=Employee&page=E-01`);
    await page.waitForTimeout(1000);

    console.log("Clicking New Project...");
    await page.click('button:has-text("New Project")');
    await page.waitForTimeout(800);

    console.log("Typing Rick's phone in lookup...");
    await page.locator('#search-lookup-input').fill('');
    await page.type('#search-lookup-input', '2085550192', { delay: 100 });
    await page.waitForTimeout(800);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);

    await page.screenshot({ path: path.join(screenshotsDir, '03a_rick_phone_lookup.png'), fullPage: false });
    console.log("Saved phone lookup screenshot.");

    console.log("Pressing Tab key to autofill and close lookup...");
    await page.keyboard.press('Tab');
    await page.waitForTimeout(1000);

    await page.screenshot({ path: path.join(screenshotsDir, '03b_rick_phone_autofilled.png'), fullPage: true });
    console.log("Saved phone autofilled page screenshot.");

    // ==========================================
    // 4. Widget-by-Widget Step Screenshots
    // ==========================================
    console.log("Step 4: Starting widget-by-widget click capturing flow...");
    
    // We are on page E-02a. Let's make sure Address, Name and Phone are entered.
    // Since we just tabbed from phone lookup, let's enter name and address explicitly
    console.log("Entering Address...");
    await page.locator('input[id="property-address-input"]').fill('');
    await page.type('input[id="property-address-input"]', '1398 West 12115 South', { delay: 50 });
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    // Save screenshot of geocoding verification modal
    await page.screenshot({ path: path.join(screenshotsDir, '04_widget_address_verification_modal.png'), fullPage: true });
    console.log("Saved verification modal screenshot.");

    console.log("Confirming address...");
    await page.click('button:has-text("Confirm Target")');
    await page.waitForTimeout(500);

    await page.screenshot({ path: path.join(screenshotsDir, '05_widget_address_confirmed.png'), fullPage: true });
    console.log("Saved address confirmed screenshot.");

    // Category check
    console.log("Clicking Commercial category first to show widget dynamics...");
    await page.click('button:has-text("Commercial")');
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(screenshotsDir, '06_widget_category_commercial.png'), fullPage: true });

    console.log("Switching back to Residential category...");
    await page.click('button:has-text("Residential")');
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(screenshotsDir, '07_widget_category_residential.png'), fullPage: true });

    // Contact form name autofill should already be there from phone lookup. Let's verify and fill name details:
    console.log("Pre-filling Contact name fields...");
    await page.locator('input[placeholder="Jane"]').fill('');
    await page.type('input[placeholder="Jane"]', 'Rick', { delay: 50 });
    await page.locator('input[placeholder="Doe"]').fill('');
    await page.type('input[placeholder="Doe"]', 'Vance', { delay: 50 });
    await page.locator('input[type="email"]').fill('');
    await page.type('input[type="email"]', 'rick.vance@gmail.com', { delay: 50 });
    await page.screenshot({ path: path.join(screenshotsDir, '08_widget_contact_typed.png'), fullPage: true });

    console.log("Saving contact...");
    await page.click('button:has-text("Save Contact")');
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(screenshotsDir, '09_widget_contact_saved.png'), fullPage: true });

    // Insurance Claims
    console.log("Clicking Insurance claim toggle...");
    await page.click('text=Is this an Insurance Claim?');
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(screenshotsDir, '10_widget_insurance_yes.png'), fullPage: true });

    console.log("Entering Insurance details...");
    await page.fill('input[placeholder="e.g. State Farm"]', 'State Farm');
    await page.fill('input[placeholder="Claim #"]', 'SF-940291-B');
    await page.screenshot({ path: path.join(screenshotsDir, '11_widget_insurance_details.png'), fullPage: true });

    // Damage type
    console.log("Clicking Hail damage...");
    await page.click('button:has-text("Hail")');
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(screenshotsDir, '12_widget_damage_hail.png'), fullPage: true });

    // Scope Selection
    console.log("Clicking Replacement scope...");
    await page.click('button:has-text("Replacement")');
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(screenshotsDir, '13_widget_scope_replacement.png'), fullPage: true });

    // Toggle Insurance claim off so that detailed scope and goals are shown
    console.log("Toggling Insurance claim off for detailed scope...");
    await page.click('text=Insurance Claim');
    await page.waitForTimeout(400);

    // Goal Selection (Ready)
    console.log("Clicking Ready goal (Ready to compare bids)...");
    await page.click('text=Ready to compare bids');
    await page.waitForTimeout(400);

    // Material preference
    console.log("Clicking Asphalt Shingles preference...");
    await page.click('button:has-text("Asphalt Shingles")');
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(screenshotsDir, '14_widget_material_asphalt.png'), fullPage: true });

    // Customer profile / investment style (must select while card is visible under Ready intent)
    console.log("Selecting Value Driven investment style...");
    await page.selectOption('select:has(option:has-text("Value Driven"))', 'Value Driven');
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(screenshotsDir, '16_widget_profile_value.png'), fullPage: true });

    // Timeline / Intent
    console.log("Clicking Exploring purchase intent (Just looking for ballpark)...");
    await page.click('text=Just looking for ballpark');
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(screenshotsDir, '15_widget_intent_exploring.png'), fullPage: true });

    // Submission
    console.log("Submitting intake form...");
    await page.click('button[type="submit"]');
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(screenshotsDir, '17_widget_success_modal.png'), fullPage: true });

    console.log("=== COMPLETED ALL SCREENSHOTS SUCCESSFULLY ===");
    await browser.close();
}

run().catch(err => {
    console.error("FAILED running screenshots script:", err);
    process.exit(1);
});
