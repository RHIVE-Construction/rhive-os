const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function testDokumen() {
  console.log("Launching Puppeteer Stealth Browser Node...");
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  const testUrl = 'https://dokumen.pub/molecular-biology-of-the-cell-6th-edition-9780815344322-0815344325.html';
  console.log(`Navigating to: ${testUrl}`);
  
  await page.goto(testUrl, { waitUntil: 'networkidle2', timeout: 30000 });

  // Locate download button
  const dlSelector = 'a[href*="/download/"]';
  const downloadLink = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    return el ? el.href : null;
  }, dlSelector);

  console.log(`[PUPPETEER RESULT] Direct Download Link: ${downloadLink}`);
  await browser.close();
}

testDokumen().catch(err => console.error("Puppeteer Error:", err));
