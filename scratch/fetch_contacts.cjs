const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const path = require('path');
const fs = require('fs');

// Load env from the root directory which has the VITE_ keys
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID
};

async function fetchContacts() {
    console.log("--- Fetching all contacts from Firestore ---");
    let app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    const snapshot = await getDocs(collection(db, 'contacts'));
    
    if (snapshot.empty) {
        console.log("No contacts in DB.");
        fs.writeFileSync(path.join(__dirname, 'contacts_output.json'), JSON.stringify([], null, 2));
    } else {
        const contacts = [];
        snapshot.docs.forEach(doc => {
            contacts.push({
                id: doc.id,
                ...doc.data()
            });
        });
        console.log(`Successfully fetched ${contacts.length} contacts.`);
        fs.writeFileSync(path.join(__dirname, 'contacts_output.json'), JSON.stringify(contacts, null, 2));
    }
}

fetchContacts().then(() => process.exit(0)).catch(e => {
    console.error(e);
    process.exit(1);
});
