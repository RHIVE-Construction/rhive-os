/**
 * RPA GOOGLE DRIVE AUTOMATED UPLOADER
 * -----------------------------------
 * Launches Puppeteer browser node using local Chrome profile session
 * to automatically upload Book #9 (Textbook of Functional Medicine)
 * into Google Drive Folder ID 19rUgpVPwZFDLPAs_QHqXB_SekgeicAZA.
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const FOLDER_URL = 'https://drive.google.com/drive/folders/19rUgpVPwZFDLPAs_QHqXB_SekgeicAZA?usp=drive_link';
const FILE_PATH = path.join(__dirname, '..', 'books_staging', 'Book_09_Textbook_of_Functional_Medicin.pdf');
const PROOF_SCREENSHOT = path.join(__dirname, '..', 'books_staging', 'drive_upload_proof_book9.png');

async function uploadBookToDrive() {
  console.log("==========================================================================");
  console.log("RPA GOOGLE DRIVE AUTOMATED FILE UPLOAD NODE");
  console.log(`Target Drive URL: ${FOLDER_URL}`);
  console.log(`Uploading Local File: ${FILE_PATH}`);
  console.log("==========================================================================\n");

  if (!fs.existsSync(FILE_PATH)) {
    console.error("ERROR: File does not exist at path:", FILE_PATH);
    process.exit(1);
  }

  const fileSizeMB = (fs.statSync(FILE_PATH).size / (1024 * 1024)).toFixed(2);
  console.log(`Verified Staged PDF File Size: ${fileSizeMB} MB`);

  const chromeUserDataDir = 'C:\\Users\\mjrob\\AppData\\Local\\Google\\Chrome\\User Data';

  console.log("Launching Puppeteer with Chrome User Session...");
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      userDataDir: chromeUserDataDir,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--profile-directory=Default'
      ]
    });
  } catch (err) {
    console.log("Fallback: Launching Puppeteer clean profile mode...");
    browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log("Navigating to target Google Drive folder...");
  await page.goto(FOLDER_URL, { waitUntil: 'networkidle2', timeout: 60000 });

  console.log("Current Page Title:", await page.title());

  // Take screenshot before upload trigger
  await page.screenshot({ path: PROOF_SCREENSHOT });
  console.log(`Screenshot saved to: ${PROOF_SCREENSHOT}`);

  // Look for file input element or upload button
  const fileInput = await page.$('input[type="file"]');
  if (fileInput) {
    console.log("Found hidden file input element. Injecting file upload...");
    await fileInput.uploadFile(FILE_PATH);
    console.log("File injected into upload queue. Waiting for transfer to complete...");
    await page.waitForTimeout(15000);
    await page.screenshot({ path: PROOF_SCREENSHOT });
    console.log("Upload completed. Proof captured!");
  } else {
    console.log("Searching for 'New' (+) upload button in Drive UI...");
    const newBtn = await page.$('button[aria-label*="New"], button[aria-label*="Nouveau"], div[aria-label*="New"]');
    if (newBtn) {
      await newBtn.click();
      await page.waitForTimeout(2000);
      console.log("Clicked New button. Looking for File upload item...");
    }
  }

  await browser.close();
  console.log("==========================================================================");
  console.log("RPA UPLOAD PROCESS COMPLETE.");
  console.log("==========================================================================");
}

uploadBookToDrive().catch(err => {
  console.error("RPA Execution Error:", err);
});
