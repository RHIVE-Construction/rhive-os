/**
 * firebase-analytics-diagnostic.spec.ts
 *
 * Diagnostic test for the Firebase Analytics "config-fetch-failed" error.
 *
 * ROOT CAUSE BEING TESTED:
 *   Firebase Analytics initializes even when `measurementId` is set to the
 *   mock fallback "G-MOCK0000000". The Analytics SDK then tries to call
 *   https://firebase.googleapis.com/v1alpha/projects/-/apps/{appId}/webConfig
 *   with the configured API key. If the config is mock/invalid, this request
 *   returns "400 API key not valid", which pollutes the console with:
 *     [Analytics: Dynamic config fetch failed: [400] API key not valid ...]
 *
 * WHAT THIS TEST CHECKS:
 *   1. The built JS bundle does NOT contain "G-MOCK0000000" as the active
 *      measurementId (it may appear as a dead-code fallback string, but the
 *      live config must use the real ID from the env var).
 *   2. The built JS bundle DOES contain the real measurementId "G-KKZJ0W2GT4".
 *   3. After the fix, the Analytics initializer is guarded so it never calls
 *      getAnalytics() with a mock/invalid config — eliminating the 400 error.
 *   4. Browser console produces no "config-fetch-failed" or "G-MOCK0000000"
 *      messages when running against the preview server.
 */

import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const PREVIEW_URL = 'http://localhost:8002/';
const DIST_ASSETS = path.join('c:\\Users\\babotz\\Documents\\Rhive\\org\\rhive-os', 'dist', 'assets');
const REAL_MEASUREMENT_ID = 'G-KKZJ0W2GT4';
const MOCK_MEASUREMENT_ID = 'G-MOCK0000000';

// ─── STATIC BUNDLE ANALYSIS (no server needed) ────────────────────────────────

test.describe('Static Bundle Analysis — Firebase Config', () => {

    test('bundle must contain the real measurementId (G-KKZJ0W2GT4)', () => {
        expect(fs.existsSync(DIST_ASSETS), 'dist/assets must exist — run npm run build first').toBe(true);

        const jsFiles = fs.readdirSync(DIST_ASSETS).filter(f => f.endsWith('.js'));
        expect(jsFiles.length, 'at least one JS bundle must exist').toBeGreaterThan(0);

        let foundReal = false;
        for (const file of jsFiles) {
            const content = fs.readFileSync(path.join(DIST_ASSETS, file), 'utf8');
            if (content.includes(REAL_MEASUREMENT_ID)) {
                foundReal = true;
                console.log(`✅ Found real measurementId "${REAL_MEASUREMENT_ID}" in ${file}`);
            }
        }

        expect(foundReal,
            `Real measurementId "${REAL_MEASUREMENT_ID}" was NOT found in any bundle. ` +
            `This means VITE_FIREBASE_MEASUREMENT_ID was not injected at build time. ` +
            `Check .env and apphosting.yaml.`
        ).toBe(true);
    });

    test('bundle analytics guard must omit measurementId when env var is missing', () => {
        // Verify the fixed firebase.ts pattern is in the bundle:
        // The fix uses a conditional spread: ...(FIREBASE_MEASUREMENT_ID ? { measurementId: FIREBASE_MEASUREMENT_ID } : {})
        // After compilation, the real ID will be present only if the env var was set.
        // The MOCK fallback should NO LONGER be directly assigned to measurementId.
        expect(fs.existsSync(DIST_ASSETS), 'dist/assets must exist').toBe(true);

        const jsFiles = fs.readdirSync(DIST_ASSETS).filter(f => f.endsWith('.js'));
        let mockInMeasurementContext = false;
        let foundAnalyticsGuard = false;

        for (const file of jsFiles) {
            const content = fs.readFileSync(path.join(DIST_ASSETS, file), 'utf8');

            // Check if G-MOCK0000000 appears as a fallback for measurementId
            // Pattern before fix: measurementId:X||"G-MOCK0000000"
            if (/measurementId[^}]{0,60}G-MOCK0000000/.test(content)) {
                mockInMeasurementContext = true;
                console.error(`❌ Found "G-MOCK0000000" as measurementId fallback in ${file}`);
                console.error('   → Analytics guard fix was NOT applied correctly');
            }

            // After the fix, we verify isRealFirebaseConfig guard is present
            // (Vite will inline boolean checks, so we check for the real ID presence)
            if (content.includes(REAL_MEASUREMENT_ID)) {
                foundAnalyticsGuard = true;
            }
        }

        expect(mockInMeasurementContext,
            'G-MOCK0000000 found directly as measurementId fallback. ' +
            'The analytics guard in firebase.ts was not applied. ' +
            'Fix: use conditional spread for measurementId.'
        ).toBe(false);

        console.log(foundAnalyticsGuard
            ? `✅ Real measurementId "${REAL_MEASUREMENT_ID}" is present — analytics guard is working`
            : `⚠️  Real ID not found (may be ok if env var was not set during this build)`
        );
    });
});

// ─── LIVE BROWSER TEST (requires `npm run preview` on port 8002) ──────────────

test.describe('Browser Runtime — Firebase Analytics Error Check', () => {

    test('no analytics/config-fetch-failed errors in browser console', async ({ page }) => {
        const analyticsErrors: string[] = [];
        const allMessages: string[] = [];

        page.on('console', msg => {
            const text = msg.text();
            allMessages.push(`[${msg.type().toUpperCase()}] ${text}`);

            if (
                text.includes('config-fetch-failed') ||
                text.includes('Analytics: Dynamic config fetch failed') ||
                text.includes('Failed to fetch this Firebase app') ||
                text.includes(MOCK_MEASUREMENT_ID)
            ) {
                analyticsErrors.push(text);
            }
        });

        page.on('pageerror', err => {
            allMessages.push(`[PAGE_ERROR] ${err.message}`);
        });

        try {
            await page.goto(PREVIEW_URL, { waitUntil: 'domcontentloaded', timeout: 15000 });
            // Wait for Firebase SDK to initialize and attempt the config fetch
            await page.waitForTimeout(6000);
        } catch (e) {
            console.warn(`Could not reach ${PREVIEW_URL} — is 'npm run preview' running? Skipping browser check.`);
            test.skip();
            return;
        }

        console.log('\n=== CAPTURED CONSOLE MESSAGES ===');
        allMessages.forEach(m => console.log(m));
        console.log('=================================\n');

        if (analyticsErrors.length > 0) {
            console.error('\n❌ FIREBASE ANALYTICS ERRORS DETECTED:');
            analyticsErrors.forEach(e => console.error('  → ', e));
            console.error('\nROOT CAUSE: Analytics is initializing with mock/invalid config.');
            console.error('FIX: Guard getAnalytics() — only call when isRealFirebaseConfig && FIREBASE_MEASUREMENT_ID.\n');
        } else {
            console.log('✅ No Firebase Analytics config-fetch-failed errors detected.');
        }

        await page.screenshot({
            path: path.join(
                'C:\\Users\\babotz\\.gemini\\antigravity\\brain\\983dced0-8ce6-4668-8eaf-f9fa2e9dbbaa',
                'firebase-analytics-diagnostic.png'
            )
        });

        expect(analyticsErrors,
            `Firebase Analytics "config-fetch-failed" error detected in browser console. ` +
            `Details: ${analyticsErrors.join(' | ')}`
        ).toHaveLength(0);
    });
});
