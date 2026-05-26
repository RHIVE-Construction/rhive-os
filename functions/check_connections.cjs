
const axios = require('axios');
const path = require('path');
const admin = require('firebase-admin');

// Load env from .env in the same directory
require('dotenv').config({ path: path.join(__dirname, '.env') });

const JUSTCALL_API_KEY = process.env.JUSTCALL_API_KEY;
const JUSTCALL_API_SECRET = process.env.JUSTCALL_API_SECRET;

async function checkConnections() {
    console.log("--- Checking JustCall connection ---");
    if (!JUSTCALL_API_KEY || !JUSTCALL_API_SECRET) {
        console.error("JustCall API Key or Secret missing!");
    } else {
        try {
            // Using the header format that is most likely to succeed based on documentation
            const response = await axios.get('https://api.justcall.io/v1/contacts', {
                headers: {
                    'Authorization': `${JUSTCALL_API_KEY}:${JUSTCALL_API_SECRET}`,
                    'Accept': 'application/json'
                }
            });
            console.log("JustCall Connection: SUCCESS");
            console.log("HTTP Status:", response.status);
            console.log("Contacts count (JustCall):", response.data.contacts ? response.data.contacts.length : "N/A");
        } catch (error) {
            console.error("JustCall Connection: FAILED");
            console.error("HTTP Status:", error.response?.status);
            if (error.response?.status === 403) {
                console.error("Authentication Error: Forbidden (Check if keys are active and IP is allowed)");
            }
            console.error("Error Detail:", error.message);
        }
    }

    console.log("\n--- Checking Firebase Firestore connection (rhive-os) ---");
    try {
        if (admin.apps.length === 0) {
            // No projectId needed if ADC or CLI is providing context, but we'll use it since it was there
            admin.initializeApp({
                projectId: 'rhive-os'
            });
        }
        const db = admin.firestore();
        
        const collectionsToCheck = ['contacts', 'properties', 'projects', 'project', 'call_logs'];
        
        for (const collName of collectionsToCheck) {
            try {
                const snapshot = await db.collection(collName).limit(3).get();
                console.log(`Collection '${collName}': SUCCESS (Found ${snapshot.size} sample docs)`);
                if (snapshot.size > 0 && collName === 'contacts') {
                    // Try to show one contact's name as proof
                    const firstDoc = snapshot.docs[0].data();
                    console.log(`  Sample data: ${firstDoc.first_name} ${firstDoc.last_name} (${firstDoc.phone || 'no phone'})`);
                }
            } catch (err) {
                console.error(`Collection '${collName}': FAILED - ${err.message}`);
            }
        }

    } catch (error) {
        console.error("Firestore Connection: FAILED");
        console.error("Error Detail:", error.message);
    }
}

checkConnections();

