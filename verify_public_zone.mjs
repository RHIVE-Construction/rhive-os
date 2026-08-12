/**
 * verify_public_zone.mjs — Public Zone Separation Verification
 * Tests: /estimate-tool, /map, / (homepage), /?page=P-06 (login), /?page=E-01 (CRM gate)
 * Run: node verify_public_zone.mjs
 */
import { chromium } from 'playwright';
import fs from 'fs';

const BASE = 'http://localhost:3000';
const OUT  = './test_screenshots/public_zone';
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const TESTS = [
  {
    name: '01_estimate_tool',
    url:  `${BASE}/estimate-tool`,
    desc: 'Public /estimate-tool — RHIVE header + estimator, NO sidebar',
    expectPublicHeader: true,
    expectNoCrmSidebar: true,
  },
  {
    name: '02_map_page',
    url:  `${BASE}/map`,
    desc: 'Public /map — RHIVE header + BPM, NO sidebar',
    expectPublicHeader: true,
    expectNoCrmSidebar: true,
  },
  {
    name: '03_homepage',
    url:  `${BASE}/`,
    desc: 'App root — public homepage (P-00-V3) for unauthenticated user',
    expectPublicHeader: false,
    expectNoCrmSidebar: true,
  },
  {
    name: '04_login_page',
    url:  `${BASE}/?page=P-06`,
    desc: 'Login page — CRM entry gate, should show login form',
    expectPublicHeader: false,
    expectNoCrmSidebar: true,
  },
  {
    name: '05_crm_unauthenticated',
    url:  `${BASE}/?page=E-01`,
    desc: 'CRM unauthenticated — should show login, NOT E-01 dashboard',
    expectPublicHeader: false,
    expectNoCrmSidebar: true,
  },
  {
    name: '06_about_from_nav',
    url:  `${BASE}/?page=P-01`,
    desc: 'About page — linked from header nav',
    expectPublicHeader: false,
    expectNoCrmSidebar: true,
  },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];
  let allPassed = true;

  for (const test of TESTS) {
    const ctx  = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();

    // Suppress console noise
    page.on('console', () => {});

    try {
      console.log(`\n🔍 ${test.name}`);
      console.log(`   URL:  ${test.url}`);
      console.log(`   Desc: ${test.desc}`);

      await page.goto(test.url, { waitUntil: 'load', timeout: 20000 });
      await page.waitForTimeout(3000);

      const shot = `${OUT}/${test.name}.png`;
      await page.screenshot({ path: shot, fullPage: false });

      // Checks
      const hasPublicHeader = await page.$('#pub-header-theme-toggle') !== null;
      const hasCrmSidebar   = await page.$('nav[aria-label="Sidebar"], [data-sidebar]') !== null;
      const bodyLen         = await page.evaluate(() => document.body.innerText.trim().length);
      const isBlank         = bodyLen < 20;

      const pubHeaderOk = !test.expectPublicHeader || hasPublicHeader;
      const sidebarOk   = !hasCrmSidebar; // sidebar should NEVER appear on any of these unauthenticated pages
      const contentOk   = !isBlank;

      const passed = pubHeaderOk && sidebarOk && contentOk;
      if (!passed) allPassed = false;

      const icon = passed ? '✅' : '❌';
      console.log(`   ${icon} Passed: ${passed}`);
      console.log(`      Public header visible: ${hasPublicHeader} (expected: ${test.expectPublicHeader})`);
      console.log(`      CRM sidebar visible:   ${hasCrmSidebar}  (expected: false)`);
      console.log(`      Page has content:      ${!isBlank} (${bodyLen} chars)`);
      console.log(`      Screenshot: ${shot}`);

      results.push({ ...test, passed, hasPublicHeader, hasCrmSidebar, isBlank, bodyLen });

    } catch (err) {
      allPassed = false;
      console.log(`   ❌ ERROR: ${err.message}`);
      results.push({ ...test, passed: false, error: err.message });
    } finally {
      await ctx.close();
    }
  }

  await browser.close();

  console.log('\n══════════════════════════════════════════════');
  console.log('VERIFICATION RESULTS');
  console.log('══════════════════════════════════════════════');
  for (const r of results) {
    console.log(`${r.passed ? '✅' : '❌'} ${r.name}`);
  }
  console.log('──────────────────────────────────────────────');
  console.log(allPassed ? '✅ ALL CHECKS PASSED — safe to commit & deploy' : '❌ FAILURES DETECTED — fix before deploying');
  console.log(`Screenshots: ${OUT}`);

  process.exit(allPassed ? 0 : 1);
})();
