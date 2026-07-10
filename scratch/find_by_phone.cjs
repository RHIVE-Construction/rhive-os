const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID
};

async function run() {
    if (!process.env.VITE_FIREBASE_API_KEY) {
        console.error("Missing Firebase API key in env");
        return;
    }

    let app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const phoneToFind = '18018193287';
    const cleanPhoneToFind = phoneToFind.replace(/\D/g, '');

    console.log(`Searching Firestore contacts for phone variations of: ${phoneToFind}...`);
    const contactsRef = collection(db, 'contacts');
    const contactsSnap = await getDocs(contactsRef);
    const matches = [];

    contactsSnap.forEach(doc => {
        const data = doc.data();
        const phone = data.phone ? String(data.phone).replace(/\D/g, '') : '';
        if (phone === cleanPhoneToFind || (phone && (phone.includes(cleanPhoneToFind) || cleanPhoneToFind.includes(phone)))) {
            matches.push({ id: doc.id, ...data });
        }
    });

    console.log(`Found ${matches.length} matching contacts.`);
    fs.writeFileSync('scratch/phone_matches.json', JSON.stringify(matches, null, 2));
}

run().then(() => process.exit(0)).catch(e => {
    console.error(e);
    process.exit(1);
});
