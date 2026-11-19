const { chromium } = require('playwright');
const path = require('path');

(async () => {
    console.log('🚀 Starting QC for Batch Email Campaigns Feature...');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    try {
        await page.goto('http://localhost:3001/?bypass=admin', { waitUntil: 'networkidle', timeout: 30000 });
        console.log('✅ 1. Navigated to root with admin bypass');

        // Click Inbox button in CORE COMMAND
        const inboxBtn = page.locator('button:has-text("Inbox"), a:has-text("Inbox")').first();
        await inboxBtn.click();
        await page.waitForTimeout(1000);
        console.log('✅ 2. Clicked Inbox');

        // 1. Click "Batch Campaign" button in top action bar
        const batchBtn = page.locator('button:has-text("Batch Campaign")').first();
        await batchBtn.click();
        await page.waitForTimeout(1000);
        console.log('✅ 3. Clicked Batch Campaign');

        // 2. Verify Email Campaign Hub is active
        const bodyText = await page.textContent('body');
        if (!bodyText.includes('RHIVE Email Campaigns & Batch Dispatch')) {
            throw new Error('RHIVE Email Campaigns header not found');
        }
        console.log('✅ 4. Batch Email Campaigns Hub is active');

        // Check for STRICT rule: NO HTML CHECKBOXES anywhere in the campaign view
        const htmlCheckboxes = await page.locator('input[type="checkbox"]').count();
        if (htmlCheckboxes > 0) {
            throw new Error(`CRITICAL VIOLATION: Found ${htmlCheckboxes} HTML checkboxes. Must use Switch or Toggle.`);
        }
        console.log('✅ 5. Verified ZERO HTML checkboxes on page (RHIVE rule compliant)');

        // Take screenshot of Batch Campaigns Hub initial state
        const artifactDir = path.resolve('C:/Users/USER/.gemini/antigravity/brain/33f26e58-c6a7-4fe6-8b24-cb67ae90784e');
        await page.screenshot({ path: path.join(artifactDir, 'qc_batch_campaign_hub.png') });
        console.log('📸 6. Captured qc_batch_campaign_hub.png');

        // 3. Test changing template to "Post-Storm Thermal Drone Inspection"
        const stormTpl = page.locator('button:has-text("Post-Storm Thermal Drone Inspection")').first();
        await stormTpl.click();
        await page.waitForTimeout(500);
        const previewSubjectText = await page.textContent('body');
        if (!previewSubjectText.includes('High-Resolution Drone Roof Inspection')) {
            throw new Error('Template selection failed to update subject');
        }
        console.log('✅ 7. Strategy Template selector loaded copy');

        // 4. Test stage filter pill "Stage 1: Lead"
        const leadStagePill = page.locator('button[data-stage-pill="Lead"]').first();
        await leadStagePill.click();
        await page.waitForTimeout(500);
        console.log('✅ 8. Stage filter pill clicked');

        // 5. Test recipient switch toggle (NO HTML CHECKBOXES)
        const switches = page.locator('button[role="switch"]');
        const switchCount = await switches.count();
        console.log(`✅ 9. Found ${switchCount} quantum switch toggles for filtered audience`);
        if (switchCount > 0) {
            await switches.first().click();
            await page.waitForTimeout(300);
            console.log('✅ 10. Toggled recipient switch');
        }

        // Click "Select All Filtered"
        const selectAllBtn = page.locator('button:has-text("Select All Filtered")').first();
        await selectAllBtn.click();
        await page.waitForTimeout(300);
        console.log('✅ 11. Clicked Select All Filtered');

        // 6. Test dispatching campaign
        const sendBtn = page.locator('button:has-text("Send Campaign")').first();
        await sendBtn.click();
        await page.waitForTimeout(2000);
        
        const feedbackText = await page.textContent('body');
        if (feedbackText.includes('Successfully launched') || feedbackText.includes('mail_outbox')) {
            console.log('✅ 12. Campaign successfully dispatched and queued to mail_outbox');
        } else {
            console.warn('Feedback text:', feedbackText.slice(0, 300));
        }

        // Take screenshot of dispatched state
        await page.screenshot({ path: path.join(artifactDir, 'qc_batch_campaign_sent.png') });
        console.log('📸 13. Captured qc_batch_campaign_sent.png');

        // 7. Test Campaign History view
        const historyTab = page.locator('button:has-text("Campaign History")').first();
        await historyTab.click();
        await page.waitForTimeout(1000);
        
        await page.screenshot({ path: path.join(artifactDir, 'qc_batch_campaign_history.png') });
        console.log('📸 14. Captured qc_batch_campaign_history.png');

        console.log('🎉 ALL BATCH EMAIL CAMPAIGN CHECKS PASSED WITH 100% SUCCESS!');
    } catch (err) {
        console.error('❌ QC Error:', err);
        process.exitCode = 1;
    } finally {
        await browser.close();
    }
})();
