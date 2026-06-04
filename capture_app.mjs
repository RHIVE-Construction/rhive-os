import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();

    const baseDir = "C:\\Users\\mjrob\\.gemini\\antigravity\\brain\\c52cd9ba-8b82-476d-af65-f94907686b52";

    console.log("Navigating to public homepage...");
    await page.goto('http://localhost:3001/');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${baseDir}\\1_Public_Homepage.png` });

    console.log("Opening website navigation drawer...");
    await page.click('text="Website Menu"');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${baseDir}\\2_Public_Menu_Drawer.png` });

    // Close the drawer by clicking backdrop
    await page.click('div.fixed.inset-0.bg-black\\/60');
    await page.waitForTimeout(500);

    console.log("Navigating to login page via avatar click...");
    const avatarBtn = page.locator('button[title="Developer Quick Login"]');
    await avatarBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${baseDir}\\3_Avatar_Dropdown_Guest.png` });

    // Click standard login in the dropdown
    await page.click('text="Standard Login"');
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${baseDir}\\4_Login_Page_Bypass.png` });

    console.log("Logging in as Admin via developer bypass...");
    // Let's click the 'Admin' button in the Quick Bypass Panel
    await page.click('button:has-text("Admin")');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${baseDir}\\5_Admin_Dashboard.png` });

    console.log("Opening admin profile switcher...");
    const adminAvatar = page.locator('button[title^="Profile:"]');
    await adminAvatar.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${baseDir}\\6_Admin_Profile_Dropdown.png` });

    // Close it
    await adminAvatar.click();
    await page.waitForTimeout(500);

    console.log("Logging out and logging in as Customer...");
    // Open dropdown again
    await adminAvatar.click();
    await page.waitForTimeout(500);
    // Switch role to Customer
    await page.click('text="Customer Portal"');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${baseDir}\\7_Customer_Portal.png` });

    await browser.close();
    console.log("Finished successfully!");
})();
