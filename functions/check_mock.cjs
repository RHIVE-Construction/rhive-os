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

async function checkMock() {
    console.log("--- Checking Mock Result in Firestore ---");
    
    let app;
    try {
        app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        
        const testPhone = "4321115566";
        
        // 1. Fetch Contact
        const qContacts = query(collection(db, 'contacts'), where("phone", "==", testPhone));
        const contactSnap = await getDocs(qContacts);
        
        if (contactSnap.empty) {
            console.log("❌ No contact found for phone:", testPhone);
        } else {
            console.log("✅ Contact found!");
            contactSnap.forEach(doc => console.log("Contact Data:", doc.id, "=>", JSON.stringify(doc.data(), null, 2)));
        }

        // 2. Fetch Lead
        const qLeads = query(collection(db, 'leads'), where("property_address", "==", "5500 S Garnet Dr"));
        // we'll just check all leads and filter out by name to be safe since Gemini might have tweaked address naming.
        const allLeadsSnap = await getDocs(collection(db, 'leads'));
        let leadFound = false;
        allLeadsSnap.forEach(doc => {
            const data = doc.data();
            if (data.name && data.name.includes("Mister Yoso") || data.name === "Mister Yoso" || (data.details && data.details.includes("Saint George"))) {
                console.log("✅ Lead found!");
                console.log("Lead Data:", doc.id, "=>", JSON.stringify(data, null, 2));
                leadFound = true;
            }
        });
        if (!leadFound) console.log("❌ No lead found for Mister Yoso");

        // 3. Fetch Property
        const allPropsSnap = await getDocs(collection(db, 'properties'));
        let propFound = false;
        allPropsSnap.forEach(doc => {
            const data = doc.data();
            if (data.address_full && data.address_full.includes("Garnet")) {
                console.log("✅ Property found!");
                console.log("Property Data:", doc.id, "=>", JSON.stringify(data, null, 2));
                propFound = true;
            }
        });
        if (!propFound) console.log("❌ No property found with 'Garnet'");

    } catch (error) {
        console.error("❌ Error during test drive:", error.message);
    }
}

checkMock();
