import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  
  console.log('Navigating to P-01...');
  await page.goto('http://localhost:3001/?page=P-01');
  await page.waitForTimeout(2000);
  
  console.log('Navigating to P-00...');
  await page.goto('http://localhost:3001/?page=P-00');
  await page.waitForTimeout(2000);

  await browser.close();
})();
