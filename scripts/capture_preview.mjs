import { spawn } from 'child_process';
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const artifactDir = 'C:\\Users\\USER\\.gemini\\antigravity\\brain\\6c1f89d1-e30d-456e-8cbb-c1ed73687da7';

if (!fs.existsSync(artifactDir)) {
    fs.mkdirSync(artifactDir, { recursive: true });
}

async function run() {
    console.log('Starting Vite dev server...');
    const viteProcess = spawn('npx', ['vite', '--port', '3000'], {
        shell: true,
        stdio: 'pipe'
    });

    viteProcess.stdout.on('data', (data) => {
        console.log(`[Vite STDOUT] ${data.toString().trim()}`);
    });

    viteProcess.stderr.on('data', (data) => {
        console.error(`[Vite STDERR] ${data.toString().trim()}`);
    });

    // Wait 5 seconds for Vite to compile and become ready
    await new Promise(resolve => setTimeout(resolve, 5000));

    try {
        console.log('Launching Playwright...');
        const browser = await chromium.launch();
        const context = await browser.newContext({ viewport: { width: 1440, height: 1880 } });
        const page = await context.newPage();

        console.log('Navigating to Landing Page (P-00)...');
        await page.goto('http://localhost:3000/?page=P-00');
        await page.waitForTimeout(4000); // Wait for plexus and motion graphics
        console.log('Capturing P-00...');
        await page.screenshot({ path: path.join(artifactDir, 'homepage.png'), fullPage: false });

        console.log('Navigating to Landing Page V2 (P-00-V2)...');
        await page.goto('http://localhost:3000/?page=P-00-V2');
        await page.waitForTimeout(4000); // Wait for plexus and motion graphics
        console.log('Capturing P-00-V2...');
        await page.screenshot({ path: path.join(artifactDir, 'homepage_v2.png'), fullPage: false });

        console.log('Done capturing.');
        await browser.close();
    } catch (err) {
        console.error('Error during capture:', err);
    } finally {
        console.log('Stopping Vite...');
        // On Windows, child.kill might not kill the actual process if spawned with shell: true.
        // We'll run a taskkill command for vite to be safe.
        viteProcess.kill();
        const killProcess = spawn('taskkill', ['/F', '/T', '/PID', viteProcess.pid], { shell: true });
        killProcess.on('exit', () => {
            console.log('Vite process tree terminated.');
            process.exit(0);
        });
        
        // Fallback exit after 2 seconds
        setTimeout(() => process.exit(0), 2000);
    }
}

run();
