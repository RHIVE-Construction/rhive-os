/**
 * RHIVE Smoke Test — Residential Lead Intake (SLC, UT)
 * Branch: new-intake
 *
 * Based on actual UI inspection:
 * - Form is a single long page (not multi-step wizard after address confirmation)
 * - Contact fields (First Name / Last Name / Phone / Email) are already present
 * - Street address field uses Google Places which may fail — fill it directly
 * - SAVE PROPERTY button must be clicked before final submit
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL   = 'http://localhost:3001';
const INTAKE_URL = `${BASE_URL}/?bypass=admin&page=E-02a`;
const SS_DIR = path.join(__dirname, '..', 'test_screenshots');
if (!fs.existsSync(SS_DIR)) fs.mkdirSync(SS_DIR, { recursive: true });

const log  = (m) => console.log(`\n  ${m}`);
const pass = (m) => console.log(`  ✅ PASS: ${m}`);
const fail = (m) => console.error(`  ❌ FAIL: ${m}`);
const info = (m) => console.log(`     ${m}`);

let browser, page;

const shot = async (name) => {
    const p = path.join(SS_DIR, `smoke_${name}.png`);
    await page.screenshot({ path: p });
    info(`📸 smoke_${name}.png`);
};

const tryClick = async (selectors, timeout = 5000) => {
    const end = Date.now() + timeout;
    while (Date.now() < end) {
        for (const sel of selectors) {
            try {
                const el = page.locator(sel).first();
                if (await el.isVisible({ timeout: 300 })) {
                    await el.click();
                    return true;
                }
            } catch {}
        }
        await page.waitForTimeout(300);
    }
    return false;
};

const fillInput = async (selector, value) => {
    try {
        const el = page.locator(selector).first();
        await el.waitFor({ state: 'visible', timeout: 5000 });
        await el.fill(value);
        return true;
    } catch { return false; }
};

async function run() {
    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║  RHIVE SMOKE TEST — Residential Lead Intake  (SLC, UT)   ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');

    browser = await chromium.launch({
        headless: false,
        slowMo: 80,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    page = await context.newPage();
    page.setDefaultTimeout(20000);

    // ── STEP 1: Boot into Admin + Intake page ────────────────────────────────
    log('STEP 1: Boot Admin bypass → E-02a (New Project intake)...');
    // First clear sessionStorage that persists old page
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.evaluate(() => sessionStorage.removeItem('rhive_active_page'));
    await page.goto(INTAKE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3500);
    await shot('01_boot');
    pass('App loaded with admin bypass');

    // Verify sidebar (admin portal) is showing
    const hasSidebar = await page.locator('text="New Project"').first().isVisible({ timeout: 5000 }).catch(() => false);
    if (hasSidebar) pass('Admin portal confirmed — sidebar visible');
    else { fail('Admin portal not detected'); }

    // ── STEP 2: Select project type (Residential) ────────────────────────────
    log('STEP 2: Selecting Residential project type...');
    await shot('02_project_type_screen');

    const residentialClicked = await tryClick([
        'button:has-text("Residential")',
        'label:has-text("Residential")',
    ], 6000);
    if (residentialClicked) pass('Residential selected');
    else info('Residential not found yet — may need to scroll or already selected');
    await page.waitForTimeout(1000);

    // ── STEP 3: Address verification modal — set property name ───────────────
    log('STEP 3: Handling address verification / confirmation modal...');

    // The address input on public page → "SCAN MY ROOF" opens verification modal
    // Since we boot on E-02a, the form may be showing directly
    // Look for address input in modal first
    const mapInput = page.locator('input[placeholder*="ENTER PROJECT ADDRESS" i], input[placeholder*="address" i]').first();
    const hasMapInput = await mapInput.isVisible({ timeout: 3000 }).catch(() => false);

    if (hasMapInput) {
        info('Address input found — entering SLC address...');
        await mapInput.fill('1347 E Garfield Ave, Salt Lake City, UT 84105');
        await page.waitForTimeout(600);
        // Press Scan My Roof / Search
        await tryClick(['button:has-text("Scan My Roof")', 'button:has-text("Search")'], 3000);
        await page.waitForTimeout(3000);
    }

    // Set property name if modal is open
    const propNameField = page.locator('input[placeholder*="Smith Residence" i], input[placeholder*="nickname" i], input[placeholder="Property 1"]').first();
    const hasPropName = await propNameField.isVisible({ timeout: 3000 }).catch(() => false);
    if (hasPropName) {
        await propNameField.fill('Smoke Test Residence SLC');
        pass('Property name set to: Smoke Test Residence SLC');
    }
    await shot('03_property_name');

    // ── STEP 4: Set street address directly (Google Places may be broken) ────
    log('STEP 4: Setting street address manually...');

    // The "Street Address or Business Name" field shows "Oops! Something went wrong."
    // when Google Maps API fails. We need to type directly into it.
    const streetInput = page.locator(
        'input[placeholder*="Street Address" i], input[placeholder*="Business Name" i]'
    ).first();
    const hasStreet = await streetInput.isVisible({ timeout: 4000 }).catch(() => false);
    if (hasStreet) {
        await streetInput.fill('1347 E Garfield Ave, Salt Lake City, UT 84105');
        pass('Street address filled');
    } else {
        info('Street address input not yet visible — may appear after scroll');
    }

    await shot('04_address_filled');

    // ── STEP 5: Set Number of Buildings ─────────────────────────────────────
    log('STEP 5: Setting number of buildings to 3...');
    const buildingInput = page.locator('input[type="number"], input[placeholder="1"]').first();
    const hasBldgInput = await buildingInput.isVisible({ timeout: 3000 }).catch(() => false);
    if (hasBldgInput) {
        await buildingInput.fill('3');
        pass('3 buildings set');
    } else {
        info('Building count input not visible — using default');
    }
    await shot('05_buildings');

    // ── STEP 6: Click SAVE PROPERTY ─────────────────────────────────────────
    log('STEP 6: Saving property...');
    const savePropertyClicked = await tryClick([
        'button:has-text("SAVE PROPERTY")',
        'button:has-text("Save Property")',
    ], 5000);
    if (savePropertyClicked) pass('SAVE PROPERTY clicked');
    else fail('SAVE PROPERTY button not found');
    await page.waitForTimeout(1500);
    await shot('06_after_save_property');

    // ── STEP 7: Fill & saving Primary Contact ────────────────────────────
    log('STEP 7: Filling & saving Primary Contact...');

    // Scroll to contact section
    await page.locator('text="CONTACT DIRECTORY"').first().scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(500);

    // The ContactForm uses controlled inputs — fill them
    await page.locator('input[placeholder="Jane"]').first().fill('James').catch(() =>
        page.locator('input').filter({ hasText: '' }).nth(0).fill('James').catch(() => {})
    );
    await page.waitForTimeout(150);
    await page.locator('input[placeholder="Doe"]').first().fill('Smokeman').catch(() => {});
    await page.waitForTimeout(150);
    await page.locator('input[placeholder="(000) 000-0000"]').first().fill('(801) 555-1234').catch(() => {});
    await page.waitForTimeout(150);
    await page.locator('input[placeholder="jane@example.com"]').first().fill('james.smokeman@rhivetest.com').catch(() => {});
    await page.waitForTimeout(300);
    await shot('07_contact_filled');

    // Click "Save Contact" to push contact into the contacts[] array
    const savedContact = await tryClick([
        'button:has-text("Save Contact")',
        'button:has-text("Link & Save")',
    ], 5000);
    if (savedContact) pass('Contact saved to contacts array');
    else fail('Save Contact button not found');
    await page.waitForTimeout(800);
    await shot('07b_contact_saved');

    // Confirm Contacts (collapses the contacts section)
    await tryClick(['button:has-text("Confirm Contacts")'], 4000);
    await page.waitForTimeout(500);
    info('Contacts confirmed');

    // ── STEP 8: Complete remaining form sections ────────────────────────────
    log('STEP 8: Completing Billing + Project Intent sections...');

    // Click "Confirm Billing" if present (billing section auto-collapses if same as property)
    await tryClick(['button:has-text("Confirm Billing")', 'button:has-text("Use Property Address")'], 3000);
    await page.waitForTimeout(500);

    // Project Intent — select Replacement (it may already be selected as default)
    await tryClick(['button:has-text("Replacement")'], 2000);
    await page.waitForTimeout(300);

    // Click "Confirm Selection" to collapse the Project Type section
    await tryClick(['button:has-text("Confirm Selection")'], 3000);
    await page.waitForTimeout(300);
    info('Project type confirmed');

    // Select a project goal (first option = Ready to compare bids & install)
    await tryClick([
        'div:has-text("Ready to compare bids")',
        'div:has-text("Just looking for ballpark")',
    ], 3000);
    await page.waitForTimeout(300);

    // Click "Next" if the project intent section has a Next button
    await tryClick(['button:has-text("Next")'], 2000);
    await page.waitForTimeout(500);

    // Scroll to bottom to see remaining sections
    await page.evaluate(() => {
        const main = document.querySelector('main');
        if (main) main.scrollTop = main.scrollHeight;
    });
    await page.waitForTimeout(1000);
    await shot('08_form_bottom');

    // ── STEP 9: Submit the form ───────────────────────────────────────────────
    log('STEP 9: Scrolling to sticky footer and submitting...');

    // The form is inside a scrollable <main> container — scroll it
    await page.evaluate(() => {
        // Scroll every scrollable container to bottom
        const scrollables = [
            document.querySelector('main'),
            document.querySelector('[class*="overflow-y-auto"]'),
            document.querySelector('form'),
            document.documentElement,
            document.body,
        ];
        for (const el of scrollables) {
            if (el) el.scrollTop = el.scrollHeight;
        }
    });
    await page.waitForTimeout(1000);
    await shot('09a_scrolled_to_footer');

    // Now find the submit button in DOM and click it via JS
    const submitInfo = await page.evaluate(() => {
        // Look for any button with type submit, or the sticky footer button
        const byType = document.querySelector('button[type="submit"]');
        if (byType) {
            byType.scrollIntoView({ block: 'center' });
            byType.click();
            return { clicked: true, text: byType.textContent?.trim() };
        }
        // Find by text content
        const allBtns = [...document.querySelectorAll('button')];
        const submitBtn = allBtns.find(b =>
            b.textContent?.includes('Create') ||
            b.textContent?.includes('Open File') ||
            b.textContent?.includes('Send Estimate')
        );
        if (submitBtn) {
            submitBtn.scrollIntoView({ block: 'center' });
            submitBtn.click();
            return { clicked: true, text: submitBtn.textContent?.trim() };
        }
        // Last resort: submit the form directly
        const form = document.querySelector('form');
        if (form) {
            form.requestSubmit();
            return { clicked: true, text: 'form.requestSubmit()' };
        }
        return { clicked: false, text: 'no button found' };
    });

    info(`Submit result: clicked=${submitInfo.clicked}, text="${submitInfo.text}"`);
    if (submitInfo.clicked) pass('Form submitted via JS click');
    else fail('Could not find submit button');
    await shot('09b_pre_submit');

    await page.waitForTimeout(4000);
    await shot('09_after_submit');

    // ── STEP 10: Check result ─────────────────────────────────────────────────
    log('STEP 10: Checking submission result...');

    // Look for success modal/message
    let successFound = false;
    const successSelectors = [
        'text=/success/i',
        'text=/project created/i',
        'text=/lead created/i',
        'text=/added successfully/i',
        'text=/intake complete/i',
        '[class*="success"]',
    ];
    for (const sel of successSelectors) {
        try {
            if (await page.locator(sel).first().isVisible({ timeout: 2000 })) {
                successFound = true;
                break;
            }
        } catch {}
    }

    if (successFound) {
        pass('🎉 SUCCESS — Lead created successfully!');
        await shot('10_success_modal');
    } else {
        // Check for validation errors
        const errEl = page.locator('.text-red-500, .text-red-400, [class*="error"]').first();
        const hasErr = await errEl.isVisible({ timeout: 2000 }).catch(() => false);
        if (hasErr) {
            const errText = await errEl.textContent().catch(() => '');
            fail(`Validation error: ${errText?.trim()}`);
        } else {
            info('No success/error modal — checking page state...');
        }
        await shot('10_unknown_state');
    }

    // Dismiss modal
    await tryClick(['button:has-text("View Project")', 'button:has-text("Done")', 'button:has-text("Close")'], 2000);
    await page.waitForTimeout(1500);

    // ── STEP 11: Verify Lead in Leads list ────────────────────────────────────
    log('STEP 11: Verifying lead in leads list...');
    await page.evaluate(() => window.dispatchEvent(new CustomEvent('nav-page', { detail: 'E-26' })));
    await page.waitForTimeout(2500);
    await shot('11_leads_page');

    const hasLead = await page.locator('text=/Smoke Test|James Smokeman|james.smokeman/i').first().isVisible({ timeout: 5000 }).catch(() => false);
    if (hasLead) pass('✓ Lead record found in Leads page');
    else fail('Lead record NOT visible in Leads page');

    // ── STEP 12: Verify Contact ───────────────────────────────────────────────
    log('STEP 12: Verifying contact record...');
    await tryClick(['button:has-text("Contacts")', 'button:has-text("Contact List")'], 3000);
    await page.waitForTimeout(2000);
    await shot('12_contacts_page');

    const hasContact = await page.locator('text=/James Smokeman|james.smokeman/i').first().isVisible({ timeout: 5000 }).catch(() => false);
    if (hasContact) pass('✓ Contact record found');
    else fail('Contact NOT found in Contacts list');

    // ── STEP 13: Verify Property ──────────────────────────────────────────────
    log('STEP 13: Verifying property record...');
    await tryClick(['button:has-text("Properties")', 'button:has-text("Property List")'], 3000);
    await page.waitForTimeout(2000);
    await shot('13_properties_page');

    const hasProperty = await page.locator('text=/Smoke Test Residence|1347|Garfield/i').first().isVisible({ timeout: 5000 }).catch(() => false);
    if (hasProperty) pass('✓ Property record found');
    else fail('Property NOT found in Properties list');

    // ── Done ──────────────────────────────────────────────────────────────────
    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║  SMOKE TEST COMPLETE — see test_screenshots/smoke_*.png  ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');

    await browser.close();
}

run().catch(async (err) => {
    console.error('\n💥 SMOKE TEST CRASHED:', err.message);
    if (page) await page.screenshot({ path: path.join(SS_DIR, 'smoke_crash.png') }).catch(() => {});
    if (browser) await browser.close();
    process.exit(1);
});
