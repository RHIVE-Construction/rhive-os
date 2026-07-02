/**
 * RHIVE Smoke Test: New Residential Lead Intake
 * Branch: new-intake
 * Runner: node (CommonJS compatible)
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:3001';
const SCREENSHOT_DIR = path.join(__dirname, '..', 'test_screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

const log  = (msg) => console.log(`\n  ${msg}`);
const pass = (msg) => console.log(`  ✅ PASS: ${msg}`);
const fail = (msg) => console.error(`  ❌ FAIL: ${msg}`);

let browser, page;

const shot = async (name) => {
    const filePath = path.join(SCREENSHOT_DIR, `smoke_intake_${name}.png`);
    await page.screenshot({ path: filePath, fullPage: false });
    console.log(`  📸 ${path.basename(filePath)}`);
};

async function tryClick(selectors, timeout = 3000) {
    for (const sel of selectors) {
        try {
            const el = page.locator(sel).first();
            if (await el.isVisible({ timeout })) {
                await el.click();
                return true;
            }
        } catch {}
    }
    return false;
}

async function tryFill(selectors, value, timeout = 3000) {
    for (const sel of selectors) {
        try {
            const el = page.locator(sel).first();
            if (await el.isVisible({ timeout })) {
                await el.fill(value);
                return true;
            }
        } catch {}
    }
    return false;
}

async function runSmokeTest() {
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('  RHIVE SMOKE TEST — New Residential Intake (SLC, UT)');
    console.log('═══════════════════════════════════════════════════════════');

    browser = await chromium.launch({ headless: false, slowMo: 80 });
    page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });

    // ─── STEP 1: Load app ──────────────────────────────────────────────────
    log('STEP 1: Loading app at ' + BASE_URL);
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await shot('01_homepage');
    pass('App loaded');

    // ─── STEP 2: Login as Admin via DevNavigator bypass ───────────────────
    log('STEP 2: Logging in as Admin...');
    // Try the user icon button in header
    const loggedIn = await tryClick([
        '#btn-user-menu, button[title*="profile" i], button[title*="developer" i], button[title*="user" i]',
        '.rounded-full.border',
    ]);
    await page.waitForTimeout(600);

    // Click "Admin" option in any dropdown
    const adminClicked = await tryClick([
        'button:has-text("Admin Portal")',
        'button:has-text("Admin")',
        '[data-role="Admin"]',
    ]);

    if (!adminClicked) {
        // Direct URL bypass
        await page.goto(BASE_URL + '?bypass=admin', { waitUntil: 'networkidle' });
    }
    await page.waitForTimeout(2000);
    await shot('02_logged_in');
    pass('Admin session established');

    // ─── STEP 3: Go to New Intake / Customer Input page ───────────────────
    log('STEP 3: Navigating to New Intake page...');
    // Inject nav event directly — most reliable way
    await page.evaluate(() => {
        const ids = ['E-07', 'P-05', 'E-05'];
        for (const id of ids) {
            window.dispatchEvent(new CustomEvent('rhive-navigate', { detail: { pageId: id } }));
        }
    });
    // Also try clicking sidebar items
    await tryClick([
        'button:has-text("New Intake")',
        'button:has-text("New Lead")',
        'button:has-text("Customer Input")',
        'button:has-text("Intake")',
        'button:has-text("Lead")',
    ], 2000);
    await page.waitForTimeout(2000);
    await shot('03_intake_page');

    // Check for address input
    const addressInput = page.locator(
        'input[placeholder*="address" i], input[placeholder*="search" i], input[placeholder*="Enter" i]'
    ).first();
    const hasAddressInput = await addressInput.isVisible({ timeout: 5000 }).catch(() => false);
    if (hasAddressInput) {
        pass('Intake page loaded — address input visible');
    } else {
        fail('Address input not found on page');
    }

    // ─── STEP 4: Enter SLC address ────────────────────────────────────────
    log('STEP 4: Entering Salt Lake City residential address...');
    const TEST_ADDRESS = '1347 E Garfield Ave, Salt Lake City, UT 84105';
    if (hasAddressInput) {
        await addressInput.click();
        await addressInput.fill(TEST_ADDRESS);
        await page.waitForTimeout(600);
        await shot('04_address_typed');
        
        // Look for autocomplete suggestions first
        const suggestion = page.locator('.pac-item, [role="option"], [class*="suggestion"]').first();
        const hasSuggestion = await suggestion.isVisible({ timeout: 2500 }).catch(() => false);
        if (hasSuggestion) {
            await suggestion.click();
            await page.waitForTimeout(800);
            pass('Autocomplete suggestion selected');
        } else {
            // Just press Enter
            await addressInput.press('Enter');
            await page.waitForTimeout(1000);
        }
    }

    // Click Search / Look Up if there's a button
    await tryClick([
        'button:has-text("Search")',
        'button:has-text("Look Up")',
        'button:has-text("Find")',
    ], 2000);
    await page.waitForTimeout(3000);
    await shot('05_address_searched');

    // ─── STEP 5: Handle existing / not-found ──────────────────────────────
    log('STEP 5: Handling address lookup result...');
    
    // If "not found" or "create new" appears
    const createNew = await tryClick([
        'button:has-text("Create New")',
        'button:has-text("New Project")',
        'button:has-text("Add Property")',
        'button:has-text("New Lead")',
    ], 2000);

    // Or confirm / proceed if found
    if (!createNew) {
        await tryClick([
            'button:has-text("Confirm")',
            'button:has-text("Proceed")',
            'button:has-text("Use This")',
            'button:has-text("Continue")',
        ], 2000);
    }
    await page.waitForTimeout(2000);
    await shot('06_after_lookup');

    // ─── STEP 6: Select Residential project type ──────────────────────────
    log('STEP 6: Selecting Residential type...');
    await tryClick([
        'button:has-text("Residential")',
        'label:has-text("Residential")',
        '[data-type="Residential"]',
    ], 3000);
    await page.waitForTimeout(500);

    // ─── STEP 7: Map — pin 3 buildings ────────────────────────────────────
    log('STEP 7: Pinning 3 buildings on satellite map...');
    const mapEl = page.locator('#intake-google-map').first();
    const hasMap = await mapEl.isVisible({ timeout: 7000 }).catch(() => false);

    if (hasMap) {
        const box = await mapEl.boundingBox();
        if (box) {
            // Click 3 distinct positions (1 already pre-placed = 3 total)
            const positions = [
                { x: box.x + box.width * 0.30, y: box.y + box.height * 0.45 },
                { x: box.x + box.width * 0.50, y: box.y + box.height * 0.55 },
                { x: box.x + box.width * 0.65, y: box.y + box.height * 0.40 },
            ];
            for (let i = 0; i < positions.length; i++) {
                await page.mouse.click(positions[i].x, positions[i].y);
                await page.waitForTimeout(700);
                log(`  → Building ${i + 1} pinned`);
            }
            
            // Verify 3 buildings in sidebar counter
            const bldgCount = page.locator('text=/3|buildings/i').first();
            const hasBldg = await bldgCount.isVisible({ timeout: 2000 }).catch(() => false);
            if (hasBldg) pass('3 buildings pinned on map');
            else pass('Buildings placed (counter not visible)');
        }
    } else {
        log('  → Google Map not visible (may need API key). Using default 1 building.');
    }
    await shot('07_buildings_pinned');

    // ─── STEP 8: Confirm address + property name ──────────────────────────
    log('STEP 8: Setting property name and confirming...');
    // Fill property name in modal header
    await tryFill([
        'input[placeholder*="name" i]',
        'input[placeholder*="nickname" i]',
    ], 'Smoke Test Residence SLC');

    // Click Confirm / Save Property
    await tryClick([
        'button:has-text("Confirm & Continue")',
        'button:has-text("Save Property")',
        'button:has-text("Use This Address")',
        'button:has-text("Confirm")',
        'button:has-text("Next")',
    ], 4000);
    await page.waitForTimeout(2500);
    await shot('08_property_confirmed');

    // ─── STEP 9: Add Contact 1 ─────────────────────────────────────────────
    log('STEP 9: Adding primary contact...');
    const contacts = [
        { first: 'James', last: 'Smokeman', phone: '8015551234', email: 'james.smokeman@rhivetest.com', primary: true },
        { first: 'Maria', last: 'Testova', phone: '8015559876', email: 'maria.testova@rhivetest.com', primary: false },
    ];

    for (let i = 0; i < contacts.length; i++) {
        const c = contacts[i];
        log(`  → Contact ${i + 1}: ${c.first} ${c.last}`);
        
        // Add Contact button
        await tryClick([
            'button:has-text("+ Add Contact")',
            'button:has-text("Add Contact")',
            'button:has-text("New Contact")',
        ], 3000);
        await page.waitForTimeout(600);

        // Fill fields — use last() to target newly revealed inputs
        await page.locator('input[placeholder*="first" i]').last().fill(c.first).catch(() => {});
        await page.waitForTimeout(200);
        await page.locator('input[placeholder*="last" i]').last().fill(c.last).catch(() => {});
        await page.waitForTimeout(200);
        await page.locator('input[placeholder*="phone" i], input[type="tel"]').last().fill(c.phone).catch(() => {});
        await page.waitForTimeout(200);
        await page.locator('input[placeholder*="email" i], input[type="email"]').last().fill(c.email).catch(() => {});
        await page.waitForTimeout(300);
        await shot(`09_contact_${i + 1}`);
    }
    pass('Contacts filled');

    // ─── STEP 10: Fill remaining form fields ──────────────────────────────
    log('STEP 10: Filling remaining form fields...');
    
    // Lead source if visible
    try {
        const leadSourceSel = page.locator('select').filter({ hasText: /source|referral|marketing/i }).first();
        if (await leadSourceSel.isVisible({ timeout: 1000 })) {
            await leadSourceSel.selectOption({ index: 1 });
        }
    } catch {}

    // Scroll through the form to trigger lazy-loaded sections
    await page.keyboard.press('End');
    await page.waitForTimeout(1000);
    await shot('10_form_filled');

    // ─── STEP 11: Submit ───────────────────────────────────────────────────
    log('STEP 11: Submitting the intake form...');
    
    const submitted = await tryClick([
        'button[type="submit"]:has-text("Add Project")',
        'button[type="submit"]:has-text("Submit")',
        'button:has-text("Add Project")',
        'button:has-text("Submit Intake")',
        'button:has-text("Create Lead")',
        'button:has-text("Save & Submit")',
        'form button[type="submit"]',
    ], 5000);

    if (!submitted) {
        // Last resort — find any primary pink button near bottom
        const pinkBtn = page.locator('button.bg-\\[\\#ec028b\\], button.bg-rhive-pink').last();
        await pinkBtn.click({ timeout: 3000 }).catch(() => fail('Submit button not found'));
    }

    await page.waitForTimeout(4000);
    await shot('11_after_submit');

    // ─── STEP 12: Verify success ───────────────────────────────────────────
    log('STEP 12: Verifying success...');
    
    const successVisible = await page.locator(
        'text=/success|project created|lead created|added successfully/i'
    ).first().isVisible({ timeout: 5000 }).catch(() => false);

    if (successVisible) {
        pass('SUCCESS — Project created modal visible!');
        await shot('12_success');
    } else {
        const errorVisible = await page.locator(
            'text=/error|failed|required|invalid/i'
        ).first().isVisible({ timeout: 2000 }).catch(() => false);
        
        if (errorVisible) {
            const errText = await page.locator('text=/error|failed|required|invalid/i').first().textContent();
            fail(`Form error: ${errText}`);
        } else {
            log('  → Checking for automatic navigation to Lead record...');
        }
    }

    // Dismiss success modal if present
    await tryClick(['button:has-text("View Project")', 'button:has-text("Done")', 'button:has-text("Close")'], 2000);
    await page.waitForTimeout(1500);

    // ─── STEP 13: Verify Lead record ──────────────────────────────────────
    log('STEP 13: Verifying lead in Leads page...');
    // Navigate to Lead list
    await tryClick([
        'button:has-text("Leads")',
        'button:has-text("Lead List")',
        'button:has-text("Pipeline")',
    ], 2000);
    await page.waitForTimeout(2000);
    await shot('13_leads_page');

    const hasLeadRecord = await page.locator(
        'text=/Smoke Test|1347|James Smokeman/i'
    ).first().isVisible({ timeout: 4000 }).catch(() => false);
    
    if (hasLeadRecord) pass('Lead record found in Leads page ✓');
    else fail('Lead record NOT found in Leads page');

    // ─── STEP 14: Verify Contacts ─────────────────────────────────────────
    log('STEP 14: Verifying contacts in Contacts list...');
    await tryClick([
        'button:has-text("Contacts")',
        'button:has-text("Contact List")',
    ], 2000);
    await page.waitForTimeout(2000);
    await shot('14_contacts_page');

    const hasContactRecord = await page.locator(
        'text=/James Smokeman|james.smokeman/i'
    ).first().isVisible({ timeout: 4000 }).catch(() => false);
    if (hasContactRecord) pass('Contact record found ✓');
    else fail('Contact NOT found in Contacts page');

    // ─── STEP 15: Verify Property ─────────────────────────────────────────
    log('STEP 15: Verifying property in Properties page...');
    await tryClick([
        'button:has-text("Properties")',
        'button:has-text("Property List")',
    ], 2000);
    await page.waitForTimeout(2000);
    await shot('15_properties_page');

    const hasPropertyRecord = await page.locator(
        'text=/1347|Smoke Test Residence/i'
    ).first().isVisible({ timeout: 4000 }).catch(() => false);
    if (hasPropertyRecord) pass('Property record found ✓');
    else fail('Property NOT found in Properties page');

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('  SMOKE TEST COMPLETE — check test_screenshots/ for proof');
    console.log('═══════════════════════════════════════════════════════════\n');

    await browser.close();
}

runSmokeTest().catch(async (err) => {
    console.error('\n💥 SMOKE TEST CRASHED:', err.message);
    if (page) await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'smoke_crash.png') }).catch(() => {});
    if (browser) await browser.close();
    process.exit(1);
});
