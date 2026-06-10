const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, addDoc } = require('firebase/firestore');
const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config({ path: path.join(__dirname, '.env') }); // Functions local .env

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID
};

const JUSTCALL_API_KEY = process.env.JUSTCALL_API_KEY;
const JUSTCALL_API_SECRET = process.env.JUSTCALL_API_SECRET;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(url, config, retries = 5, delayMs = 3000) {
    for (let i = 0; i < retries; i++) {
        try {
            await sleep(1000); // 1 second delay between every request to prevent 429
            return await axios.get(url, config);
        } catch (err) {
            if (err.response?.status === 429 && i < retries - 1) {
                console.warn(`Got 429 Rate Limit. Waiting ${delayMs}ms before retry...`);
                await sleep(delayMs);
                delayMs *= 2;
                continue;
            }
            throw err;
        }
    }
}

async function run() {
    if (!process.env.VITE_FIREBASE_API_KEY) {
        console.error("Missing Firebase API key in env");
        return;
    }
    if (!JUSTCALL_API_KEY || !JUSTCALL_API_SECRET) {
        console.error("Missing JustCall API credentials in env");
        return;
    }

    let app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // 1. Get existing Firebase Contacts
    console.log("Fetching existing Firebase contacts...");
    const contactsRef = collection(db, 'contacts');
    const contactsSnap = await getDocs(contactsRef);
    const existingPhones = new Set();
    
    contactsSnap.forEach(doc => {
        const data = doc.data();
        if (data.phone) existingPhones.add(String(data.phone).replace(/\D/g, ''));
        if (data.mobile) existingPhones.add(String(data.mobile).replace(/\D/g, ''));
        if (data.homePhone) existingPhones.add(String(data.homePhone).replace(/\D/g, ''));
        if (data.otherPhone) existingPhones.add(String(data.otherPhone).replace(/\D/g, ''));
    });
    console.log(`Found ${existingPhones.size} unique contact numbers in Firebase.`);

    // 2. Fetch all JustCall team contacts with rate-limiting
    console.log("Fetching all team-wide JustCall contacts (this will take a moment)...");
    let jcContacts = [];
    let page = 0;
    while (true) {
        try {
            const res = await fetchWithRetry('https://api.justcall.io/v2.1/contacts', {
                params: { page: page, per_page: 100, across_team: true },
                headers: {
                    'Authorization': `${JUSTCALL_API_KEY}:${JUSTCALL_API_SECRET}`,
                    'Accept': 'application/json'
                }
            });
            const pageContacts = res.data.data || [];
            if (pageContacts.length === 0) break;
            jcContacts.push(...pageContacts);
            console.log(`Fetched page ${page} (${pageContacts.length} contacts, total: ${jcContacts.length})...`);
            if (pageContacts.length < 100) break;
            page++;
        } catch (e) {
            console.error(`Error fetching page ${page}:`, e.message);
            break;
        }
    }
    console.log(`Retrieved ${jcContacts.length} team contacts from JustCall.`);

    // 3. Sync missing contacts to Firestore
    console.log("Syncing missing team contacts to Firestore...");
    let syncedCount = 0;
    for (const jc of jcContacts) {
        const rawPhone = jc.contact_number || jc.phone;
        if (!rawPhone) continue;
        const cleanPhone = String(rawPhone).replace(/\D/g, '');

        if (!existingPhones.has(cleanPhone)) {
            const now = new Date().toISOString();
            const contactData = {
                first_name: jc.first_name || '',
                last_name: jc.last_name || '',
                full_name: `${jc.first_name || ''} ${jc.last_name || ''}`.trim(),
                phone: rawPhone,
                email: jc.email || `${cleanPhone}@justcall.io`,
                address: jc.address || '',
                created_at: now,
                updated_at: now,
                _source: 'justcall-sync',
                recordStatus: 'Available',
                projectRole: 'Owner'
            };
            
            await addDoc(contactsRef, contactData);
            existingPhones.add(cleanPhone);
            syncedCount++;
            console.log(`Synced: ${contactData.full_name} (${rawPhone})`);
        }
    }

    console.log(`\n🎉 Sync completed! Added ${syncedCount} missing team contacts to Firestore.`);
}

run().then(() => process.exit(0)).catch(e => {
    console.error(e);
    process.exit(1);
});
