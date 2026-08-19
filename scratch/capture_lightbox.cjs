const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:3001/?page=P-01');
    
    // Click the "RHIVE Movement" button
    await page.click('button:has-text("RHIVE Movement")');
    
    // Wait for the lightbox to be visible
    await page.waitForSelector('div[style*="clip-path: polygon(32px 0"]', { state: 'visible' });
    
    await page.screenshot({ path: 'c:/Users/USER/rhive-os/lightbox_fixed.png' });
    await browser.close();
})();
