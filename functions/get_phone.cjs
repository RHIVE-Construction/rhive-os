const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, limit, query } = require('firebase/firestore');
const path = require('path');

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

async function getPhone() {
    console.log("--- Fetching a valid phone number from contacts ---");
    let app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    const q = query(collection(db, 'contacts'), limit(5));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
        console.log("No contacts in DB.");
    } else {
        snapshot.docs.forEach(doc => {
            const data = doc.data();
            console.log(`Found contact: ${data.first_name} ${data.last_name} | Phone: ${data.phone}`);
        });
    }
}

getPhone();
