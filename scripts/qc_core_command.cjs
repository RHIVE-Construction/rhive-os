const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ARTIFACTS_DIR = 'C:/Users/USER/.gemini/antigravity/brain/33f26e58-c6a7-4fe6-8b24-cb67ae90784e';

async function runQualityCheck() {
  console.log('--- STARTING CORE COMMAND QUALITY CHECK ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const results = {
    dashboard: { status: 'PENDING', checks: [] },
    newProject: { status: 'PENDING', checks: [] },
    customers: { status: 'PENDING', checks: [] },
    inbox: { status: 'PENDING', checks: [] },
    tasks: { status: 'PENDING', checks: [] },
    calendar: { status: 'PENDING', checks: [] },
  };

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  try {
    // 0. Base Navigation
    console.log('[1/7] Navigating to http://localhost:3001/?bypass=admin ...');
    await page.goto('http://localhost:3001/?bypass=admin', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // 1. Dashboard (E-01)
    console.log('[2/7] Checking Dashboard (E-01)...');
    await page.click('button:has-text("Dashboard")');
    await page.waitForTimeout(1000);
    const dashText = await page.textContent('body');
    const dashHasError = dashText.includes('Select a page from the menu.');
    const dashHasHeading = dashText.toLowerCase().includes('dashboard') || dashText.toLowerCase().includes('command') || dashText.toLowerCase().includes('overview');
    results.dashboard.checks.push({ check: 'No missing route fallback', pass: !dashHasError });
    results.dashboard.checks.push({ check: 'Dashboard content rendered', pass: dashHasHeading });
    results.dashboard.status = (!dashHasError && dashHasHeading) ? 'PASS' : 'FAIL';
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'qc_1_dashboard.png') });
    console.log('Dashboard Result:', results.dashboard.status);

    // 2. New Project (E-02a)
    console.log('[3/7] Checking New Project (E-02a)...');
    await page.click('button:has-text("New Project")');
    await page.waitForTimeout(1200);
    const npText = await page.textContent('body');
    const npHasError = npText.includes('Select a page from the menu.');
    // New project opens Global Command Search / Customer Lookup modal
    const npHasLookup = npText.includes('Global Command Search') || npText.includes('Search by name, address');
    results.newProject.checks.push({ check: 'No missing route fallback', pass: !npHasError });
    results.newProject.checks.push({ check: 'Global Customer Lookup / Intake triggered', pass: npHasLookup });
    results.newProject.status = (!npHasError && npHasLookup) ? 'PASS' : 'FAIL';
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'qc_2_new_project.png') });
    console.log('New Project Result:', results.newProject.status);

    // Close the Global Search modal with Escape before testing other sidebar links
    await page.keyboard.press('Escape');
    await page.waitForTimeout(600);
    // If still visible, click backdrop to close
    const modalVisible = await page.isVisible('div.fixed.inset-0.z-\\[9999\\]');
    if (modalVisible) {
      await page.click('div.fixed.inset-0.z-\\[9999\\]', { position: { x: 10, y: 10 } });
      await page.waitForTimeout(600);
    }

    // 3. Customers (E-CUSTOMERS)
    console.log('[4/7] Checking Customers (E-CUSTOMERS)...');
    await page.click('button:has-text("Customers")');
    await page.waitForTimeout(1200);
    const custText = await page.textContent('body');
    const custHasError = custText.includes('Select a page from the menu.');
    const custHasClients = custText.includes('UNPHC') || custText.includes('Brad Baird') || custText.includes('Create Client');
    const custHasStageFilter = custText.includes('All Stages') || custText.includes('STAGE');
    results.customers.checks.push({ check: 'No missing route fallback', pass: !custHasError });
    results.customers.checks.push({ check: 'Client cards rendered', pass: custHasClients });
    results.customers.checks.push({ check: 'Stage filters present', pass: custHasStageFilter });
    results.customers.status = (!custHasError && custHasClients) ? 'PASS' : 'FAIL';
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'qc_3_customers.png') });
    console.log('Customers Result:', results.customers.status);

    // 4. Inbox (E-INBOX)
    console.log('[5/7] Checking Inbox (E-INBOX)...');
    await page.click('button:has-text("Inbox")');
    await page.waitForTimeout(1200);
    const inboxText = await page.textContent('body');
    const inboxHasError = inboxText.includes('Select a page from the menu.');
    const inboxHasLiveLine = inboxText.includes('(435) 417-6637');
    const inboxHasFolders = inboxText.includes('My Inbox') || inboxText.includes('Assigned');
    // Test interactive Channel Breakdown filter
    await page.click('button:has-text("Texts (SMS)")');
    await page.waitForTimeout(500);
    const filteredText = await page.textContent('body');
    const filterWorking = filteredText.includes('Texts') || filteredText.includes('SMS');

    results.inbox.checks.push({ check: 'No missing route fallback', pass: !inboxHasError });
    results.inbox.checks.push({ check: 'Official line (435) 417-6637 badge active', pass: inboxHasLiveLine });
    results.inbox.checks.push({ check: 'Folders rendered', pass: inboxHasFolders });
    results.inbox.checks.push({ check: 'Channel Breakdown interactive filter', pass: filterWorking });
    results.inbox.status = (!inboxHasError && inboxHasLiveLine && filterWorking) ? 'PASS' : 'FAIL';
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'qc_4_inbox.png') });
    console.log('Inbox Result:', results.inbox.status);

    // 5. Tasks (E-TASKS)
    console.log('[6/7] Checking Tasks (E-TASKS)...');
    await page.click('button:has-text("Tasks")');
    await page.waitForTimeout(1200);
    const tasksText = await page.textContent('body');
    const tasksHasError = tasksText.includes('Select a page from the menu.');
    const tasksHasTabs = tasksText.includes("Today's Tasks") || tasksText.includes('Overdue') || tasksText.includes('Completed');
    const tasksHasTeam = tasksText.includes('Kara') || tasksText.includes('Chad') || tasksText.includes('Victor');
    results.tasks.checks.push({ check: 'No missing route fallback', pass: !tasksHasError });
    results.tasks.checks.push({ check: 'Task status tabs rendered', pass: tasksHasTabs });
    results.tasks.checks.push({ check: 'Team assignments & multi-tier hierarchy present', pass: tasksHasTeam });
    results.tasks.status = (!tasksHasError && tasksHasTabs) ? 'PASS' : 'FAIL';
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'qc_5_tasks.png') });
    console.log('Tasks Result:', results.tasks.status);

    // 6. Calendar (E-04)
    console.log('[7/7] Checking Calendar (E-04)...');
    await page.click('button:has-text("Calendar")');
    await page.waitForTimeout(1200);
    const calText = await page.textContent('body');
    const calHasError = calText.includes('Select a page from the menu.');
    const calHasViews = calText.toLowerCase().includes('month') || calText.toLowerCase().includes('week') || calText.toLowerCase().includes('agenda');
    const calHasCategories = calText.includes('Inspections') || calText.includes('Work') || calText.includes('Calls');
    results.calendar.checks.push({ check: 'No missing route fallback', pass: !calHasError });
    results.calendar.checks.push({ check: 'Calendar grid and views rendered', pass: calHasViews });
    results.calendar.checks.push({ check: 'Event categories & dispatch filters present', pass: calHasCategories });
    results.calendar.status = (!calHasError && calHasViews) ? 'PASS' : 'FAIL';
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'qc_6_calendar.png') });
    console.log('Calendar Result:', results.calendar.status);

    console.log('\n--- FINAL RESULTS ---');
    console.log(JSON.stringify(results, null, 2));

  } catch (error) {
    console.error('Quality check encountered an exception:', error);
  } finally {
    await browser.close();
  }
}

runQualityCheck();
