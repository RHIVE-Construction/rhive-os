import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\mjrob\\.gemini\\antigravity\\brain\\26528e87-5332-4030-9fe4-230271a6a111';

async function updateJustCallLive() {
    console.log('[JustCall Live RPA] Attempting CDP connection to live Chrome...');
    
    let browser;
    try {
        browser = await chromium.connectOverCDP('http://localhost:9222');
        console.log('[JustCall Live RPA] Connected to active Chrome via CDP!');
    } catch (e) {
        console.log('[JustCall Live RPA] CDP on 9222 not active.');
    }

    if (browser) {
        const contexts = browser.contexts();
        const pages = contexts[0].pages();
        console.log(`[JustCall Live RPA] Found ${pages.length} active tabs.`);
        for (const p of pages) {
            const url = p.url();
            console.log(`Tab: ${url}`);
            if (url.includes('justcall.io')) {
                console.log(`[JustCall Live RPA] Found JustCall tab: ${url}`);
                await p.screenshot({ path: path.join(ARTIFACT_DIR, 'proof_cdp_justcall_tab.png') });
            }
        }
    }
}

updateJustCallLive();
