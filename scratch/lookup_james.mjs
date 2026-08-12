/**
 * Lookup james.g@rhiveconstruction.com in Firestore using the web SDK
 * Run with: node lookup_james.mjs
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAKE58hL99Sl5AATLEt-B3h9NQGxf778cY",
    authDomain: "rhive-os.firebaseapp.com",
    projectId: "rhive-os",
    storageBucket: "rhive-os.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function lookupUser() {
    console.log('Querying Firestore for james.g@rhiveconstruction.com...\n');
    try {
        const q = query(collection(db, 'users'), where('email', '==', 'james.g@rhiveconstruction.com'));
        const snap = await getDocs(q);

        if (snap.empty) {
            console.log('❌ No user found with that email in Firestore users collection.');
            process.exit(0);
        }

        snap.forEach(doc => {
            const d = doc.data();
            console.log('✅ User found!');
            console.log('  ID:', doc.id);
            console.log('  Name:', d.name);
            console.log('  Email:', d.email);
            console.log('  Phone:', d.phone || d.phone_number || d.phoneNumber || '(not set)');
            console.log('  Role:', d.role);
            console.log('  Full doc keys:', Object.keys(d).join(', '));
            // Show phone-related fields
            const phoneKeys = Object.entries(d).filter(([k]) => k.toLowerCase().includes('phone'));
            if (phoneKeys.length > 0) {
                console.log('\n  Phone-related fields:');
                phoneKeys.forEach(([k, v]) => console.log(`    ${k}: ${v}`));
            }
        });
    } catch (err) {
        console.error('Error:', err.message);
    }
    process.exit(0);
}

lookupUser();
