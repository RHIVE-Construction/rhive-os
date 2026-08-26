import { launchHeadlessRPA, captureHeadlessProof } from './rpa_runner.mjs';

async function verifyUniversalHeadless() {
    console.log('[Universal Headless RPA] Testing arbitrary /browser web task with --headless=new');
    const { context, page } = await launchHeadlessRPA();

    try {
        await page.goto('https://www.rhiveconstruction.com', { waitUntil: 'domcontentloaded', timeout: 25000 });
        await page.waitForTimeout(2000);

        const title = await page.title();
        console.log(`[Universal Headless RPA] Page Title: ${title}`);

        const proofPath = await captureHeadlessProof(page, 'proof_universal_headless_rhive.png');
        console.log(`[Universal Headless RPA] Proof saved to: ${proofPath}`);

        await context.close();
        return {
            status: 'SUCCESS',
            title,
            proof: proofPath
        };
    } catch (err) {
        console.error('[Universal Headless RPA] Error:', err);
        await context.close();
        return { status: 'ERROR', error: err.message };
    }
}

verifyUniversalHeadless().then(res => console.log(JSON.stringify(res, null, 2)));
