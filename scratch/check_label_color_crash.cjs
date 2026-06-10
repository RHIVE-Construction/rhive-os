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

const getContactLabel = (c) => {
    return c.role || c.contactType || c.contactIs || c.leadSource || '';
};

const labelColor = (label) => {
    const r = label.toLowerCase();
    if (r.includes('customer')) return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    if (r.includes('primary')) return 'bg-[#ec028b]/10 text-[#ec028b] border-[#ec028b]/30';
    if (r.includes('owner')) return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    if (r.includes('webform') || r.includes('web')) return 'bg-green-500/10 text-green-400 border-green-500/30';
    if (r.includes('facebook') || r.includes('social')) return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
    if (r.includes('referral') || r.includes('referr')) return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    return 'bg-gray-800 text-gray-400 border-gray-700';
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
            const label = getContactLabel(contact);
            if (label) {
                const color = labelColor(label);
            }
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
