import { test, expect } from '@playwright/test';
import fs from 'fs';

test('diagnose blank page', async ({ page }) => {
    page.on('console', msg => {
        console.log(`[BROWSER ${msg.type().toUpperCase()}] ${msg.text()}`);
    });

    page.on('pageerror', err => {
        console.error(`[BROWSER ERROR] ${err.toString()}`);
    });

    console.log("Navigating to http://localhost:3001/...");
    
    // Use try/catch so the test doesn't fail immediately, allowing us to inspect the DOM
    try {
        await page.goto('http://localhost:3001/', { waitUntil: 'load', timeout: 10000 });
        console.log("Navigation loaded. Waiting 3 seconds for rendering...");
        await page.waitForTimeout(3000);
        
        const html = await page.evaluate(() => document.body.innerHTML);
        console.log("--- HTML BODY CONTENT ---");
        console.log(html || "(empty body)");
        console.log("-------------------------");

        const screenshotPath = 'C:\\Users\\babotz\\.gemini\\antigravity-ide\\brain\\d80b4d17-f53d-40fa-a7e7-349653044aaa\\diagnose-screenshot.png';
        await page.screenshot({ path: screenshotPath });
        console.log(`Screenshot saved to ${screenshotPath}`);
    } catch (e) {
        console.error(`Error during navigation/diagnostics: ${e.message}`);
    }
});
