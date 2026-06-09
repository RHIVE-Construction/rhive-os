import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  const BASE_URL = 'http://localhost:3000';
  const targetDir = 'C:\\Users\\mjrob\\.gemini\\antigravity\\brain\\a8707e63-7c28-4d28-8bd0-01caacf0c810\\test-proofs';

  // State 1: Match
  console.log("Navigating for State 1 (Match)...");
  await page.goto(`${BASE_URL}/?bypass=Employee&page=E-01`);
  await page.waitForTimeout(2000);
  
  // Open search modal
  await page.click('text="New Project"');
  await page.waitForTimeout(500);
  
  // Type Rick to match existing record
  await page.fill('#search-lookup-input', 'Rick');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${targetDir}\\state1_match.png` });
  console.log("State 1 captured.");

  // State 2: No Match
  console.log("Entering query for State 2 (No Match)...");
  await page.fill('#search-lookup-input', 'Gerry NonExistentPerson123');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${targetDir}\\state2_nomatch.png` });
  console.log("State 2 captured.");

  // State 3: Data Push
  console.log("Triggering Tab keydown to route to E-02a...");
  // Press Tab inside input
  await page.focus('#search-lookup-input');
  await page.keyboard.press('Tab');
  await page.waitForTimeout(2000);

  // Fill in required data to submit new record on E-02a
  console.log("Filling E-02a Intake details...");
  await page.fill('input[id="property-address-input"]', '1355 North State St');
  
  // Wait and click confirm on verification modal if it opens
  try {
      await page.waitForSelector('button:has-text("Confirm Target")', { timeout: 3000 });
      await page.click('button:has-text("Confirm Target")');
      await page.waitForTimeout(1000);
  } catch (e) {
      console.log("Verification modal did not open or wasn't clicked:", e.message);
  }

  await page.fill('input:near(label:has-text("First Name"))', 'Gerry');
  await page.fill('input:near(label:has-text("Last Name"))', 'NonExistentPerson123');
  await page.fill('input[placeholder="(000) 000-0000"]', '(801) 555-9876');
  await page.fill('input[type="email"]', 'gerry.test@gmail.com');
  await page.click('button:has-text("Save Contact")');
  await page.waitForTimeout(500);

  // Intent options
  await page.click('button:has-text("Replacement")');
  await page.waitForTimeout(300);
  await page.click('text=Need A Ballpark Price');
  await page.waitForTimeout(500);

  // Submit the form
  console.log("Submitting intake form...");
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);

  // Take screenshot of success state or redirect target
  await page.screenshot({ path: `${targetDir}\\state3_datapush.png` });
  console.log("State 3 captured.");

  await browser.close();
}

run().catch(err => {
  console.error("Capture sequence failed:", err);
  process.exit(1);
});
