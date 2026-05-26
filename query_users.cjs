const admin = require('firebase-admin');

async function main() {
    console.log("Initializing firebase-admin...");
    try {
        if (admin.apps.length === 0) {
            admin.initializeApp({
                projectId: 'rhive-os'
            });
        }
        const db = admin.firestore();
        console.log("Connected. Querying users collection for james.g@rhiveconstruction.com...");
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('email', '==', 'james.g@rhiveconstruction.com').get();
        
        if (snapshot.empty) {
            console.log("No user document found in Firestore for james.g@rhiveconstruction.com.");
        } else {
            console.log(`Found ${snapshot.size} user document(s):`);
            snapshot.forEach(doc => {
                console.log(`Document ID: ${doc.id}`);
                console.log("Data:", JSON.stringify(doc.data(), null, 2));
            });
        }
    } catch (err) {
        console.error("Error executing query:", err);
    }
}

main();
