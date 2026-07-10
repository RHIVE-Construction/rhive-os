const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, serverTimestamp } = require('firebase/firestore');
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

async function insertMockLog() {
    let app = initializeApp(firebaseConfig);
    let db = getFirestore(app);
    
    let callId = "mock_dobby_" + Date.now();
    let docRef = doc(db, 'call_logs', callId);

    console.log(`Inserting custom mock call log (ID: ${callId}) to test AI parsing...`);

    let data = {
        event_type: "call.completed",
        contact_number: "6641123344",
        contact_name: "Dobby Houseelf",
        call_id: callId,
        call_date: new Date().toISOString(),
        duration: 120,
        direction: "inbound",
        transcript: `Address: 105B WINDERLAND LN SPRINGDALE UT 84767-7760 USA
project_type: residential
first_name: Dobby
last_name: Houseelf
phone_number: 6641123344
project_role: landlord

project_intent: replacement
active_leak_detected: no
goal: seeking instant estimate`,
        timestamp: serverTimestamp(),
        updated_at: serverTimestamp()
    };

    await setDoc(docRef, data);
    console.log("✅ Inserted custom mock log. Waiting for backend to process...");
    
    // We'll output the ID so we can query it easily
    console.log(`CALL_ID=${callId}`);
    process.exit(0);
}

insertMockLog();
