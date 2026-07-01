/**
 * test_forgot_password_ui.mjs
 * Playwright test for the forgot password UI flow.
 * Usage: node test_forgot_password_ui.mjs
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:3000';
const PHONE = '+639560213304';
const SCREENSHOT_DIR = './test_screenshots';

async function shot(page, name) {
    mkdirSync(SCREENSHOT_DIR, { recursive: true });
    const file = path.join(SCREENSHOT_DIR, `${name}.png`);
    await page.screenshot({ path: file, fullPage: false });
    console.log(`   📸 Screenshot: ${file}`);
    return file;
}

async function main() {
    console.log('\n🔐 RHIVE Forgot Password — UI Flow Test (Playwright)');
    console.log('══════════════════════════════════════════════════════\n');

    const browser = await chromium.launch({ headless: false, slowMo: 300 });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 800 });

    try {
        // ── Step 0: Load app ──────────────────────────────────────────────────
        console.log('⏳ Opening http://localhost:3000...');
        // Use domcontentloaded — Firebase realtime listeners prevent networkidle
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(4000); // Let React hydrate + Firebase init
        await shot(page, '01_homepage');

        // Debug: log all visible button text
        const allButtons = await page.$$eval('button, a', els =>
            els.map(e => e.textContent?.trim()).filter(t => t && t.length < 60)
        );
        console.log('   Visible buttons/links:', allButtons.slice(0, 20).join(' | '));
        console.log('✅ App loaded\n');

        // ── Step 1: Navigate to Login ─────────────────────────────────────────
        console.log('⏳ Navigating to login — clicking person icon (top-right) or Exit to Portal...');
        let clicked = false;

        // Try the person/user icon in the top-right (it's an SVG icon button)
        const personIconSelectors = [
            '[aria-label*="login"]', '[aria-label*="account"]', '[aria-label*="user"]',
            'button svg[class*="user"]', 'button:has(svg)',
            'a:has-text("Exit to Portal")', 'button:has-text("Exit to Portal")',
            'a:has-text("EXIT TO PORTAL")', 'button:has-text("EXIT TO PORTAL")',
        ];
        for (const sel of personIconSelectors) {
            try {
                const el = page.locator(sel).first();
                if (await el.isVisible({ timeout: 1000 })) {
                    await el.click();
                    clicked = true;
                    console.log(`   ✅ Clicked: ${sel}`);
                    break;
                }
            } catch {}
        }
        // Fallback: click the last button in the nav (person icon is usually last)
        if (!clicked) {
            try {
                const navButtons = page.locator('nav button, header button');
                const count = await navButtons.count();
                if (count > 0) {
                    await navButtons.nth(count - 1).click();
                    clicked = true;
                    console.log(`   ✅ Clicked last nav button (#${count - 1})`);
                }
            } catch {}
        }
        await page.waitForTimeout(2000);
        await shot(page, '02_after_login_click');

        // Check if we're on the login page now — look for email/password inputs
        const hasEmailInput = await page.locator('input[type="email"], input[placeholder*="email"], input[id*="email"]').isVisible({ timeout: 2000 }).catch(() => false);
        if (!hasEmailInput) {
            console.log('   ℹ️  Not on login page yet — trying Exit to Portal link...');
            // Try the text link
            try {
                await page.locator('text=EXIT TO PORTAL').first().click();
                await page.waitForTimeout(2000);
            } catch {}
            await shot(page, '02b_after_portal_click');
        }

        // ── Step 2: Find Forgot Password link ─────────────────────────────────
        console.log('\n⏳ Looking for "Forgot password?" link...');
        const forgotSelectors = [
            'button:has-text("Forgot password")',
            'a:has-text("Forgot password")',
            'text=Forgot password',
            '[class*="forgot"]',
        ];
        let forgotClicked = false;
        for (const sel of forgotSelectors) {
            try {
                const el = page.locator(sel).first();
                if (await el.isVisible({ timeout: 2000 })) {
                    await el.click();
                    forgotClicked = true;
                    console.log(`   ✅ Clicked: ${sel}`);
                    break;
                }
            } catch {}
        }
        if (!forgotClicked) {
            console.log('   ⚠️  "Forgot password?" not visible yet — taking screenshot to inspect');
        }
        await page.waitForTimeout(1500);
        await shot(page, '03_forgot_password_page');

        // ── Step 3: Enter phone number ────────────────────────────────────────
        console.log('\n⏳ Looking for phone input field...');
        const phoneSelectors = [
            'input[type="tel"]', 'input[placeholder*="phone"]',
            'input[placeholder*="+63"]', '#recovery-phone',
            'input[id*="phone"]', 'input[name*="phone"]'
        ];
        let phoneEntered = false;
        for (const sel of phoneSelectors) {
            try {
                const el = page.locator(sel).first();
                if (await el.isVisible({ timeout: 2000 })) {
                    await el.fill(PHONE);
                    phoneEntered = true;
                    console.log(`   ✅ Entered phone ${PHONE} into: ${sel}`);
                    break;
                }
            } catch {}
        }
        if (!phoneEntered) {
            console.log('   ⚠️  Phone field not found');
        }
        await page.waitForTimeout(500);
        await shot(page, '04_phone_entered');

        // ── Step 4: Click Send Verification Code ──────────────────────────────
        console.log('\n⏳ Clicking "Send Verification Code"...');
        const sendSelectors = [
            'button:has-text("Send Verification Code")',
            'button:has-text("Send Code")',
            'button[type="submit"]',
        ];
        for (const sel of sendSelectors) {
            try {
                const el = page.locator(sel).first();
                if (await el.isVisible({ timeout: 2000 })) {
                    await el.click();
                    console.log(`   ✅ Clicked: ${sel}`);
                    break;
                }
            } catch {}
        }
        await page.waitForTimeout(8000); // Wait for Cloud Function response + UI transition
        await shot(page, '05_after_send_otp');

        // ── Step 5: Check for OTP code on screen (dev mode) ───────────────────
        console.log('\n⏳ Checking for OTP code on screen (dev mode)...');
        let otpCode = null;
        try {
            // Dev mode shows code in yellow box
            const devBox = page.locator('.text-yellow-300, [class*="yellow"]').first();
            if (await devBox.isVisible({ timeout: 3000 })) {
                otpCode = (await devBox.textContent()).trim().replace(/\D/g, '');
                console.log(`   🔑 Dev mode OTP code found on screen: ${otpCode}`);
            }
        } catch {}

        if (!otpCode) {
            // Try to read from page text
            const bodyText = await page.textContent('body');
            const match = bodyText.match(/\b(\d{6})\b/);
            if (match) {
                otpCode = match[1];
                console.log(`   🔑 Found 6-digit code in page: ${otpCode}`);
            } else {
                console.log('   ⚠️  No OTP code visible — JustCall may have sent real SMS');
            }
        }

        if (otpCode) {
            // ── Step 6: Enter OTP in the 6-box input ─────────────────────────
            console.log(`\n⏳ Entering OTP code: ${otpCode}`);
            // OTP boxes are individual inputs
            const otpInputs = page.locator('input[maxlength="1"]');
            const count = await otpInputs.count();
            console.log(`   Found ${count} OTP input boxes`);
            for (let i = 0; i < Math.min(otpCode.length, count); i++) {
                await otpInputs.nth(i).fill(otpCode[i]);
                await page.waitForTimeout(100);
            }
            await shot(page, '06_otp_entered');

            // ── Step 7: Click Verify Code ─────────────────────────────────────
            console.log('\n⏳ Clicking "Verify Code"...');
            try {
                await page.locator('button:has-text("Verify Code")').click();
            } catch {
                await page.locator('button[type="submit"]').first().click();
            }
            await page.waitForTimeout(4000);
            await shot(page, '07_after_verify_otp');

            // ── Step 8: Enter new password ────────────────────────────────────
            console.log('\n⏳ Looking for new password fields...');
            try {
                const newPwd = page.locator('#new-password, input[id*="new-password"], input[placeholder*="••"]').first();
                if (await newPwd.isVisible({ timeout: 3000 })) {
                    await newPwd.fill('NewPassword2026!');
                    console.log('   ✅ New password entered');
                    const confirmPwd = page.locator('#confirm-password, input[id*="confirm"]').first();
                    if (await confirmPwd.isVisible({ timeout: 2000 })) {
                        await confirmPwd.fill('NewPassword2026!');
                        console.log('   ✅ Confirm password entered');
                    }
                    await shot(page, '08_password_entered');

                    // ── Step 9: Click Update Password ─────────────────────────
                    console.log('\n⏳ Clicking "Update Password"...');
                    await page.locator('button:has-text("Update Password")').click();
                    await page.waitForTimeout(5000);
                    await shot(page, '09_final_result');
                }
            } catch (e) {
                console.log('   ⚠️  Password fields not found:', e.message);
                await shot(page, '08_password_step_error');
            }
        }

        // Final state
        await shot(page, '10_final_state');
        console.log('\n══════════════════════════════════════════════════════');
        console.log('✅ UI test complete! Screenshots saved to ./test_screenshots/');
        console.log('══════════════════════════════════════════════════════\n');

    } catch (err) {
        console.error('\n❌ Test error:', err.message);
        await shot(page, 'ERROR_state');
    } finally {
        await page.waitForTimeout(3000); // Let user see final state
        await browser.close();
    }
}

main().catch(console.error);
