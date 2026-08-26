import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const RPA_PROFILE_DIR = path.join(process.cwd(), 'scratch', 'rpa_headless_profile');

/**
 * Interactive One-Time OTP Login Helper.
 * Opens a dedicated login window ONLY when you explicitly run this command to enter OTP once.
 * Saves authenticated session cookies to scratch/rpa_headless_profile for future headless runs.
 */
async function launchLoginHelper() {
    console.log('[JustCall Login Helper] Launching dedicated authentication window...');
    if (!fs.existsSync(RPA_PROFILE_DIR)) {
        fs.mkdirSync(RPA_PROFILE_DIR, { recursive: true });
    }

    const context = await chromium.launchPersistentContext(RPA_PROFILE_DIR, {
        headless: false, // Visible only during your manual 1-time OTP login
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--window-size=1280,800'
        ],
        viewport: { width: 1280, height: 800 }
    });

    const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();
    await page.goto('https://app.justcall.io/apex/login');

    console.log('[JustCall Login Helper] Please log in with your email/password and OTP in the opened window.');
    console.log('[JustCall Login Helper] Once you reach the JustCall dashboard, you can close the window or press Ctrl+C here.');

    // Wait until logged in (dashboard or voice-agent URL reached)
    await page.waitForURL(url => !url.toString().includes('login') && !url.toString().includes('signin'), { timeout: 300000 }).catch(() => {});

    console.log('[JustCall Login Helper] Authentication state successfully saved to profile!');
    await context.close();
}

launchLoginHelper();
