/**
 * import_accounts.mjs
 * Fetches accounts data from Google Sheets CSV and imports into Firestore "accounts" collection.
 * Run: node scripts/import_accounts.mjs
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createRequire } from 'module';
import https from 'https';

const require = createRequire(import.meta.url);

// ── Firebase Admin Init ──────────────────────────────────────────────────────
// Uses Application Default Credentials (firebase-tools login sets this up)
if (!getApps().length) {
    initializeApp({ projectId: 'rhive-os' });
}
const db = getFirestore();

// ── Google Sheets CSV URL ────────────────────────────────────────────────────
const SHEET_ID = '1-0O8v6YYTfo2dyTBKnTWVAH3xSC2RHN9OlIePl7kVIA';
const GID      = '163617865';
const CSV_URL  = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;

// ── Helpers ──────────────────────────────────────────────────────────────────
function fetchCSV(url, redirectCount = 0) {
    return new Promise((resolve, reject) => {
        if (redirectCount > 10) { reject(new Error('Too many redirects')); return; }
        const lib = url.startsWith('https') ? https : require('http');
        lib.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; Node.js importer)',
                'Accept': 'text/csv,text/plain,*/*',
            }
        }, (res) => {
            if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
                fetchCSV(res.headers.location, redirectCount + 1).then(resolve).catch(reject);
                return;
            }
            if (res.statusCode !== 200) {
                reject(new Error(`HTTP ${res.statusCode} from ${url}`));
                return;
            }
            const chunks = [];
            res.on('data', chunk => chunks.push(chunk));
            res.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
        }).on('error', reject);
    });
}

/**
 * Minimal CSV parser that handles quoted fields (including embedded commas/newlines).
 */
function parseCSV(text) {
    const rows = [];
    let row = [];
    let field = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        const next = text[i + 1];

        if (inQuotes) {
            if (ch === '"' && next === '"') { field += '"'; i++; }
            else if (ch === '"') { inQuotes = false; }
            else { field += ch; }
        } else {
            if (ch === '"') { inQuotes = true; }
            else if (ch === ',') { row.push(field.trim()); field = ''; }
            else if (ch === '\r' && next === '\n') { row.push(field.trim()); rows.push(row); row = []; field = ''; i++; }
            else if (ch === '\n') { row.push(field.trim()); rows.push(row); row = []; field = ''; }
            else { field += ch; }
        }
    }
    if (field || row.length) { row.push(field.trim()); rows.push(row); }

    // Remove completely empty rows
    return rows.filter(r => r.some(c => c !== ''));
}

function toRecord(headers, values) {
    const obj = {};
    headers.forEach((h, i) => {
        const val = (values[i] || '').trim();
        if (val === '' || val === '0' && h !== 'Account Number') {
            // skip truly empty or zero-value non-meaningful fields
        } else {
            // camelCase the header key
            const key = h
                .replace(/\./g, '_')
                .replace(/[^a-zA-Z0-9_ ]/g, '')
                .trim()
                .replace(/\s+(.)/g, (_, c) => c.toUpperCase())
                .replace(/^(.)/, (_, c) => c.toLowerCase());
            obj[key] = val;
        }
    });
    return obj;
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
    console.log('📥 Fetching Google Sheets data...');
    const csv = await fetchCSV(CSV_URL);

    const rows = parseCSV(csv);
    if (rows.length < 2) {
        console.error('❌ No data rows found.');
        process.exit(1);
    }

    const headers = rows[0];
    const dataRows = rows.slice(1);
    console.log(`✅ Fetched ${dataRows.length} records. Headers: ${headers.length} columns.`);

    const collectionRef = db.collection('accounts');
    let success = 0;
    let skipped = 0;

    // Batch writes in groups of 500
    const BATCH_SIZE = 400;
    for (let i = 0; i < dataRows.length; i += BATCH_SIZE) {
        const batch = db.batch();
        const chunk = dataRows.slice(i, i + BATCH_SIZE);

        for (const row of chunk) {
            const record = toRecord(headers, row);
            if (!record.recordId && !record.accountName) { skipped++; continue; }

            // Use the zoho record ID as the Firestore doc ID for idempotency
            const docId = record.recordId || collectionRef.doc().id;
            const docRef = collectionRef.doc(docId);

            batch.set(docRef, {
                ...record,
                imported_at: new Date().toISOString(),
                source: 'google_sheets_import',
            }, { merge: true });

            success++;
        }

        await batch.commit();
        console.log(`  ✔ Committed batch ${Math.floor(i / BATCH_SIZE) + 1} (${Math.min(i + BATCH_SIZE, dataRows.length)} / ${dataRows.length})`);
    }

    console.log(`\n🎉 Import complete!`);
    console.log(`   ✅ Inserted/updated: ${success}`);
    console.log(`   ⏭  Skipped (empty):  ${skipped}`);
    console.log(`   📁 Collection: accounts`);
}

main().catch(err => {
    console.error('❌ Import failed:', err);
    process.exit(1);
});
