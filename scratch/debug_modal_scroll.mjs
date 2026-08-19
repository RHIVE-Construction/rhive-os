import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
    
    await page.goto('http://localhost:3000/?page=P-00');
    await page.waitForTimeout(2000);
    
    // Open about lightbox
    await page.evaluate(() => {
        window.dispatchEvent(new CustomEvent('v3-open-lightbox', { detail: 'about' }));
    });
    await page.waitForTimeout(1000);
    
    // Take screenshot of the top of the modal
    await page.screenshot({ path: 'debug_modal_top.png' });
    
    // Scroll down
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'debug_modal_scrolled.png' });
    
    await browser.close();
})();
