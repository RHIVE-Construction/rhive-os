const axios = require('axios');
const path = require('path');
const admin = require('firebase-admin');
const fs = require('fs');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const JUSTCALL_API_KEY = process.env.JUSTCALL_API_KEY;
const JUSTCALL_API_SECRET = process.env.JUSTCALL_API_SECRET;

async function checkAll() {
    const results = {};

    // 1. JustCall Check
    if (!JUSTCALL_API_KEY || !JUSTCALL_API_SECRET) {
        results.justCall = { success: false, error: "Missing Keys" };
    } else {
        try {
            const response = await axios.get('https://api.justcall.io/v1/contacts', {
                headers: {
                    'Authorization': `${JUSTCALL_API_KEY}:${JUSTCALL_API_SECRET}`,
                    'Accept': 'application/json'
                }
            });
            results.justCall = { success: true, count: response.data.contacts ? response.data.contacts.length : null };
        } catch (error) {
            results.justCall = { success: false, status: error.response?.status, detail: error.response?.data || error.message };
        }
    }

    // 2. Firebase Check
    try {
        if (admin.apps.length === 0) {
            admin.initializeApp({
                projectId: 'rhive-os',
                storageBucket: 'rhive-os.firebasestorage.app'
            });
        }
        
        const db = admin.firestore();
        const contactSnapshot = await db.collection('contacts').limit(1).get();
        results.firestore = { success: true, count: contactSnapshot.size };

        const bucket = admin.storage().bucket();
        const [files] = await bucket.getFiles({ maxResults: 1 });
        results.storage = { success: true, count: files.length };

    } catch (error) {
        results.firebaseError = { success: false, detail: error.message };
    }

    fs.writeFileSync('connection_results.json', JSON.stringify(results, null, 2));
    console.log("Results written to connection_results.json");
}

checkAll();
