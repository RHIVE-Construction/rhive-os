const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, where, getDocs } = require('firebase/firestore');
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
        process.exit(1);
    }

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const contactsRef = collection(db, 'contacts');

    console.log("Searching for 'Doug Whitlock' in Firestore...");
    
    // We can check by first/last name or email
    const q = query(contactsRef, where('last_name', '==', 'Whitlock'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        console.log("No contact found with last name 'Whitlock'.");
    } else {
        console.log(`Found ${snapshot.size} matching records:`);
        snapshot.forEach(doc => {
            console.log(JSON.stringify({ id: doc.id, ...doc.data() }, null, 2));
        });
    }
}

run()
    .then(() => process.exit(0))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
