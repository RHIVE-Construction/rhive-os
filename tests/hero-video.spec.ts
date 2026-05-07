import { test, expect } from '@playwright/test';
import fs from 'fs';

test('hero section video background', async ({ page }) => {
    await page.goto('http://localhost:3002/?page=P-00', { waitUntil: 'networkidle' });

    // Wait for the hero section to load
    const heroSection = page.locator('#hero');
    await expect(heroSection).toBeVisible();

    // 1. Verify the <video> element exists in the hero section
    const videoElement = heroSection.locator('video');
    await expect(videoElement).toHaveCount(1);

    // 2. Verify the src points to the correct file
    const sourceElement = videoElement.locator('source');
    await expect(sourceElement).toHaveAttribute('src', '/vidupload/TRADESHOW MARKETING VIDEO.mp4');

    // 3. Verify it is actively playing (not paused)
    await heroSection.evaluate(async () => {
        // slight delay to ensure the video has started playing
        await new Promise(resolve => setTimeout(resolve, 500));
    });
    const isPaused = await videoElement.evaluate((video: HTMLVideoElement) => video.paused);
    expect(isPaused).toBeFalsy();

    // 4. Verify 50% opacity black overlay is present
    const overlay = heroSection.locator('div.absolute.inset-0.bg-black\\/50');
    await expect(overlay).toBeVisible();

    // 5. Verify PlexusShape container is present
    const plexusContainer = heroSection.locator('div.absolute.inset-0.z-0.opacity-80.pointer-events-auto');
    await expect(plexusContainer).toBeVisible();

    // 6. Screenshot Proof
    await page.screenshot({ path: 'tests/hero-video-proof.png' });

    // copy the screenshot to the artifacts directory as well
    const artifactScreenshotBuffer = await page.screenshot();
    const artifactDir = 'C:\\Users\\mjrob\\.gemini\\antigravity\\brain\\2805966c-a6b8-4426-a96d-7aabf46aa6a2';
    fs.writeFileSync(`${artifactDir}\\hero-video-proof.png`, artifactScreenshotBuffer);
});
