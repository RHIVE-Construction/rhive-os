import { chromium } from 'playwright';

(async () => {
    try {
        console.log('Launching browser...');
        const browser = await chromium.launch();
        const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
        const page = await context.newPage();
        
        // 1. Capture Admin Dashboard
        console.log('Navigating to Admin Dashboard (A-01)...');
        await page.goto('http://localhost:3002/?bypass=Admin&page=A-01');
        await page.waitForTimeout(5000); // Wait for rendering & animations
        
        const pathAdmin = 'C:\\Users\\mjrob\\.gemini\\antigravity\\brain\\a71c617f-8269-440b-92c8-a432fd65d469\\admin_dashboard.png';
        console.log('Capturing Admin Dashboard screenshot...');
        await page.screenshot({ path: pathAdmin });
        
        // 2. Capture Employee Homepage as Admin
        console.log('Navigating to Employee Homepage (E-01)...');
        await page.goto('http://localhost:3002/?bypass=Admin&page=E-01');
        await page.waitForTimeout(5000);
        
        const pathEmployee = 'C:\\Users\\mjrob\\.gemini\\antigravity\\brain\\a71c617f-8269-440b-92c8-a432fd65d469\\employee_dashboard.png';
        console.log('Capturing Employee Homepage screenshot...');
        await page.screenshot({ path: pathEmployee });
        
        console.log('Screenshots captured successfully.');
        await browser.close();
    } catch (err) {
        console.error('Error taking screenshots:', err);
        process.exit(1);
    }
})();
