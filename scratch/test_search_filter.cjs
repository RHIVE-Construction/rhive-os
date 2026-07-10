const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
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

const getContactLabel = (c) => {
    if (!c) return '';
    return c.role || c.contactType || c.contactIs || c.leadSource || '';
};

async function run() {
    if (!process.env.VITE_FIREBASE_API_KEY) {
        console.error("Missing Firebase API key in env");
        return;
    }

    let app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    console.log("Fetching all Firestore contacts...");
    const contactsRef = collection(db, 'contacts');
    const contactsSnap = await getDocs(contactsRef);
    
    const contacts = [];
    contactsSnap.forEach(doc => {
        contacts.push({ id: doc.id, ...doc.data() });
    });

    console.log(`Fetched ${contacts.length} contacts. Running filter + sort tests...`);

    const testSearchQueries = ['', 'a', 'john', '1202', 'salt lake', 'commercial', 'manager', 'null', 'undefined'];

    for (const search of testSearchQueries) {
        console.log(`\nTesting search: "${search}"`);
        try {
            const filtered = contacts
                .filter(c => {
                    return true;
                })
                .filter(c => {
                    if (!search) return true;
                    
                    const safeString = (val) => (val !== undefined && val !== null) ? String(val).toLowerCase() : '';
                    
                    const firstName = safeString(c.first_name);
                    const lastName = safeString(c.last_name);
                    const fullName = safeString(c.full_name);
                    const name = safeString(c.name);
                    
                    const email = safeString(c.email);
                    
                    const phone = safeString(c.phone);
                    const mobile = safeString(c.mobile);
                    
                    const mailingCity = safeString(c.mailingCity);
                    const projectCity = safeString(c.projectCity);
                    const billingCity = safeString(c.billingCity);
                    
                    const address = safeString(c.address);
                    const mailingAddress = safeString(c.mailingAddress);
                    const billingAddress = safeString(c.billingAddress);
                    const projectAddress = safeString(c.projectAddress);
                    const mailingStreet = safeString(c.mailingStreet);
                    const street = safeString(c.street);
                    
                    const searchLower = search.toLowerCase();
                    
                    return (
                        firstName.includes(searchLower) ||
                        lastName.includes(searchLower) ||
                        fullName.includes(searchLower) ||
                        name.includes(searchLower) ||
                        email.includes(searchLower) ||
                        phone.includes(searchLower) ||
                        mobile.includes(searchLower) ||
                        mailingCity.includes(searchLower) ||
                        projectCity.includes(searchLower) ||
                        billingCity.includes(searchLower) ||
                        address.includes(searchLower) ||
                        mailingAddress.includes(searchLower) ||
                        billingAddress.includes(searchLower) ||
                        projectAddress.includes(searchLower) ||
                        mailingStreet.includes(searchLower) ||
                        street.includes(searchLower)
                    );
                })
                .sort((a, b) => {
                    const nameA = (a.first_name || a.last_name ? `${a.first_name || ''} ${a.last_name || ''}`.trim() : a.full_name || a.name || 'Unknown Contact').toLowerCase();
                    const nameB = (b.first_name || b.last_name ? `${b.first_name || ''} ${b.last_name || ''}`.trim() : b.full_name || b.name || 'Unknown Contact').toLowerCase();
                    return nameA.localeCompare(nameB);
                });
            console.log(`Success! Matches found: ${filtered.length}`);
        } catch (err) {
            console.error(`CRASHED during search filter + sort for "${search}":`, err);
        }
    }
}

run().then(() => process.exit(0)).catch(e => {
    console.error(e);
    process.exit(1);
});
