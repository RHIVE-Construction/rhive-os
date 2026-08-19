import { spawn } from 'child_process';
import { chromium } from 'playwright';
import http from 'http';

const artifactDir = "C:\\Users\\USER\\.gemini\\antigravity\\brain\\994cea94-22ec-4648-bf49-c1bf89e34b12";

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function checkServer() {
    return new Promise((resolve) => {
        http.get('http://localhost:3000', (res) => {
            resolve(res.statusCode === 200);
        }).on('error', () => {
            resolve(false);
        });
    });
}

(async () => {
    console.log("Starting local Vite development server...");
    // Use npx to spawn vite directly on port 3000
    const viteProcess = spawn('npx.cmd', ['vite', '--port', '3000'], {
        cwd: 'c:\\Users\\USER\\rhive-os',
        shell: true
    });

    viteProcess.stdout.on('data', (data) => {
        console.log(`[Vite Out]: ${data.toString().trim()}`);
    });

    viteProcess.stderr.on('data', (data) => {
        console.error(`[Vite Err]: ${data.toString().trim()}`);
    });

    // Wait for server to become responsive
    let isReady = false;
    for (let i = 0; i < 15; i++) {
        await wait(1000);
        isReady = await checkServer();
        if (isReady) {
            console.log("Local server is ready!");
            break;
        }
    }

    if (!isReady) {
        console.error("Vite server failed to start on port 3000 within 15 seconds.");
        viteProcess.kill();
        process.exit(1);
    }

    let browser;
    try {
        console.log("Launching headless browser...");
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({ viewport: { width: 1440, height: 950 } });
        const page = await context.newPage();

        console.log("Navigating to http://localhost:3000/ ...");
        await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
        await wait(3000); // Allow plexus background and animations to stabilize

        console.log("Taking homepage screenshot...");
        await page.screenshot({ path: `${artifactDir}\\1_homepage_preview.png` });
        console.log(`Saved 1_homepage_preview.png to ${artifactDir}`);

        console.log("Finding and filling AddressScanInput...");
        const input = page.locator('input[placeholder*="ADDRESS"], input[type="text"]').first();
        await input.waitFor({ timeout: 5000 });
        await input.fill('123 William St, New York, NY 10038');
        await wait(1000);

        console.log("Clicking Scan My Roof...");
        const scanBtn = page.locator('button:has-text("Scan My Roof")').first();
        await scanBtn.click();

        console.log("Waiting for navigation and geocoding...");
        await wait(5000); // Wait for P-12 navigation and mock data initialization

        console.log("Taking estimator map screenshot...");
        await page.screenshot({ path: `${artifactDir}\\2_estimator_map_preview.png` });
        console.log(`Saved 2_estimator_map_preview.png to ${artifactDir}`);

    } catch (err) {
        console.error("Error during screenshot capture:", err);
    } finally {
        if (browser) {
            await browser.close();
        }
        console.log("Stopping Vite server...");
        viteProcess.kill('SIGINT');
        // On Windows we might need taskkill if process tree persists
        spawn('taskkill', ['/F', '/T', '/PID', viteProcess.pid], { shell: true });
        console.log("Done.");
    }
})();
