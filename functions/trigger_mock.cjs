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
    
    // We'll use a specific ID
    let callId = "mock_fixed_" + Date.now();
    let docRef = doc(db, 'call_logs', callId);

    console.log(`Inserting mock call log (ID: ${callId}) to trigger the AI parser...`);

    let data = {
        event_type: "call.completed",
        contact_number: "4321118889",
        contact_name: "Missus Yoso",
        contact_email: "missusyoso2@gmail.com",
        call_id: callId,
        call_date: new Date().toISOString(),
        duration: 120,
        direction: "inbound",
        transcript: "Agent: Hello, thank you for calling RHIVE. How can I help you today? \nCaller: Hi, my name is Missus Yoso. I'm the property owner at 5500 S Garnet Dr, Saint George, UT 84790. I'm looking for a Residential project. I need some work done there. Just to be clear, this is not an insurance claim. \nAgent: Got it. What's the best way to contact you? \nCaller: Email is preferred. My email address is missusyoso2@gmail.com, and my phone number is 4321118889. Could you please reach out to me there to discuss the details?",
        timestamp: serverTimestamp(),
        updated_at: serverTimestamp()
    };

    await setDoc(docRef, data);
    console.log("✅ Inserted mock log. The processCallLogForLead trigger should now fire on the backend.");
    process.exit(0);
}

insertMockLog();
