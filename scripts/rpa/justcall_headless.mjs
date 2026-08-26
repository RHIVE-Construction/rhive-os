import { launchHeadlessRPA, captureHeadlessProof } from './rpa_runner.mjs';
import { cloneChromeSessionToHeadless } from './sync_chrome_session.mjs';

/**
 * Headless JustCall RPA Node
 * Captures Voice Agents list, settings, and workflows headlessly without GUI interference.
 */
export async function getJustCallAgentListScreenshot() {
    console.log('[JustCall Headless RPA] Syncing session and launching headless Chromium...');
    cloneChromeSessionToHeadless();

    const { context, page } = await launchHeadlessRPA();

    try {
        console.log('[JustCall Headless RPA] Navigating to Voice Agent dashboard...');
        await page.goto('https://app.justcall.io/apex/voice-agent', { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(4000);

        const currentUrl = page.url();
        console.log(`[JustCall Headless RPA] Current URL: ${currentUrl}`);

        const proofPath = await captureHeadlessProof(page, 'proof_justcall_headless_agent_list.png');
        console.log(`[JustCall Headless RPA] HD Headless Proof captured: ${proofPath}`);

        await context.close();
        return {
            status: 'SUCCESS',
            url: currentUrl,
            proof: proofPath
        };
    } catch (err) {
        console.error('[JustCall Headless RPA] Error:', err);
        const errorProof = await captureHeadlessProof(page, 'proof_justcall_headless_agent_list_err.png').catch(() => null);
        await context.close();
        return {
            status: 'ERROR',
            error: err.message,
            proof: errorProof
        };
    }
}

if (process.argv[1].endsWith('justcall_headless.mjs')) {
    getJustCallAgentListScreenshot().then(res => console.log(JSON.stringify(res, null, 2)));
}
