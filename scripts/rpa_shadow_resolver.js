/**
 * RPA SHADOW & OPEN ACCESS MULTI-SOURCE RESOLVER
 * -----------------------------------------------
 * Uses Puppeteer stealth headless browser to locate direct PDF download URLs
 * across open archives and shadow mirrors for all remaining bibliography books.
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const STAGING_DIR = path.join(__dirname, '..', 'books_staging');
if (!fs.existsSync(STAGING_DIR)) {
  fs.mkdirSync(STAGING_DIR, { recursive: true });
}

const REMAINING_BOOKS = [
  { id: 2, title: "Nutritional Biochemistry", author: "Tom Brody" },
  { id: 3, title: "Advanced Nutrition and Human Metabolism", author: "Sareen Gropper" },
  { id: 4, title: "Integrative Medicine", author: "David Rakel" },
  { id: 5, title: "The Mood Cure", author: "Julia Ross" },
  { id: 6, title: "Textbook of Ayurveda Volume One", author: "Vasant Lad" },
  { id: 7, title: "Medical Herbalism", author: "David Hoffmann" },
  { id: 8, title: "Principles and Practice of Phytotherapy", author: "Simon Mills" },
  { id: 10, title: "The Web That Has No Weaver", author: "Ted Kaptchuk" },
  { id: 11, title: "Principles of Anatomy and Physiology", author: "Gerard Tortora" },
  { id: 12, title: "The Biology of Belief", author: "Bruce Lipton" },
  { id: 13, title: "Molecular Biology of the Cell", author: "Bruce Alberts" },
  { id: 14, title: "Epigenetics", author: "C. David Allis" },
  { id: 15, title: "Molecules of Emotion", author: "Candace Pert" },
  { id: 16, title: "The Telomere Effect", author: "Elizabeth Blackburn" },
  { id: 17, title: "Power Sex Suicide Mitochondria", author: "Nick Lane" },
  { id: 18, title: "The Vital Question", author: "Nick Lane" },
  { id: 19, title: "Lifespan Why We Age", author: "David Sinclair" },
  { id: 20, title: "The Wahls Protocol", author: "Terry Wahls" }
];

async function resolveBook(browser, book) {
  console.log(`[RPA WORKER] Searching mirror candidate streams for Book #${book.id}: '${book.title}' by ${book.author}...`);
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  // Search Anna's Archive / LibGen mirrors via DuckDuckGo HTML
  const query = encodeURIComponent(`"filetype:pdf" "${book.title}" "${book.author}"`);
  const searchUrl = `https://html.duckduckgo.com/html/?q=${query}`;

  try {
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a.result__url'))
        .map(a => a.href)
        .filter(h => h && (h.includes('.pdf') || h.includes('download') || h.includes('dokumen') || h.includes('archive')));
    });

    if (links.length > 0) {
      console.log(`  >>> FOUND ${links.length} potential stream candidates for Book #${book.id}: ${links[0]}`);
      await page.close();
      return { id: book.id, title: book.title, candidate_url: links[0], status: 'CANDIDATE_FOUND' };
    }
  } catch (err) {
    console.log(`  [SEARCH ERR] Book #${book.id}: ${err.message}`);
  }

  await page.close();
  return { id: book.id, title: book.title, status: 'MIRROR_DISCOVERY_PENDING' };
}

async function runRPAPipeline() {
  console.log("==========================================================================");
  console.log("LAUNCHING PUPPETEER SHADOW & OPEN ACCESS MULTI-SOURCE RESOLVER");
  console.log("==========================================================================\n");

  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
  });

  const results = [];
  for (const book of REMAINING_BOOKS) {
    const res = await resolveBook(browser, book);
    results.push(res);
  }

  await browser.close();

  console.log("\n==========================================================================");
  console.log("RPA SEARCH PASS COMPLETE. Results summarized.");
  console.log("==========================================================================");

  fs.writeFileSync(
    path.join(STAGING_DIR, 'rpa_discovery_results.json'),
    JSON.stringify(results, null, 2)
  );
}

runRPAPipeline().catch(err => console.error("RPA Pipeline Failure:", err));
