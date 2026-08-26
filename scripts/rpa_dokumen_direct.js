/**
 * DOKUMEN.PUB RPA DIRECT CHROME DOWNLOADER
 * ----------------------------------------
 * Direct Chrome RPA browser interaction for Dokumen.pub search & download.
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const DOWNLOADS_DIR = 'C:\\Users\\mjrob\\Downloads';

const TARGETS = [
    { id: 2, title: 'Nutritional Biochemistry Tom Brody' },
    { id: 4, title: 'Integrative Medicine David Rakel' },
    { id: 5, title: 'The Mood Cure Julia Ross' },
    { id: 6, title: 'Textbook of Ayurveda Vasant Lad' },
    { id: 7, title: 'Medical Herbalism David Hoffmann' },
    { id: 8, title: 'Principles and Practice of Phytotherapy Simon Mills' },
    { id: 10, title: 'The Web That Has No Weaver Ted Kaptchuk' },
    { id: 11, title: 'Principles of Anatomy and Physiology Tortora' },
    { id: 12, title: 'The Biology of Belief Bruce Lipton' },
    { id: 13, title: 'Molecular Biology of the Cell Alberts' },
    { id: 14, title: 'Epigenetics David Allis' },
    { id: 15, title: 'Molecules of Emotion Candace Pert' },
    { id: 16, title: 'The Telomere Effect Elizabeth Blackburn' },
    { id: 17, title: 'Power Sex Suicide Mitochondria Nick Lane' },
    { id: 18, title: 'The Vital Question Nick Lane' },
    { id: 19, title: 'Lifespan Why We Age David Sinclair' },
    { id: 20, title: 'The Wahls Protocol Terry Wahls' },
    { id: 21, title: 'NASM Essentials of Personal Fitness Training' },
    { id: 22, title: 'NASM Essentials of Corrective Exercise Training' },
    { id: 23, title: 'NASM Essentials of Sports Nutrition' }
];

async function runDokumenRPA() {
    console.log("==========================================================================");
    console.log("DOKUMEN.PUB RPA DIRECT CHROME DOWNLOADER");
    console.log("==========================================================================\n");

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--no-sandbox', '--disable-setuid-sandbox', `--download.default_directory=${DOWNLOADS_DIR}`]
    });

    const page = await browser.newPage();
    const client = await page.target().createCDPSession();
    await client.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: DOWNLOADS_DIR });

    for (const item of TARGETS) {
        console.log(`[RPA TARGET] Searching Dokumen for '${item.title}'...`);
        try {
            await page.goto('https://dokumen.pub/', { waitUntil: 'domcontentloaded', timeout: 20000 });
            await new Promise(r => setTimeout(r, 1500));

            // Type query into search bar
            await page.type('input[name="q"]', item.title, { delay: 30 });
            await page.keyboard.press('Enter');

            await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => {});
            await new Promise(r => setTimeout(r, 2000));

            // Get first result link
            const firstResult = await page.evaluate(() => {
                const links = Array.from(document.querySelectorAll('a[href]'));
                const docLink = links.find(a => a.href.includes('.html') && !a.href.includes('search'));
                return docLink ? docLink.href : null;
            });

            if (firstResult) {
                console.log(`  Navigating to document page: ${firstResult}`);
                await page.goto(firstResult, { waitUntil: 'domcontentloaded', timeout: 20000 });
                await new Promise(r => setTimeout(r, 2000));

                const downloadUrl = await page.evaluate(() => {
                    const btns = Array.from(document.querySelectorAll('a[href]'));
                    const dl = btns.find(a => a.href.includes('/download/') || (a.innerText || '').toLowerCase().includes('download'));
                    return dl ? dl.href : null;
                });

                if (downloadUrl) {
                    console.log(`  Triggering RPA Download: ${downloadUrl}`);
                    await page.goto(downloadUrl, { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});
                    await new Promise(r => setTimeout(r, 5000));
                }
            } else {
                console.log(`  No search match found on Dokumen for '${item.title}'`);
            }
        } catch (e) {
            console.log(`  RPA Error: ${e.message}`);
        }
    }

    await browser.close();
}

runDokumenRPA().catch(console.error);
