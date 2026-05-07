import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext({ viewport: { width: 1280, height: 2500 } });
    const page = await context.newPage();

    console.log("Navigating to localhost...");
    await page.goto('http://localhost:3000/');

    console.log("Waiting for Customer button...");
    await page.waitForSelector('text="Customer"');
    await page.click('text="Customer"');
    console.log("Clicked Customer.");
    await page.waitForTimeout(3000); // Wait for transition and load

    const pagesToCapture = [
        { pageId: 'P-02a', path: "C:\\Users\\mjrob\\.gemini\\antigravity\\brain\\5a8a9ae0-a5f0-4c6e-9695-3ed1bc116b1e\\1_HighPerformanceAsphalt_Funnel.png" },
        { pageId: 'P-02a-1', path: "C:\\Users\\mjrob\\.gemini\\antigravity\\brain\\5a8a9ae0-a5f0-4c6e-9695-3ed1bc116b1e\\2_OC_Duration_Performance.png" },
        { pageId: 'P-02a-2', path: "C:\\Users\\mjrob\\.gemini\\antigravity\\brain\\5a8a9ae0-a5f0-4c6e-9695-3ed1bc116b1e\\3_OC_Flex_Class4.png" },
        { pageId: 'P-02a-3', path: "C:\\Users\\mjrob\\.gemini\\antigravity\\brain\\5a8a9ae0-a5f0-4c6e-9695-3ed1bc116b1e\\4_GAF_Woodland_Designer.png" },
        { pageId: 'P-02a-4', path: "C:\\Users\\mjrob\\.gemini\\antigravity\\brain\\5a8a9ae0-a5f0-4c6e-9695-3ed1bc116b1e\\5_GAF_GrandSequoia_Premium.png" }
    ];

    for (const item of pagesToCapture) {
        console.log(`Navigating to page ${item.pageId}...`);
        await page.evaluate((pid) => {
            window.dispatchEvent(new CustomEvent('nav-page', { detail: pid }));
        }, item.pageId);
        // wait to ensure layout shifts are done and images are loaded
        await page.waitForTimeout(2000);
        console.log(`Capturing to ${item.path}...`);
        await page.screenshot({ path: item.path, fullPage: true });
    }

    console.log("Done.");
    await browser.close();
})();
