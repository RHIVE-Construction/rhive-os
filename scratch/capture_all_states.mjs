import { chromium } from 'playwright';

(async () => {
    console.log("Launching browser for comprehensive state screenshot capture...");
    const browser = await chromium.launch({ headless: true });
    
    // Create page context with standard viewport matching our layout
    const context = await browser.newContext({ 
        viewport: { width: 1280, height: 800 },
        deviceScaleFactor: 1
    });
    
    const page = await context.newPage();
    const screenshotsDir = 'C:\\Users\\mjrob\\.gemini\\antigravity\\brain\\a8707e63-7c28-4d28-8bd0-01caacf0c810';
    const baseUrl = 'http://localhost:3001';

    // Helper to take a screenshot and log it
    const takeScreenshot = async (name, delay = 1000) => {
        await page.waitForTimeout(delay);
        const path = `${screenshotsDir}\\${name}`;
        await page.screenshot({ path });
        console.log(`[Captured] ${name}`);
    };

    try {
        // 1. Base Public Homepage
        console.log("Loading base public homepage...");
        await page.goto(`${baseUrl}/`);
        await page.waitForTimeout(2000);
        await takeScreenshot('01_public_homepage.png', 0);

        // 2. Spotlight Search modal (replacing quick_login_lightbox.png)
        console.log("Opening Spotlight Search lookup modal...");
        await page.goto(`${baseUrl}/`);
        await page.waitForTimeout(1000);
        await page.evaluate(() => {
            window.dispatchEvent(new CustomEvent('open-customer-lookup'));
        });
        await page.waitForSelector('#search-lookup-input');
        await page.fill('#search-lookup-input', 'Rick');
        await page.waitForTimeout(1000);
        await takeScreenshot('02_quick_login_lightbox.png', 0);

        // 3. Founders Card Lightbox
        console.log("Opening Founders Card Lightbox...");
        await page.goto(`${baseUrl}/`);
        await page.waitForTimeout(1500);
        await page.evaluate(() => {
            const btn = document.evaluate("//button[contains(., 'RHIVE AI')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (btn) btn.click();
        });
        await page.waitForTimeout(1000);
        await takeScreenshot('03_founders_card_lightbox.png', 0);

        // 4. Process Lightbox
        console.log("Opening Process Lightbox...");
        await page.goto(`${baseUrl}/`);
        await page.waitForTimeout(1500);
        await page.evaluate(() => {
            const btn = document.evaluate("//button[contains(., '10-Stage')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (btn) btn.click();
        });
        await page.waitForTimeout(1000);
        await takeScreenshot('04_process_lightbox.png', 0);

        // 5. Roof Configurator Lightbox
        console.log("Opening Roof Configurator Lightbox...");
        await page.goto(`${baseUrl}/`);
        await page.waitForTimeout(1000);
        await page.evaluate(() => {
            window.dispatchEvent(new CustomEvent('open-roof-configurator', { detail: { mode: 'estimate', address: '525 Aspen Meadow Dr, Logan, UT' } }));
        });
        await page.waitForTimeout(1000);
        await takeScreenshot('05_roof_configurator_lightbox.png', 0);

        // 6. System Scan Slide-out Panel (Now on Left!)
        console.log("Opening System Scan Left Drawer Panel...");
        await page.goto(`${baseUrl}/`);
        await page.waitForTimeout(1500);
        await page.evaluate(() => {
            window.dispatchEvent(new CustomEvent('open-estimator'));
        });
        await page.waitForTimeout(1000);
        await takeScreenshot('06_system_scan_panel.png', 0);

        // 7. Emergency Triage Lightbox
        console.log("Opening Emergency Triage Lightbox...");
        await page.goto(`${baseUrl}/`);
        await page.waitForTimeout(1000);
        await page.evaluate(() => {
            window.dispatchEvent(new CustomEvent('open-emergency-triage'));
        });
        await page.waitForTimeout(1000);
        await takeScreenshot('07_emergency_triage_lightbox.png', 0);

        // 8. Hunni Chat Panel (Bottom Right)
        console.log("Opening Hunni Chat Panel...");
        await page.goto(`${baseUrl}/`);
        await page.waitForTimeout(1500);
        const chatButton = await page.locator('button:has-text("HUNNI")');
        if (await chatButton.count() > 0) {
            await chatButton.click();
        } else {
            console.log("Hunni button not found by text, searching message square icon...");
            await page.locator('.fixed.bottom-8.right-8 button').click();
        }
        await page.waitForTimeout(1000);
        await takeScreenshot('08_hunni_chat_panel.png', 0);

        // 9. Direct Login Page (P-06)
        console.log("Capturing Direct Login Page...");
        await page.goto(`${baseUrl}/?page=P-06`);
        await page.waitForTimeout(2000);
        await takeScreenshot('02_direct_login_page.png', 0);

        // 10. Employee Dashboard (E-01) with Admin bypass
        console.log("Capturing Employee Dashboard (E-01)...");
        await page.goto(`${baseUrl}/?bypass=Admin&page=E-01`);
        await page.waitForTimeout(3000);
        await takeScreenshot('03_admin_view_employee_dashboard.png', 0);

        // 11. Admin Dashboard (A-01) with Admin bypass
        console.log("Capturing Admin Dashboard (A-01)...");
        await page.goto(`${baseUrl}/?bypass=Admin&page=A-01`);
        await page.waitForTimeout(3000);
        await takeScreenshot('04_admin_dashboard.png', 0);

        // 12. Rick Vance Sandbox / Customer Input (E-02a)
        console.log("Capturing Rick Vance Sandbox / Customer Input (E-02a)...");
        await page.goto(`${baseUrl}/?bypass=Employee&page=E-02a`);
        await page.waitForTimeout(3000);
        await takeScreenshot('05_rick_vance_sandbox.png', 0);

    } catch (err) {
        console.error("Encountered error during screenshot capturing sequence:", err);
    } finally {
        await browser.close();
        console.log("Screenshot workflow completed.");
    }
})();
