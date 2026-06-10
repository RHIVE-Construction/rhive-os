const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
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

async function run() {
    let app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // Get existing Firebase Contacts
    const contactsRef = collection(db, 'contacts');
    const contactsSnap = await getDocs(contactsRef);
    const existingPhones = new Set();
    contactsSnap.forEach(doc => {
        const phone = doc.data().phone;
        if (phone) {
            existingPhones.add(String(phone).replace(/\D/g, ''));
        }
    });

    console.log("Checking if clean phone 18018193287 is in Firebase existingPhones set:", existingPhones.has("18018193287"));
    console.log("Checking if clean phone 8018193287 is in Firebase existingPhones set:", existingPhones.has("8018193287"));

    console.log("\nFetching team contacts to locate Ladd Thorn...");
    let page = 1;
    let foundInJc = null;
    while (true) {
        try {
            await sleep(500);
            const res = await axios.get('https://api.justcall.io/v2.1/contacts', {
                params: { page: page, per_page: 100, across_team: true },
                headers: {
                    'Authorization': `${JUSTCALL_API_KEY}:${JUSTCALL_API_SECRET}`,
                    'Accept': 'application/json'
                }
            });
            const pageContacts = res.data.data || [];
            if (pageContacts.length === 0) break;
            
            for (let c of pageContacts) {
                if (c.first_name === 'Ladd' || c.last_name === 'Thorn' || c.id === 5864) {
                    foundInJc = c;
                    break;
                }
            }
            if (foundInJc) {
                console.log(`Ladd Thorn found on page ${page}!`);
                console.log("Contact Object:", JSON.stringify(foundInJc, null, 2));
                break;
            }
            console.log(`Page ${page} checked...`);
            if (pageContacts.length < 100) break;
            page++;
        } catch (e) {
            console.error(e.message);
            break;
        }
    }

    if (!foundInJc) {
        console.log("\n❌ Ladd Thorn was NOT returned in any paginated page from JustCall v2.1/contacts!");
    } else {
        const rawPhone = foundInJc.contact_number || foundInJc.phone;
        const cleanPhone = String(rawPhone).replace(/\D/g, '');
        console.log(`\nLadd Thorn raw phone: "${rawPhone}"`);
        console.log(`Cleaned phone: "${cleanPhone}"`);
        console.log(`Does existingPhones has cleanPhone? ${existingPhones.has(cleanPhone)}`);
    }
}

run().then(() => process.exit(0)).catch(e => {
    console.error(e);
    process.exit(1);
});
