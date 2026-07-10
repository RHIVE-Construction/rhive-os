const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
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

    console.log("Fetching all Firestore contacts...");
    const contactsRef = collection(db, 'contacts');
    const contactsSnap = await getDocs(contactsRef);
    
    let anomalies = [];
    contactsSnap.forEach(doc => {
        const c = doc.data();
        const checkString = (field, val) => {
            if (val !== undefined && val !== null && typeof val !== 'string') {
                anomalies.push({ id: doc.id, field, value: val, type: typeof val });
            }
        };

        checkString('first_name', c.first_name);
        checkString('last_name', c.last_name);
        checkString('full_name', c.full_name);
        checkString('name', c.name);
        checkString('email', c.email);
        checkString('phone', c.phone);
        checkString('mobile', c.mobile);
        checkString('role', c.role);
        checkString('contactType', c.contactType);
        checkString('contactIs', c.contactIs);
        checkString('leadSource', c.leadSource);
    });

    console.log(`Checked ${contactsSnap.size} contacts.`);
    console.log(`Found ${anomalies.length} type anomalies.`);
    if (anomalies.length > 0) {
        console.log(JSON.stringify(anomalies.slice(0, 10), null, 2));
    }
}

run().then(() => process.exit(0)).catch(e => {
    console.error(e);
    process.exit(1);
});
