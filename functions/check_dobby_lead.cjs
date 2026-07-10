const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, where, getDocs } = require('firebase/firestore');
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

async function checkDobby() {
    console.log("Checking Firestore for Dobby's generated lead data...");
    let app = initializeApp(firebaseConfig);
    let db = getFirestore(app);
    
    // 1. Check Contacts
    console.log("\n--- CONTACTS ---");
    const qContact = query(collection(db, 'contacts'), where("phone", "==", "6641123344"));
    const contactSnap = await getDocs(qContact);
    if (contactSnap.empty) {
        console.log("❌ No contact found for 6641123344");
    } else {
        contactSnap.forEach(doc => {
            console.log("✅ Contact Found:", doc.id);
            console.log(JSON.stringify(doc.data(), null, 2));
        });
    }

    // 2. Check Leads
    console.log("\n--- LEADS ---");
    // query by name
    const qLead = query(collection(db, 'leads'), where("name", "==", "Dobby Houseelf"));
    const leadSnap = await getDocs(qLead);
    if (leadSnap.empty) {
        console.log("❌ No lead found for Dobby Houseelf");
    } else {
        leadSnap.forEach(doc => {
            console.log("✅ Lead Found:", doc.id);
            console.log(JSON.stringify(doc.data(), null, 2));
        });
    }

    // 3. Check Properties
    console.log("\n--- PROPERTIES ---");
    const qProp = query(collection(db, 'properties'), where("property_address", "==", "105B WINDERLAND LN"));
    const propSnap = await getDocs(qProp);
    if (propSnap.empty) {
        console.log("❌ No property found at 105B WINDERLAND LN");
    } else {
        propSnap.forEach(doc => {
            console.log("✅ Property Found:", doc.id);
            console.log(JSON.stringify(doc.data(), null, 2));
        });
    }

    process.exit(0);
}

checkDobby();
