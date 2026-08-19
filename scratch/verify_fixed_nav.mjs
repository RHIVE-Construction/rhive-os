import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
    
    console.log("Navigating to port 5174...");
    await page.goto('http://localhost:5174/?page=P-00');
    await page.waitForTimeout(5000);
    
    // Open about lightbox
    console.log("Opening about lightbox...");
    await page.evaluate(() => {
        window.dispatchEvent(new CustomEvent('v3-open-lightbox', { detail: 'about' }));
    });
    await page.waitForTimeout(2000);
    
    // Take screenshot of the top
    await page.screenshot({ path: 'verify_fixed_buttons_top.png' });
    console.log("Screenshot saved: verify_fixed_buttons_top.png");
    
    // Scroll down 1000px
    console.log("Scrolling down...");
    await page.mouse.wheel(0, 1000);
    await page.waitForTimeout(1000);
    
    // Take screenshot while scrolled
    await page.screenshot({ path: 'verify_fixed_buttons_scrolled.png' });
    console.log("Screenshot saved: verify_fixed_buttons_scrolled.png");
    
    await browser.close();
    console.log("Done.");
})();
