const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, where, getDocs } = require('firebase/firestore');
const path = require('path');
const fs = require('fs');

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
    let app = initializeApp(firebaseConfig);
    let db = getFirestore(app);
    let results = { contact: null, lead: null, property: null };
    
    // Check Contact
    let cSnap = await getDocs(query(collection(db, 'contacts'), where("phone", "==", "4321118889")));
    if (!cSnap.empty) results.contact = cSnap.docs[0].data();

    // Check Leads
    let lSnap = await getDocs(collection(db, 'leads'));
    lSnap.forEach(d => {
        let n = d.data().name || "";
        if (typeof n === 'string' && n.includes("Missus Yoso")) results.lead = d.data();
    });

    // Check Properties
    let pSnap = await getDocs(collection(db, 'properties'));
    pSnap.forEach(d => {
        let n = d.data().address_full || d.data().property_address || "";
        if (typeof n === 'string' && n.includes("Garnet")) results.property = d.data();
    });

    fs.writeFileSync('mock_results.json', JSON.stringify(results, null, 2));
    process.exit(0);
}
run();
