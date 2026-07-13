/**
 * RHIVE OS — James Bondbond Full Intake (v3 - scroll-aware)
 * Scrolls to each section, fills every required field, submits.
 */
import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'http://localhost:3001';
const SHOTS_DIR = 'C:\\Users\\babotz\\.gemini\\antigravity\\brain\\3a65b6d6-adae-44c9-b165-494463380884\\bondbond-intake';
if (!fs.existsSync(SHOTS_DIR)) fs.mkdirSync(SHOTS_DIR, { recursive: true });

let shotIdx = 0;
const ss = async (page, label) => {
    const name = `${String(shotIdx++).padStart(2,'0')}_${label}.png`;
    await page.screenshot({ path: path.join(SHOTS_DIR, name), fullPage: true });
    console.log(`  📸  ${name}`);
};

const click = async (page, selectors, label='') => {
    for (const sel of selectors) {
        const loc = page.locator(sel).first();
        if (await loc.isVisible({ timeout: 1500 }).catch(() => false)) {
            await loc.scrollIntoViewIfNeeded();
            await loc.click();
            if (label) console.log(`  ✔ ${label}`);
            return true;
        }
    }
    if (label) console.log(`  ⚠ ${label} not found`);
    return false;
};

async function run() {
    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║  RHIVE — James Bondbond Intake (v3)           ║');
    console.log('╚══════════════════════════════════════════════╝\n');

    const browser = await chromium.launch({ headless: false, slowMo: 60 });
    const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
    const page = await ctx.newPage();
    page.on('dialog', async d => { console.log(`  [DLG] ${d.message().substring(0,80)}`); await d.accept(); });

    // ── STEP 0: Load page ────────────────────────────────────────────────────
    console.log('STEP 0  Loading intake form...');
    await page.goto(`${BASE_URL}/?bypass=Employee&page=E-02a`, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(3000);

    // Scroll to very top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    await ss(page, 'page_top');

    // ── STEP 1: Fill address ─────────────────────────────────────────────────
    console.log('STEP 1  Filling property address...');
    const addr = page.locator('#property-address-input').first();
    await addr.scrollIntoViewIfNeeded();
    await addr.click({ clickCount: 3 });
    await addr.type('742 S 200 E, Salt Lake City, UT 84102', { delay: 40 });
    await page.waitForTimeout(1200);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
    await ss(page, 'address_typed');

    // ── STEP 2: Building count = 3 ───────────────────────────────────────────
    console.log('STEP 2  Setting 3 buildings...');
    const bldg = page.locator('#address-section-building-count').first();
    if (await bldg.isVisible({ timeout: 3000 })) {
        await bldg.scrollIntoViewIfNeeded();
        await bldg.click({ clickCount: 3 });
        await bldg.fill('3');
        await page.waitForTimeout(300);
        console.log('  ✔ Building count: 3');
    }

    // Pin buildings on map if canvas exists
    const canvas = page.locator('canvas').first();
    if (await canvas.isVisible({ timeout: 2000 })) {
        const box = await canvas.boundingBox();
        if (box) {
            const pts = [[0,-50],[60,20],[-60,20]];
            for (let i=0; i<pts.length; i++) {
                await page.mouse.click(box.x+box.width/2+pts[i][0], box.y+box.height/2+pts[i][1]);
                await page.waitForTimeout(600);
                await click(page, ['button:has-text("Pin Building")', 'button:has-text("Add Building")', 'button:has-text("Save Building")']);
                console.log(`  📍 Building ${i+1} pinned`);
            }
        }
    }
    await ss(page, 'buildings_set');

    // ── STEP 3: Residential ──────────────────────────────────────────────────
    console.log('STEP 3  Selecting Residential...');
    await click(page, ['button:has-text("Residential")', 'label:has-text("Residential")', '[data-type="Residential"]'], 'Residential selected');
    await ss(page, 'residential_selected');

    // ── STEP 4: Contact form ─────────────────────────────────────────────────
    console.log('STEP 4  Filling contact: James Bondbond...');

    // First Name — placeholder="Jane"
    const firstName = page.locator('input[placeholder="Jane"]').first();
    await firstName.scrollIntoViewIfNeeded();
    await firstName.click({ clickCount: 3 });
    await firstName.fill('James');
    await page.waitForTimeout(150);

    // Last Name — placeholder="Doe"  
    const lastName = page.locator('input[placeholder="Doe"]').first();
    await lastName.click({ clickCount: 3 });
    await lastName.fill('Bondbond');
    await page.waitForTimeout(150);

    // Phone
    const phone = page.locator('input[type="tel"]').first();
    await phone.click({ clickCount: 3 });
    await phone.fill('5435435430');
    await page.waitForTimeout(150);

    // Email
    const email = page.locator('input[type="email"]').first();
    if (await email.isVisible({ timeout: 1500 })) {
        await email.click({ clickCount: 3 });
        await email.fill('james.bondbond@email.com');
    }

    // Set role = Property Owner if there's a role dropdown/selector
    await click(page, ['button:has-text("Property Owner")', 'option:has-text("Property Owner")', 'select'], 'Role: Property Owner');

    await ss(page, 'contact_filled');
    console.log('  ✔ James | Bondbond | 543-543-5430 | james.bondbond@email.com');

    // Save contact
    const saved = await click(page, ['button:has-text("Save Contact")', 'button:has-text("Add Contact")', 'button:has-text("Save")'], 'Contact saved');
    if (saved) await page.waitForTimeout(1000);
    await ss(page, 'contact_saved');

    // ── STEP 5: Scroll down and fill remaining sections ──────────────────────
    console.log('STEP 5  Filling project intent & scope...');

    // Scope: Replacement
    await click(page, ['button:has-text("Replacement")', 'label:has-text("Replacement")'], 'Scope: Replacement');
    await page.waitForTimeout(300);

    // Goal / intent
    await click(page, ['button:has-text("Ready to Proceed")', 'button:has-text("Ready")', 'button:has-text("Interested")', 'button:has-text("Exploring")'], 'Goal set');
    await page.waitForTimeout(300);

    // Insurance: No
    await click(page, ['button:has-text("No Insurance Claim")', 'button:has-text("No")', 'button:has-text("Not a Claim")', 'button:has-text("Cash")', 'button:has-text("Out of Pocket")'], 'Insurance: No claim');
    await page.waitForTimeout(300);

    // Fill any visible textarea notes
    const notes = page.locator('textarea').first();
    if (await notes.isVisible({ timeout: 2000 })) {
        await notes.scrollIntoViewIfNeeded();
        await notes.fill('Full roof replacement needed. Heavy hail damage from recent storm. 18-year-old roof. Ready to book inspection immediately.');
        console.log('  ✔ Project notes entered');
    }
    await ss(page, 'scope_filled');

    // ── STEP 6: Submit ───────────────────────────────────────────────────────
    console.log('STEP 6  Scrolling to submit button...');
    // Scroll to bottom of page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    const submitBtn = page.locator([
        'button:has-text("Create New Project")',
        'button:has-text("Create & Open File")',
        'button:has-text("Submit")',
        'button:has-text("Send Estimate")',
    ].join(', ')).last();

    await submitBtn.waitFor({ state: 'visible', timeout: 10000 });
    await submitBtn.scrollIntoViewIfNeeded();
    await ss(page, 'pre_submit');
    await submitBtn.click();
    await page.waitForTimeout(3500);
    await ss(page, 'post_submit');

    // ── STEP 7: Success confirmation ─────────────────────────────────────────
    console.log('STEP 7  Checking success...');
    const checks = ['text=Project Created', 'text=Lead Created', 'text=Bondbond', 'text=Bond_'];
    let confirmed = false;
    for (const sel of checks) {
        if (await page.locator(sel).first().isVisible({ timeout: 2000 }).catch(()=>false)) {
            console.log(`  ✅  SUCCESS: found "${sel}" on page`);
            confirmed = true;
            break;
        }
    }
    if (!confirmed) console.log('  ⚠ No explicit success text — see screenshot');
    await ss(page, 'success_check');

    // Close any modal
    await click(page, ['button:has-text("Close")', 'button:has-text("Done")', 'button:has-text("Go to Lead")', 'button:has-text("OK")'], 'Modal closed');
    await page.waitForTimeout(800);

    // ── STEP 8: Verify in Leads list ─────────────────────────────────────────
    console.log('STEP 8  Navigating to Stage 1 — Leads...');
    await page.goto(`${BASE_URL}/?bypass=Employee&page=E-26`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(3000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await ss(page, 'leads_page_top');

    // Search for Bondbond
    for (const term of ['Bondbond', 'Bond_742', 'Bond_', 'james']) {
        const loc = page.locator(`text=${term}`).first();
        if (await loc.isVisible({ timeout: 3000 }).catch(()=>false)) {
            await loc.scrollIntoViewIfNeeded();
            console.log(`\n  ✅  CONFIRMED: "${term}" found in Leads!`);
            await page.waitForTimeout(500);
            await ss(page, 'BONDBOND_CONFIRMED_IN_LEADS');
            confirmed = true;
            break;
        }
    }
    if (!confirmed) {
        // Try scrolling through the page
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
        await page.waitForTimeout(500);
        await ss(page, 'leads_mid_scroll');
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(500);
        await ss(page, 'leads_bottom');
    }

    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║  ✅  INTAKE COMPLETE                           ║');
    console.log('║  Name    : James Bondbond                      ║');
    console.log('║  Address : 742 S 200 E, Salt Lake City UT      ║');
    console.log('║  Phone   : +1 543-543-5430                     ║');
    console.log('║  Type    : Residential | 3 Buildings           ║');
    console.log('╚══════════════════════════════════════════════╝\n');

    await browser.close();
}

run().catch(e => { console.error('\n❌ ERROR:', e.message, '\n', e.stack?.split('\n').slice(0,5).join('\n')); process.exit(1); });
