const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, query, where, getDocs, deleteDoc, doc } = require('firebase/firestore');
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

async function testDrive() {
    console.log("--- Testing Firestore via Web SDK (Checking 'contacts', 'properties', 'projects') ---");
    
    let app;
    try {
        app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        
        const testPhone = "5550009999";
        
        // 1. Create a dummy contact
        console.log(`Adding test contact with phone ${testPhone}...`);
        const contactRef = await addDoc(collection(db, 'contacts'), {
            first_name: "Test",
            last_name: "Antigravity",
            phone: testPhone,
            email: "test@example.com",
            status: "Lead",
            created_at: new Date().toISOString()
        });
        console.log("✅ Contact added with ID:", contactRef.id);
        
        // 2. Create a dummy project
        console.log("Adding test project...");
        const projectRef = await addDoc(collection(db, 'projects'), {
            contact_id: contactRef.id,
            name: "Test Project",
            status: "New",
            created_at: new Date().toISOString()
        });
        console.log("✅ Project added with ID:", projectRef.id);

        // 3. Create a dummy property
        console.log("Adding test property...");
        const propertyRef = await addDoc(collection(db, 'properties'), {
            project_id: projectRef.id,
            address: "123 Main St",
            city: "Salt Lake City",
            state: "UT",
            zip: "84101",
            created_at: new Date().toISOString()
        });
        console.log("✅ Property added with ID:", propertyRef.id);

        // 4. Verify fetch (just like the Callbot does)
        console.log("Verifying fetch...");
        const q = query(collection(db, 'contacts'), where("phone", "==", testPhone));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            console.log("✅ Successfully fetched test contact via phone query!");
        } else {
            console.error("❌ Failed to fetch test contact via phone query.");
        }

        // Cleanup
        console.log("Cleaning up test records...");
        await deleteDoc(doc(db, 'contacts', contactRef.id));
        await deleteDoc(doc(db, 'projects', projectRef.id));
        await deleteDoc(doc(db, 'properties', propertyRef.id));
        console.log("✅ Cleanup complete.");

    } catch (error) {
        console.error("❌ Error during test drive:", error.message);
    }
}

testDrive();
