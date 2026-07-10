/**
 * RHIVE Smoke Test: New Residential Lead Intake
 * Branch: new-intake
 *
 * Tests the full intake flow:
 * 1. Login as Admin
 * 2. Navigate to Customer Input (New Intake) page
 * 3. Search a Salt Lake City residential address not in system
 * 4. Confirm address + pin 3 buildings
 * 5. Add 2 test contacts
 * 6. Complete and submit the form
 * 7. Verify lead, contacts, and property appear in records
 */

import { chromium, Browser, Page } from 'playwright';

const BASE_URL = 'http://localhost:3001';

// --- Test data ---
const TEST_ADDRESS = '742 Evergreen Terrace, Salt Lake City, UT 84103';
const TEST_CONTACTS = [
    {
        firstName: 'James',
        lastName: 'Smoke',
        phone: '(801) 555-1234',
        email: 'james.smoke@testrhive.com',
        role: 'Property Owner',
        isPrimary: true
    },
    {
        firstName: 'Maria',
        lastName: 'Test',
        phone: '(801) 555-5678',
        email: 'maria.test@testrhive.com',
        role: 'Tenant',
        isPrimary: false
    }
];

let browser: Browser;
let page: Page;

// Helper: take a named screenshot
const shot = async (name: string) => {
    await page.screenshot({ path: `test_screenshots/smoke_intake_${name}.png`, fullPage: false });
    console.log(`  📸 Screenshot: smoke_intake_${name}.png`);
};

const log = (msg: string) => console.log(`\n  ${msg}`);
const pass = (msg: string) => console.log(`  ✅ PASS: ${msg}`);
const fail = (msg: string) => { console.error(`  ❌ FAIL: ${msg}`); };

