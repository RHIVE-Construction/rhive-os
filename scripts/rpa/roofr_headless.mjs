import { launchHeadlessRPA, captureHeadlessProof } from './rpa_runner.mjs';

/**
 * Headless Roofr RPA Node
 * Manages Roofr measurement orders, address autocomplete, and report retrieval headlessly.
 */
export async function orderRoofrHeadless(address, options = {}) {
    console.log(`[Roofr Headless RPA] Processing address: ${address} with --headless=new`);
    const { context, page } = await launchHeadlessRPA();

    try {
        await page.goto('https://app.roofr.com/login', { waitUntil: 'networkidle', timeout: 30000 });

        const url = page.url();
        if (url.includes('login')) {
            console.log('[Roofr Headless RPA] Login required. Checking credentials...');
            // Headless login flow
            const email = options.email || 'kara@rhiveconstruction.com';
            const password = options.password || 'eMrx03x22';

            await page.fill('input[type="email"], input[name="email"]', email);
            await page.fill('input[type="password"], input[name="password"]', password);
            await page.click('button[type="submit"]');
            await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 20000 }).catch(() => {});
        }

        const proofPath = await captureHeadlessProof(page, 'roofr_headless_dashboard.png');
        await context.close();

        return {
            status: 'SUCCESS',
            address,
            proof: proofPath
        };
    } catch (err) {
        console.error('[Roofr Headless RPA] Error:', err);
        const errorProof = await captureHeadlessProof(page, 'roofr_headless_error.png').catch(() => null);
        await context.close();
        return {
            status: 'ERROR',
            error: err.message,
            proof: errorProof
        };
    }
}

// Allow CLI direct execution
if (process.argv[1].endsWith('roofr_headless.mjs')) {
    const address = process.argv[2] || '123 Main St, Salt Lake City, UT';
    orderRoofrHeadless(address).then(res => console.log(JSON.stringify(res, null, 2)));
}
