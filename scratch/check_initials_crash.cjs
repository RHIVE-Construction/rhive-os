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
    
    let crashCount = 0;
    contactsSnap.forEach(doc => {
        const contact = doc.data();
        try {
            const name = contact.first_name || contact.last_name
                ? `${contact.first_name || ''} ${contact.last_name || ''}`.trim()
                : contact.full_name || contact.name || 'Unknown Contact';
            
            // This is exactly what line 246 does
            const initials = name.split(' ').map((n) => n[0]).filter(Boolean).join('').toUpperCase().slice(0, 2);
        } catch (err) {
            console.error(`Crash on document ID: ${doc.id}`);
            console.error(`Contact data:`, contact);
            console.error(err);
            crashCount++;
        }
    });

    console.log(`\nCrash checks done. Total crashes: ${crashCount}`);
}

run().then(() => process.exit(0)).catch(e => {
    console.error(e);
    process.exit(1);
});
