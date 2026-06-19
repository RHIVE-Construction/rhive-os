const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, query, where, getDocs, doc, updateDoc } = require('firebase/firestore');
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

const newContact = {
    first_name: "Doug",
    last_name: "Whitlock",
    full_name: "Doug Whitlock",
    phone: "8013645682",
    email: "escalante@unphc.org",
    address: "1040 North Redwood Road, Salt Lake City, UT 84116",
    projectRole: "Property Manager",
    _source: "manual",
    recordStatus: "Available"
};

async function run() {
    if (!process.env.VITE_FIREBASE_API_KEY) {
        console.error("Missing Firebase API key in env");
        process.exit(1);
    }

    console.log("Initializing Firebase...");
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const contactsRef = collection(db, 'contacts');

    console.log(`Checking if contact with email "${newContact.email}" already exists...`);
    const q = query(contactsRef, where('email', '==', newContact.email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        // Update existing contact
        const docId = querySnapshot.docs[0].id;
        console.log(`Contact already exists with ID: ${docId}. Updating details...`);
        const docRef = doc(db, 'contacts', docId);
        await updateDoc(docRef, {
            ...newContact,
            updated_at: new Date().toISOString()
        });
        console.log("Contact successfully updated!");
    } else {
        // Create new contact
        console.log("Adding new contact to Firestore...");
        const docRef = await addDoc(contactsRef, {
            ...newContact,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        });
        console.log(`Contact successfully added with ID: ${docRef.id}`);
    }
}

run()
    .then(() => process.exit(0))
    .catch(err => {
        console.error("Error executing script:", err);
        process.exit(1);
    });
