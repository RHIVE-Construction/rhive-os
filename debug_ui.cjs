const { chromium } = require('playwright');
const fs = require('fs');

async function debug() {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 720 });

    // Print all browser console messages and unhandled runtime page errors
    page.on('console', msg => console.log(`[BRWS ${msg.type().toUpperCase()}] ${msg.text()}`));
    page.on('pageerror', err => {
        console.error('🔥 [BRWS RUNTIME EXCEPTION]:', err.message);
        console.error(err.stack);
    });

    console.log('Navigating to http://localhost:3000/');
    await page.goto('http://localhost:3000/');
    await page.waitForTimeout(5000);

    const html = await page.content();
    fs.writeFileSync('debug_render.html', html);
    console.log('Saved HTML to debug_render.html');

    await page.screenshot({ path: 'debug_screenshot.png' });
    console.log('Saved screenshot to debug_screenshot.png');

    await browser.close();
}

debug();
