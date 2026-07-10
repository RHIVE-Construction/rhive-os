const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config({ path: path.join(__dirname, '.env') }); // For JUSTCALL keys usually kept in functions/.env

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

async function run() {
    if (!process.env.VITE_FIREBASE_API_KEY) {
        console.error("Missing Firebase API key in env");
        return;
    }
    if (!JUSTCALL_API_KEY || !JUSTCALL_API_SECRET) {
        console.error("Missing JustCall API keys in env");
        return;
    }

    let app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // 1. Get Firebase Contacts
    console.log("Fetching Firebase contacts...");
    const contactsRef = collection(db, 'contacts');
    const contactsSnap = await getDocs(contactsRef);
    const firebasePhones = [];
    contactsSnap.forEach(doc => {
        const data = doc.data();
        if (data.phone) firebasePhones.push(String(data.phone).replace(/\D/g, ''));
        if (data.mobile) firebasePhones.push(String(data.mobile).replace(/\D/g, ''));
        if (data.homePhone) firebasePhones.push(String(data.homePhone).replace(/\D/g, ''));
        if (data.otherPhone) firebasePhones.push(String(data.otherPhone).replace(/\D/g, ''));
    });
    console.log("Found " + firebasePhones.length + " contacts in Firebase (with valid phone numbers).");

    // 2. Get Justcall Contacts (All Pages)
    console.log("Fetching all Justcall contacts...");
    let jcContacts = [];
    let page = 0;
    while (true) {
        try {
            const jcResponse = await axios.get('https://api.justcall.io/v2.1/contacts', {
                params: { page: page, limit: 50, across_team: true },
                headers: {
                    'Authorization': `${JUSTCALL_API_KEY}:${JUSTCALL_API_SECRET}`,
                    'Accept': 'application/json'
                }
            });
            const pageContacts = jcResponse.data.data || [];
            if (pageContacts.length === 0) {
                break;
            }
            jcContacts.push(...pageContacts);
            console.log(`Fetched page ${page} (${pageContacts.length} contacts)...`);
            if (pageContacts.length < 50) {
                break;
            }
            page++;
        } catch (e) {
            console.error(`Justcall API Error on page ${page}:`, e.message);
            break;
        }
    }
    console.log(`Total Justcall contacts retrieved: ${jcContacts.length}`);

    const missingInFirebase = [];
    jcContacts.forEach(jc => {
        let rawPhone = jc.contact_number || jc.phone;
        if (!rawPhone) return;
        let phoneStr = String(rawPhone).replace(/\D/g, '');
        // Loose match (e.g. 10 digits match) to avoid +1 prefix issues
        let matched = false;
        for (let fp of firebasePhones) {
             if (fp === phoneStr || fp.includes(phoneStr) || phoneStr.includes(fp)) {
                 matched = true;
                 break;
              }
        }
        if (!matched) {
            missingInFirebase.push(jc);
        }
    });

    if (missingInFirebase.length === 0) {
        console.log("\n✅ ALL JustCall contacts are present in Firebase!");
    } else {
        console.log("\n❌ Found " + missingInFirebase.length + " contacts in JustCall that are NOT in Firebase:");
        missingInFirebase.forEach(c => {
            console.log(`  - Name: ${c.first_name || ''} ${c.last_name || ''} | Phone: ${c.contact_number || c.phone || 'N/A'}`);
        });
    }
}

run().then(() => process.exit(0)).catch(e => {
    console.error(e);
    process.exit(1);
});
