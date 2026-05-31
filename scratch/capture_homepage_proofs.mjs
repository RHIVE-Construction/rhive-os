import { chromium } from 'playwright';
import path from 'path';

(async () => {
    console.log("Launching browser...");
    const browser = await chromium.launch();
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();

    const baseDir = "C:\\Users\\mjrob\\.gemini\\antigravity\\brain\\a8707e63-7c28-4d28-8bd0-01caacf0c810";
    
    // We confirmed dev server is on port 3002
    console.log("Navigating to public homepage on port 3002...");
    await page.goto('http://localhost:3002/');
    await page.waitForTimeout(3000); // Allow load & GSAP intro to finish
    
    console.log("Capturing Public Homepage P-00...");
    await page.screenshot({ path: `${baseDir}\\01_public_homepage.png` });

    console.log("Opening P-07 Quick-Login Lightbox...");
    await page.click('button:has-text("Login")');
    await page.waitForTimeout(1500); // Wait for transition
    await page.screenshot({ path: `${baseDir}\\02_quick_login_lightbox.png` });
    
    console.log("Closing Login Lightbox via coordinate click...");
    await page.mouse.click(10, 10);
    await page.waitForTimeout(1500); // Allow exit transition

    console.log("Opening P-02 Founders Card Lightbox...");
    await page.click('button:has-text("RHIVE AI")');
    await page.waitForTimeout(1500); // Wait for transition
    await page.screenshot({ path: `${baseDir}\\03_founders_card_lightbox.png` });

    console.log("Closing Founders Lightbox via coordinate click...");
    await page.mouse.click(10, 10);
    await page.waitForTimeout(1500); // Allow exit transition

    console.log("Opening P-04 Zero Surprises Process Lightbox...");
    await page.click('button:has-text("10-Stage \'Zero Surprises\' Process")');
    await page.waitForTimeout(1500); // Wait for transition
    await page.screenshot({ path: `${baseDir}\\04_process_lightbox.png` });

    console.log("Closing Process Lightbox via coordinate click...");
    await page.mouse.click(10, 10);
    await page.waitForTimeout(1500); // Allow exit transition

    console.log("Opening P-01 Roof Configurator / Estimate Lightbox...");
    await page.click('button:has-text("Scan My Roof")');
    await page.waitForTimeout(1500); // Wait for transition
    await page.screenshot({ path: `${baseDir}\\05_roof_configurator_lightbox.png` });

    console.log("Closing Configurator Lightbox via coordinate click...");
    await page.mouse.click(10, 10);
    await page.waitForTimeout(1500); // Allow exit transition

    console.log("Opening System Scan Left Drawer Panel via event dispatch...");
    await page.evaluate(() => {
        window.dispatchEvent(new CustomEvent('open-estimator'));
    });
    await page.waitForTimeout(1500); // Wait for sliding panel
    await page.screenshot({ path: `${baseDir}\\06_system_scan_panel.png` });

    console.log("Clicking Active Leak inside System Scan panel to open P-06 Lightbox...");
    await page.click('button:has-text("ACTIVE LEAK // EMERGENCY")');
    await page.waitForTimeout(1500); // Wait for transition
    await page.screenshot({ path: `${baseDir}\\07_emergency_triage_lightbox.png` });

    console.log("Closing Emergency Triage Lightbox via coordinate click...");
    await page.mouse.click(10, 10);
    await page.waitForTimeout(1500); // Allow exit transition

    console.log("Opening Ask Hunni Chat Widget Panel...");
    // The floating action button has the text HUNNI in it or contains the MessageSquare icon.
    // Let's select it by text
    await page.click('button:has-text("HUNNI")');
    await page.waitForTimeout(1500); // Wait for sliding panel
    await page.screenshot({ path: `${baseDir}\\08_hunni_chat_panel.png` });

    console.log("Done capturing all proofs!");
    await browser.close();
})();
