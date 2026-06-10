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

    console.log("Fetching all Firestore contacts...");
    const contactsRef = collection(db, 'contacts');
    const contactsSnap = await getDocs(contactsRef);
    
    const phoneGroups = {};

    contactsSnap.forEach(doc => {
        const data = doc.data();
        const phones = new Set();
        
        if (data.phone) phones.add(String(data.phone).replace(/\D/g, ''));
        if (data.mobile) phones.add(String(data.mobile).replace(/\D/g, ''));
        if (data.homePhone) phones.add(String(data.homePhone).replace(/\D/g, ''));
        if (data.otherPhone) phones.add(String(data.otherPhone).replace(/\D/g, ''));

        const record = { id: doc.id, ...data };

        phones.forEach(p => {
            if (!p || p.length < 7) return;
            if (!phoneGroups[p]) phoneGroups[p] = [];
            phoneGroups[p].push(record);
        });
    });

    const duplicates = [];
    Object.keys(phoneGroups).forEach(phone => {
        const records = phoneGroups[phone];
        const uniqueRecords = [];
        const seenIds = new Set();
        for (let r of records) {
            if (!seenIds.has(r.id)) {
                seenIds.add(r.id);
                uniqueRecords.push(r);
            }
        }
        
        if (uniqueRecords.length > 1) {
            duplicates.push({
                phone,
                records: uniqueRecords.map(r => ({
                    id: r.id,
                    name: `${r.first_name || ''} ${r.last_name || ''}`.trim() || r.full_name || r.name,
                    source: r._source || 'unknown',
                    autoNumber: r.autoNumber || null,
                    phoneField: r.phone || null,
                    mobileField: r.mobile || null
                }))
            });
        }
    });

    console.log(`Found ${duplicates.length} duplicate groups.`);
    fs.writeFileSync('scratch/duplicates_results.json', JSON.stringify(duplicates, null, 2));
}

run().then(() => process.exit(0)).catch(e => {
    console.error(e);
    process.exit(1);
});
