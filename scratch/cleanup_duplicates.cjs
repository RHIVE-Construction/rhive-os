const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc } = require('firebase/firestore');
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

    console.log("Fetching Firestore contacts for cleanup...");
    const contactsRef = collection(db, 'contacts');
    const contactsSnap = await getDocs(contactsRef);
    
    // Group all documents by their cleaned phone numbers
    const phoneGroups = {};
    const allRecords = [];

    contactsSnap.forEach(doc => {
        const data = doc.data();
        const phones = new Set();
        
        if (data.phone) phones.add(String(data.phone).replace(/\D/g, ''));
        if (data.mobile) phones.add(String(data.mobile).replace(/\D/g, ''));
        if (data.homePhone) phones.add(String(data.homePhone).replace(/\D/g, ''));
        if (data.otherPhone) phones.add(String(data.otherPhone).replace(/\D/g, ''));

        const record = { id: doc.id, ...data };
        allRecords.push(record);

        phones.forEach(p => {
            if (!p || p.length < 7) return;
            if (!phoneGroups[p]) phoneGroups[p] = [];
            phoneGroups[p].push(record);
        });
    });

    console.log(`Analyzing duplicate groups...`);
    let deletedCount = 0;
    let mergedCount = 0;

    const processedIds = new Set();

    for (const phone of Object.keys(phoneGroups)) {
        const records = phoneGroups[phone];
        
        // Filter out unique records
        const uniqueRecords = [];
        const seenIds = new Set();
        for (let r of records) {
            if (!seenIds.has(r.id)) {
                seenIds.add(r.id);
                uniqueRecords.push(r);
            }
        }

        if (uniqueRecords.length > 1) {
            // Find the best/richest record to keep (prioritizing Zoho/csv-import and presence of autoNumber)
            let keepRecord = null;
            let deleteRecords = [];

            // Sort so csv-import comes first, then zoho/others, then justcall-sync
            const sorted = [...uniqueRecords].sort((a, b) => {
                const scoreA = (a.autoNumber ? 5 : 0) + (a._source === 'csv-import' ? 3 : 0) + (a.email ? 1 : 0);
                const scoreB = (b.autoNumber ? 5 : 0) + (b._source === 'csv-import' ? 3 : 0) + (b.email ? 1 : 0);
                return scoreB - scoreA;
            });

            keepRecord = sorted[0];
            deleteRecords = sorted.slice(1);

            if (processedIds.has(keepRecord.id)) {
                // If we already processed/kept this record in another phone grouping, don't duplicate logic
                continue;
            }

            console.log(`\nDuplicate Group for Phone: ${phone}`);
            console.log(`  KEEPING: ${keepRecord.first_name || ''} ${keepRecord.last_name || ''} (ID: ${keepRecord.id}, Source: ${keepRecord._source || 'unknown'}, AutoNumber: ${keepRecord.autoNumber || 'none'})`);

            // Merge any key fields into keepRecord if it's missing them (e.g. phone number)
            const updates = {};
            if (!keepRecord.phone && phone) {
                updates.phone = phone;
            }
            // If the simple record had a better email and rich didn't, copy it
            const betterEmail = deleteRecords.find(r => r.email && !r.email.includes('@justcall.io'))?.email;
            if (betterEmail && (!keepRecord.email || keepRecord.email.includes('@justcall.io'))) {
                updates.email = betterEmail;
            }

            if (Object.keys(updates).length > 0) {
                console.log(`  UPDATING KEEP RECORD:`, updates);
                const docRef = doc(db, 'contacts', keepRecord.id);
                await updateDoc(docRef, updates);
                mergedCount++;
            }

            // Delete duplicates
            for (let d of deleteRecords) {
                if (processedIds.has(d.id)) continue;
                console.log(`  DELETING: ${d.first_name || ''} ${d.last_name || ''} (ID: ${d.id}, Source: ${d._source || 'unknown'})`);
                const docRef = doc(db, 'contacts', d.id);
                await deleteDoc(docRef);
                processedIds.add(d.id);
                deletedCount++;
            }
            
            processedIds.add(keepRecord.id);
        }
    }

    console.log(`\nCleanup complete! Merged/Updated: ${mergedCount} | Deleted: ${deletedCount} duplicate contacts.`);
}

run().then(() => process.exit(0)).catch(e => {
    console.error(e);
    process.exit(1);
});
