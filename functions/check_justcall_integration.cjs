const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, orderBy, limit, getDocs } = require('firebase/firestore');
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

async function checkIntegration() {
    console.log("--- Checking JustCall Integration in live Firebase ---");
    
    let app;
    try {
        app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        
        console.log("\n1. Fetching latest Call Logs...");
        const callLogsRef = collection(db, 'call_logs');
        const callLogsQuery = query(callLogsRef, orderBy('timestamp', 'desc'), limit(5));
        const callLogsSnapshot = await getDocs(callLogsQuery);
        
        if (callLogsSnapshot.empty) {
            console.log("No call logs found.");
        } else {
            callLogsSnapshot.forEach(doc => {
                const data = doc.data();
                console.log(`Log ID: ${doc.id}`);
                console.log(`- Event Type: ${data.event_type}`);
                console.log(`- Caller: ${data.contact_number} (${data.contact_name})`);
                console.log(`- Lead Processed: ${data.lead_processed ? 'Yes' : 'No'}`);
                if (data.lead_id) console.log(`- Lead ID: ${data.lead_id}`);
                console.log(`- Original Recording URL: ${data.recording_url ? "Exists" : "None"}`);
                if (data.storage_recording_url) {
                    console.log(`- Saved to Storage URL: ${data.storage_recording_url}`);
                } else if (data.recording_url) {
                    console.log(`- ⚠️ Call has recording URL but not saved to storage yet.`);
                }
                console.log("---------");
            });
        }
        
        console.log("\n2. Fetching latest Leads...");
        const leadsRef = collection(db, 'leads');
        const leadsQuery = query(leadsRef, orderBy('created_at', 'desc'), limit(5));
        const leadsSnapshot = await getDocs(leadsQuery);
        
        if (leadsSnapshot.empty) {
            console.log("No leads found.");
        } else {
            leadsSnapshot.forEach(doc => {
                const data = doc.data();
                console.log(`Lead ID: ${doc.id}`);
                console.log(`- Name: ${data.name}`);
                console.log(`- Project Type: ${data.project_type}`);
                console.log(`- Status: ${data.status}`);
                console.log(`- Details: ${data.details ? data.details.substring(0, 100) + '...' : 'None'}`);
                console.log("---------");
            });
        }
        
        console.log("\n3. Fetching latest Contacts...");
        const contactsRef = collection(db, 'contacts');
        const contactsQuery = query(contactsRef, orderBy('created_at', 'desc'), limit(5));
        const contactsSnapshot = await getDocs(contactsQuery);
        
         if (contactsSnapshot.empty) {
            console.log("No contacts found.");
        } else {
            contactsSnapshot.forEach(doc => {
                const data = doc.data();
                console.log(`Contact ID: ${doc.id}`);
                console.log(`- Name: ${data.first_name} ${data.last_name}`);
                console.log(`- Phone: ${data.phone}`);
                console.log(`- Role: ${data.role}`);
                console.log(`- Project ID: ${data.project_id}`);
                console.log("---------");
            });
        }

    } catch (error) {
        console.error("❌ Error during check:", error.message);
    }
}

checkIntegration();
