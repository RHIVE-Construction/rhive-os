const { Firestore } = require('@google-cloud/firestore');

async function main() {
    console.log("Initializing @google-cloud/firestore...");
    try {
        const db = new Firestore({
            projectId: 'rhive-os'
        });
        console.log("Connected. Querying users collection for james.g@rhiveconstruction.com...");
        const snapshot = await db.collection('users').where('email', '==', 'james.g@rhiveconstruction.com').get();
        
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
