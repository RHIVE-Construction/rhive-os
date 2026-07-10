const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, writeBatch, doc } = require('firebase/firestore');
const path = require('path');
const axios = require('axios');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID
};

const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1r5V12_Kp0928Y_SAdFhv8jI05mO9M40qzBAinlAF4Qc/export?format=csv&gid=0';

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
    return rows.filter(r => r.some(c => c !== ''));
}

function cleanPhone(phone) {
    if (!phone || phone === 'N/A') return '';
    let cleaned = String(phone).replace(/\D/g, '');
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
        cleaned = cleaned.substring(1);
    }
    return cleaned;
}

function cleanName(name) {
    if (!name || name === 'Unnamed Contact') return '';
    return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function run() {
    console.log("📥 Fetching Google Sheet contacts...");
    const response = await axios.get(SHEET_CSV_URL);
    const csvData = response.data;
    const csvRows = parseCSV(csvData);

    console.log(`CSV raw rows count: ${csvRows.length}`);
    let headers = csvRows[0];
    let dataRows = csvRows.slice(1);
    
    if (headers[0] !== 'Name' && headers[0] !== 'name') {
        const headerIndex = csvRows.findIndex(r => r[0] === 'Name' || r[0] === 'name');
        if (headerIndex !== -1) {
            headers = csvRows[headerIndex];
            dataRows = csvRows.slice(headerIndex + 1);
            console.log(`Found actual header at row index ${headerIndex}`);
        }
    }

    console.log(`Parsed ${dataRows.length} contacts from Google Sheet.`);

    // Map sheet contacts
    const sheetContacts = dataRows.map(row => {
        return {
            name: row[0] || '',
            phone: row[1] || '',
            email: row[2] || '',
            address: row[3] || '',
            source: row[4] || '',
            cleanPhone: cleanPhone(row[1]),
            cleanName: cleanName(row[0]),
            cleanEmail: (row[2] || '').toLowerCase().trim()
        };
    });

    console.log("Initializing Firebase...");
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    console.log("Fetching all Firestore contacts...");
    const contactsRef = collection(db, 'contacts');
    const snapshot = await getDocs(contactsRef);
    console.log(`Fetched ${snapshot.size} contacts from Firestore.`);

    const retainList = [];
    const deleteList = [];

    snapshot.forEach(doc => {
        const data = doc.data();
        const contactId = doc.id;

        const dbContact = {
            id: contactId,
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            full_name: data.full_name || data.name || `${data.first_name || ''} ${data.last_name || ''}`.trim(),
            phone: data.phone || data.mobile || '',
            email: data.email || ''
        };

        dbContact.cleanPhone = cleanPhone(dbContact.phone);
        dbContact.cleanName = cleanName(dbContact.full_name);
        dbContact.cleanEmail = dbContact.email.toLowerCase().trim();

        // Matching logic
        let match = null;

        // Try to find a match in the sheet contacts
        for (const sc of sheetContacts) {
            if (dbContact.cleanEmail && sc.cleanEmail && 
                !dbContact.cleanEmail.includes('@justcall.io') && 
                !sc.cleanEmail.includes('@justcall.io') &&
                dbContact.cleanEmail === sc.cleanEmail) {
                match = sc;
                break;
            }

            if (dbContact.cleanPhone && sc.cleanPhone && 
                dbContact.cleanPhone.length >= 7 && 
                sc.cleanPhone.length >= 7) {
                const dbLast10 = dbContact.cleanPhone.slice(-10);
                const scLast10 = sc.cleanPhone.slice(-10);
                if (dbLast10 === scLast10) {
                    match = sc;
                    break;
                }
            }

            if (dbContact.cleanName && sc.cleanName && dbContact.cleanName === sc.cleanName) {
                match = sc;
                break;
            }
        }

        if (match) {
            retainList.push({ dbContact, match });
        } else {
            deleteList.push(dbContact);
        }
    });

    console.log(`\nReady to delete ${deleteList.length} contacts from Firestore...`);
    
    // Batch deletes in groups of 400
    const BATCH_SIZE = 400;
    let deletedCount = 0;

    for (let i = 0; i < deleteList.length; i += BATCH_SIZE) {
        const batch = writeBatch(db);
        const chunk = deleteList.slice(i, i + BATCH_SIZE);

        chunk.forEach(contact => {
            const docRef = doc(db, 'contacts', contact.id);
            batch.delete(docRef);
        });

        console.log(`Committing deletion batch ${Math.floor(i / BATCH_SIZE) + 1} (${chunk.length} deletes)...`);
        await batch.commit();
        deletedCount += chunk.length;
    }

    console.log(`\n🎉 Pruning complete! Successfully deleted ${deletedCount} contacts.`);
}

run()
    .then(() => process.exit(0))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