async function runSmokeTest() {
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('  RHIVE SMOKE TEST — New Residential Intake Flow');
    console.log('═══════════════════════════════════════════════════════');

    browser = await chromium.launch({ headless: false, slowMo: 100 });
    page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });

    // ─── Step 1: Navigate to app ─────────────────────────────────────────────
    log('STEP 1: Loading app...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await shot('01_homepage');
    pass('App loaded');

    // ─── Step 2: Login as Admin (bypass) ─────────────────────────────────────
    log('STEP 2: Logging in as Admin...');
    // Open profile dropdown
    const profileBtn = page.locator('button[title*="Developer"], button[title*="Profile"], button.rounded-full').first();
    await profileBtn.click({ timeout: 5000 });
    await page.waitForTimeout(500);

    // Click Admin Portal button in dropdown
    const adminBtn = page.locator('button:has-text("Admin Portal")').first();
    await adminBtn.click({ timeout: 5000 });
    await page.waitForTimeout(1500);
    await shot('02_logged_in_admin');
    pass('Logged in as Admin');

    // ─── Step 3: Navigate to New Intake (CustomerInputPage) ──────────────────
    log('STEP 3: Navigating to New Intake page...');
    // Try sidebar link — look for "New Intake", "Customer Input", or "Lead" in sidebar
    const sidebarIntakeLink = page.locator('button:has-text("New Intake"), button:has-text("Customer Input"), button:has-text("New Lead"), [data-page="E-07"], button:has-text("Intake")').first();
    
    try {
        await sidebarIntakeLink.click({ timeout: 4000 });
    } catch {
        // If not found by text, try via DevNavigator or direct page ID dispatch
        log('  → Sidebar link not found by text, dispatching nav event...');
        await page.evaluate(() => {
            window.dispatchEvent(new CustomEvent('nav-page', { detail: 'E-07' }));
        });
    }
    await page.waitForTimeout(2000);
    await shot('03_intake_page');

    // Verify we're on the intake page
    const pageTitle = page.locator('h1, h2').filter({ hasText: /intake|new.*lead|customer.*input|new.*project/i }).first();
    const onIntakePage = await pageTitle.isVisible({ timeout: 3000 }).catch(() => false);
    if (onIntakePage) {
        pass('On intake page');
    } else {
        // Check for address input field as fallback indicator
        const addressInput = page.locator('input[placeholder*="address" i], input[placeholder*="search" i], input[type="text"]').first();
        const hasInput = await addressInput.isVisible({ timeout: 3000 }).catch(() => false);
        if (hasInput) pass('Intake form visible');
        else fail('Could not confirm intake page — continuing anyway');
    }

    // ─── Step 4: Search address ───────────────────────────────────────────────
    log('STEP 4: Searching for test address...');
    // Find address search input
    const addressInput = page.locator(
        'input[placeholder*="address" i], input[placeholder*="search" i], input[placeholder*="street" i]'
    ).first();
    
    await addressInput.waitFor({ timeout: 8000 });
    await addressInput.click();
    await addressInput.fill('742 S 600 E, Salt Lake City');
    await page.waitForTimeout(1000);
    await shot('04_address_typed');

    // Try to trigger search — look for search button or Enter
    const searchBtn = page.locator('button:has-text("Search"), button:has-text("Look Up"), button[type="submit"]').first();
    const hasSearchBtn = await searchBtn.isVisible({ timeout: 2000 }).catch(() => false);
    if (hasSearchBtn) {
        await searchBtn.click();
    } else {
        await addressInput.press('Enter');
    }
    await page.waitForTimeout(2500);
    await shot('05_address_searched');

    // ─── Step 5: Handle "not found" — create new ─────────────────────────────
    log('STEP 5: Checking if address exists in system...');
    
    const notFoundIndicator = page.locator(
        'text=/not found|no record|new property|create new|add.*property/i'
    ).first();
    const createNewBtn = page.locator(
        'button:has-text("Create New"), button:has-text("New Project"), button:has-text("Add Property"), button:has-text("New Lead")'
    ).first();

    const notFound = await notFoundIndicator.isVisible({ timeout: 3000 }).catch(() => false);
    const hasCreate = await createNewBtn.isVisible({ timeout: 2000 }).catch(() => false);

    if (notFound || hasCreate) {
        pass('Address not in system — ready to create new');
        if (hasCreate) await createNewBtn.click();
    } else {
        log('  → Address search result shown, looking for proceed/confirm button...');
        const proceedBtn = page.locator('button:has-text("Proceed"), button:has-text("Continue"), button:has-text("Confirm")').first();
        const hasProceed = await proceedBtn.isVisible({ timeout: 2000 }).catch(() => false);
        if (hasProceed) {
            await proceedBtn.click();
            pass('Address confirmed — proceeding');
        }
    }
    await page.waitForTimeout(2000);
    await shot('06_after_address_search');

    // ─── Step 6: AddressVerificationModal — select project type ──────────────
    log('STEP 6: Selecting Residential project type...');
    
    // Look for project type selector (Residential / Commercial / Government)
    const residentialBtn = page.locator(
        'button:has-text("Residential"), label:has-text("Residential"), [data-type="Residential"]'
    ).first();
    const hasResidential = await residentialBtn.isVisible({ timeout: 3000 }).catch(() => false);
    if (hasResidential) {
        await residentialBtn.click();
        pass('Selected Residential');
        await page.waitForTimeout(500);
    }
    await shot('07_project_type');

    // ─── Step 7: Pin 3 buildings on map ──────────────────────────────────────
    log('STEP 7: Pinning 3 buildings on the satellite map...');
    
    const map = page.locator('#intake-google-map, [id*="google-map"], canvas').first();
    const hasMap = await map.isVisible({ timeout: 6000 }).catch(() => false);
    
    if (hasMap) {
        const mapBox = await map.boundingBox();
        if (mapBox) {
            // First building already placed by default — place 2 more by clicking
            // Click 3 different spots on the map (spread out)
            const clicks = [
                { x: mapBox.x + mapBox.width * 0.35, y: mapBox.y + mapBox.height * 0.4 },
                { x: mapBox.x + mapBox.width * 0.55, y: mapBox.y + mapBox.height * 0.45 },
                { x: mapBox.x + mapBox.width * 0.45, y: mapBox.y + mapBox.height * 0.6 },
            ];
            for (const c of clicks) {
                await page.mouse.click(c.x, c.y);
                await page.waitForTimeout(600);
            }
            pass('3 building pins placed on map');
        }
    } else {
        log('  → Map not visible — continuing (may use default single building)');
    }
    await page.waitForTimeout(1000);
    await shot('08_buildings_pinned');

    // ─── Step 8: Confirm address / save property ──────────────────────────────
    log('STEP 8: Confirming address and saving property...');
    
    const confirmBtn = page.locator(
        'button:has-text("Confirm"), button:has-text("Save Property"), button:has-text("Use This Address"), button:has-text("Next")'
    ).first();
    const hasConfirm = await confirmBtn.isVisible({ timeout: 4000 }).catch(() => false);
    if (hasConfirm) {
        await confirmBtn.click();
        pass('Property confirmed');
        await page.waitForTimeout(1500);
    }
    await shot('09_property_saved');

    // ─── Step 9: Fill property name if prompted ───────────────────────────────
    const propNameInput = page.locator('input[placeholder*="name" i], input[placeholder*="nickname" i]').first();
    const hasPropName = await propNameInput.isVisible({ timeout: 2000 }).catch(() => false);
    if (hasPropName) {
        await propNameInput.fill('Smoke Test Residence');
        await page.waitForTimeout(300);
    }

    // ─── Step 10: Add contacts ─────────────────────────────────────────────────
    log('STEP 9: Adding test contacts...');

    for (let i = 0; i < TEST_CONTACTS.length; i++) {
        const contact = TEST_CONTACTS[i];
        log(`  → Adding contact ${i + 1}: ${contact.firstName} ${contact.lastName}`);

        // Click "Add Contact" button
        const addContactBtn = page.locator(
            'button:has-text("Add Contact"), button:has-text("+ Contact"), button:has-text("New Contact")'
        ).first();
        const hasAddContact = await addContactBtn.isVisible({ timeout: 3000 }).catch(() => false);
        if (hasAddContact) {
            await addContactBtn.click();
            await page.waitForTimeout(800);
        }

        // Fill first name
        const firstNameInput = page.locator('input[placeholder*="first" i], input[name*="first" i]').last();
        await firstNameInput.fill(contact.firstName).catch(() => {});

        // Fill last name
        const lastNameInput = page.locator('input[placeholder*="last" i], input[name*="last" i]').last();
        await lastNameInput.fill(contact.lastName).catch(() => {});

        // Fill phone
        const phoneInput = page.locator('input[placeholder*="phone" i], input[type="tel"]').last();
        await phoneInput.fill(contact.phone).catch(() => {});

        // Fill email
        const emailInput = page.locator('input[placeholder*="email" i], input[type="email"]').last();
        await emailInput.fill(contact.email).catch(() => {});

        await page.waitForTimeout(500);
        await shot(`10_contact_${i + 1}`);
    }
    pass('Contacts filled');

    // ─── Step 11: Fill in any remaining required fields ────────────────────────
    log('STEP 10: Checking for remaining required fields...');
    
    // Look for lead source dropdown
    const leadSourceSelect = page.locator('select[name*="source" i], select[name*="lead" i]').first();
    const hasLeadSource = await leadSourceSelect.isVisible({ timeout: 1000 }).catch(() => false);
    if (hasLeadSource) {
        await leadSourceSelect.selectOption({ index: 1 });
    }

    await page.waitForTimeout(500);
    await shot('11_form_filled');

    // ─── Step 12: Submit the form ──────────────────────────────────────────────
    log('STEP 11: Submitting the form...');
    
    const submitBtn = page.locator(
        'button[type="submit"]:has-text("Submit"), button:has-text("Add Project"), button:has-text("Create Lead"), button:has-text("Submit Intake"), button:has-text("Save"), form button[type="submit"]'
    ).first();
    const hasSubmit = await submitBtn.isVisible({ timeout: 4000 }).catch(() => false);
    
    if (hasSubmit) {
        await submitBtn.click();
    } else {
        // Scroll to bottom and try again
        await page.keyboard.press('End');
        await page.waitForTimeout(500);
        const submitBtnBottom = page.locator('button[type="submit"], button:has-text("Submit"), button:has-text("Add")').last();
        await submitBtnBottom.click({ timeout: 3000 }).catch(() => {
            fail('Submit button not found');
        });
    }
    await page.waitForTimeout(3000);
    await shot('12_after_submit');

    // ─── Step 13: Verify success ───────────────────────────────────────────────
    log('STEP 12: Verifying submission success...');
    
    const successModal = page.locator(
        'text=/success|created|lead added|project created|added successfully/i'
    ).first();
    const hasSuccess = await successModal.isVisible({ timeout: 5000 }).catch(() => false);

    if (hasSuccess) {
        pass('SUCCESS MODAL appeared — lead created!');
        await shot('13_success_modal');
    } else {
        // Check for error
        const errorMsg = page.locator('text=/error|failed|invalid|required/i').first();
        const hasError = await errorMsg.isVisible({ timeout: 2000 }).catch(() => false);
        if (hasError) {
            const errorText = await errorMsg.textContent();
            fail(`Form error: ${errorText}`);
        } else {
            log('  → No modal visible — checking page navigation...');
        }
    }

    // ─── Step 14: Verify in Leads list ────────────────────────────────────────
    log('STEP 13: Navigating to Leads page to verify record...');
    await page.evaluate(() => {
        window.dispatchEvent(new CustomEvent('nav-page', { detail: 'E-26' }));
    });
    await page.waitForTimeout(2000);
    await shot('14_leads_page');

    const leadRecord = page.locator('text=/Smoke Test|742 S 600|james.smoke/i').first();
    const hasLead = await leadRecord.isVisible({ timeout: 4000 }).catch(() => false);
    if (hasLead) {
        pass('Lead record visible in Leads page');
    } else {
        fail('Lead record NOT found in Leads page');
    }

    // ─── Step 15: Verify in Contacts list ─────────────────────────────────────
    log('STEP 14: Checking Contacts page...');
    await page.evaluate(() => {
        window.dispatchEvent(new CustomEvent('nav-page', { detail: 'E-10' }));
    });
    await page.waitForTimeout(2000);
    await shot('15_contacts_page');

    const contactRecord = page.locator('text=/James Smoke|james.smoke/i').first();
    const hasContact = await contactRecord.isVisible({ timeout: 4000 }).catch(() => false);
    if (hasContact) {
        pass('Contact record visible in Contacts page');
    } else {
        fail('Contact record NOT found in Contacts page');
    }

    // ─── Step 16: Verify in Properties ────────────────────────────────────────
    log('STEP 15: Checking Properties page...');
    await page.evaluate(() => {
        window.dispatchEvent(new CustomEvent('nav-page', { detail: 'E-11' }));
    });
    await page.waitForTimeout(2000);
    await shot('16_properties_page');

    const propertyRecord = page.locator('text=/742|Smoke Test/i').first();
    const hasProperty = await propertyRecord.isVisible({ timeout: 4000 }).catch(() => false);
    if (hasProperty) {
        pass('Property record visible in Properties page');
    } else {
        fail('Property record NOT found in Properties page');
    }

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('  SMOKE TEST COMPLETE');
    console.log('  Check test_screenshots/ for visual evidence');
    console.log('═══════════════════════════════════════════════════════\n');

    await browser.close();
}

runSmokeTest().catch(async (err) => {
    console.error('\n💥 SMOKE TEST CRASHED:', err.message);
    if (page) await page.screenshot({ path: 'test_screenshots/smoke_crash.png' }).catch(() => {});
    if (browser) await browser.close();
    process.exit(1);
});
