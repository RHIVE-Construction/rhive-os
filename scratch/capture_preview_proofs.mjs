import { chromium } from 'playwright';

(async () => {
    try {
        console.log('Launching browser...');
        const browser = await chromium.launch();
        const context = await browser.newContext({ viewport: { width: 1440, height: 950 } });
        const page = await context.newPage();

        const baseDir = "C:\\Users\\USER\\.gemini\\antigravity\\brain\\729be144-7409-43a4-ac41-d39b89710f96";

        console.log('1. Capturing Homepage Hero & Tab Inputs...');
        await page.goto('http://localhost:3000/');
        await page.waitForTimeout(3000);
        await page.screenshot({ path: `${baseDir}\\1_Homepage_Hero_Estimate.png` });

        // Switch to Quote tab
        console.log('Switching to Quote tab...');
        await page.click('text="Certified Quote"');
        await page.waitForTimeout(1000);
        await page.screenshot({ path: `${baseDir}\\2_Homepage_Hero_Quote_Watermark.png` });

        // Open About Lightbox
        console.log('Opening About Lightbox on Homepage...');
        await page.evaluate(() => {
            window.dispatchEvent(new CustomEvent('v3-open-lightbox', { detail: 'about' }));
        });
        await page.waitForTimeout(1500);
        await page.screenshot({ path: `${baseDir}\\3_Homepage_About_Lightbox.png` });

        // Close About Lightbox
        await page.click('text="Close Mission Briefing"');
        await page.waitForTimeout(500);

        // Open Process Lightbox
        console.log('Opening Process Lightbox on Homepage...');
        await page.evaluate(() => {
            window.dispatchEvent(new CustomEvent('v3-open-lightbox', { detail: 'process' }));
        });
        await page.waitForTimeout(1500);
        await page.screenshot({ path: `${baseDir}\\4_Homepage_Process_Lightbox.png` });

        // Close Process Lightbox
        await page.click('text="Dismiss Overview"');
        await page.waitForTimeout(500);

        // Open Floating Estimator
        console.log('Opening Floating Estimator to Lead step...');
        await page.evaluate(() => {
            window.dispatchEvent(new CustomEvent('open-estimator', { detail: { address: '525 Aspen Meadow Dr, Logan, UT' } }));
        });
        await page.waitForTimeout(1500);
        // We are on specs step, click Generate Range
        await page.click('button:has-text("Generate Range")');
        await page.waitForTimeout(1000);
        await page.screenshot({ path: `${baseDir}\\5_FloatingEstimator_LeadStep.png` });

        // Close Estimator
        await page.reload();
        await page.waitForTimeout(2000);

        // Navigate to dedicated pages
        console.log('Navigating to About Us page...');
        await page.goto('http://localhost:3000/?page=P-01');
        await page.waitForTimeout(3000);
        await page.screenshot({ path: `${baseDir}\\6_AboutUs_Page.png` });

        console.log('Navigating to Our Process page...');
        await page.goto('http://localhost:3000/?page=P-03');
        await page.waitForTimeout(3000);
        await page.screenshot({ path: `${baseDir}\\7_OurProcess_Page.png` });

        console.log('Navigating to Contact page...');
        await page.goto('http://localhost:3000/?page=P-05');
        await page.waitForTimeout(3000);
        await page.screenshot({ path: `${baseDir}\\8_Contact_Page.png` });

        console.log('Done capturing all previews.');
        await browser.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
