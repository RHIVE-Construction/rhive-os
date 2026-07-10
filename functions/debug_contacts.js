const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config({ path: path.join(__dirname, '.env') });

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
};

const JUSTCALL_API_KEY = process.env.JUSTCALL_API_KEY;
const JUSTCALL_API_SECRET = process.env.JUSTCALL_API_SECRET;

async function run() {
    let app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const contactsRef = collection(db, 'contacts');
    const contactsSnap = await getDocs(contactsRef);
    const firebasePhones = [];
    contactsSnap.forEach(doc => {
        let phone = doc.data().phone;
        if(phone) firebasePhones.push(String(phone).replace(/\D/g, ''));
    });
    console.log("Firebase Phones:", firebasePhones);

    const jcResponse = await axios.get('https://api.justcall.io/v2.1/contacts', {
        headers: {
            'Authorization': `${JUSTCALL_API_KEY}:${JUSTCALL_API_SECRET}`,
            'Accept': 'application/json'
        }
    });

    const jcContacts = jcResponse.data.data || [];
    const justcallPhones = jcContacts.map(jc => String(jc.phone).replace(/\D/g, ''));
    console.log(`Justcall Phones (${justcallPhones.length}):`, justcallPhones.slice(0, 10), '...');

    const missingInFirebase = [];
    jcContacts.forEach(jc => {
        if (!jc.phone) return;
        let phoneStr = String(jc.phone).replace(/\D/g, '');
        // Filter out very short phone numbers just in case 
        if (phoneStr.length < 5) return; 

        let matched = false;
        for (let fp of firebasePhones) {
             if (fp.length < 5) continue; // Skip bad firebase phones
             if (fp === phoneStr || fp.includes(phoneStr) || phoneStr.includes(fp)) {
                 matched = true;
                 break;
             }
        }
        if (!matched) {
            missingInFirebase.push(jc);
        }
    });

    if (missingInFirebase.length > 0) {
        console.log(`\n❌ Found ${missingInFirebase.length} contacts missing in Firebase. Sample:`);
        missingInFirebase.slice(0, 5).forEach(c => console.log(`- ${c.first_name} ${c.last_name}: ${c.phone}`));
    } else {
        console.log("\n✅ All matched securely");
    }
}
run().catch(e => console.error(e));
