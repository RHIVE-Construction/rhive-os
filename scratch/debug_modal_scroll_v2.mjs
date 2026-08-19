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
    
    // Take screenshot of the top of the modal
    await page.screenshot({ path: 'debug_modal_top_v2.png' });
    console.log("Screenshot saved: debug_modal_top_v2.png");
    
    // Check if buttons are visible
    const backBtn = await page.getByText('BACK');
    console.log("BACK button count:", await backBtn.count());
    if (await backBtn.count() > 0) {
        const box = await backBtn.boundingBox();
        console.log("BACK button bounding box:", box);
    }
    
    await browser.close();
    console.log("Done.");
})();
