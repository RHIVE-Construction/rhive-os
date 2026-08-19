import { chromium } from 'playwright';

async function run() {
    console.log('Launching browser...');
    const browser = await chromium.launch();
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    console.log('Navigating to V3 Landing Page...');
    await page.goto('http://localhost:3000/?page=P-00-V3');
    await page.waitForTimeout(3000); // Wait for animations

    console.log('Capturing Hero Section with Split Buttons...');
    await page.screenshot({ path: 'C:\\Users\\USER\\.gemini\\antigravity\\brain\\6ac36afc-2dc8-48c6-bc73-3d59f0599a52\\v3_hero_split_buttons.png' });

    console.log('Clicking "Built by RHIVE.AI" button...');
    await page.click('text=Built by RHIVE.AI');
    await page.waitForTimeout(2000); // Wait for modal fade-in

    console.log('Capturing RHIVE AI Lightbox with fluid blob...');
    await page.screenshot({ path: 'C:\\Users\\USER\\.gemini\\antigravity\\brain\\6ac36afc-2dc8-48c6-bc73-3d59f0599a52\\v3_rhive_ai_lightbox.png' });

    console.log('Done.');
    await browser.close();
}

run().catch(console.error);
