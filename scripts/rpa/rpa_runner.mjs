import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = process.env.ARTIFACT_DIR || 'C:\\Users\\mjrob\\.gemini\\antigravity\\brain\\26528e87-5332-4030-9fe4-230271a6a111';
const RPA_PROFILE_DIR = path.join(process.cwd(), 'scratch', 'rpa_headless_profile');

/**
 * Initializes a pure headless browser context with --headless=new using installed Chrome channel.
 * Zero GUI window, zero mouse hijacking, 100% off-screen virtual framebuffer.
 */
export async function launchHeadlessRPA(options = {}) {
    if (!fs.existsSync(RPA_PROFILE_DIR)) {
        fs.mkdirSync(RPA_PROFILE_DIR, { recursive: true });
    }

    const context = await chromium.launchPersistentContext(RPA_PROFILE_DIR, {
        channel: 'chrome', // Use installed Chrome binary to decrypt DPAPI session tokens
        headless: true,
        args: [
            '--headless=new',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--window-size=1920,1080',
            ...(options.args || [])
        ],
        viewport: { width: 1920, height: 1080 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        ...options
    });

    const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();
    return { context, page };
}

/**
 * Captures clean headless proof screenshot directly to artifact directory.
 */
export async function captureHeadlessProof(page, filename) {
    const targetPath = path.isAbsolute(filename) ? filename : path.join(ARTIFACT_DIR, filename);
    await page.screenshot({ path: targetPath, fullPage: false });
    return targetPath;
}
