import { chromium } from 'playwright';

(async () => {
    console.log("Launching browser for screenshot suite...");
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();

    const screenshotsDir = 'C:\\Users\\mjrob\\.gemini\\antigravity\\brain\\a8707e63-7c28-4d28-8bd0-01caacf0c810';

    // 1. Public Homepage
    console.log("Capturing Public Homepage (P-00)...");
    await page.goto('http://localhost:3000/');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${screenshotsDir}\\01_public_homepage.png`, fullPage: true });

    // 2. Direct LoginPage
    console.log("Capturing Direct LoginPage (P-06)...");
    await page.goto('http://localhost:3000/?page=P-06');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${screenshotsDir}\\02_direct_login_page.png`, fullPage: true });

    // 3. Employee Dashboard (Admin Bypass)
    console.log("Capturing Admin view of Employee Dashboard (E-01)...");
    await page.goto('http://localhost:3000/?bypass=Admin&page=E-01');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${screenshotsDir}\\03_admin_view_employee_dashboard.png`, fullPage: true });

    // 4. Admin Dashboard (Admin Bypass)
    console.log("Capturing Admin Dashboard (A-01)...");
    await page.goto('http://localhost:3000/?bypass=Admin&page=A-01');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${screenshotsDir}\\04_admin_dashboard.png`, fullPage: true });

    // 5. Rick Vance Sandbox (Employee Bypass)
    console.log("Capturing Rick Vance Customer Input Sandbox (E-02a)...");
    await page.goto('http://localhost:3000/?bypass=Employee&page=E-02a');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${screenshotsDir}\\05_rick_vance_sandbox.png`, fullPage: true });

    await browser.close();
    console.log("Screenshot capturing completed successfully!");
})();
