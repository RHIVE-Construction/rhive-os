const admin = require('firebase-admin');

// Initialize admin SDK
admin.initializeApp({
    projectId: 'rhive-os'
});
const db = admin.firestore();

async function checkDobby() {
    console.log("Checking Firestore (Admin SDK) for Dobby's generated lead data...");
    
    // 1. Check Contacts
    console.log("\n--- CONTACTS ---");
    const contactSnap = await db.collection('contacts').where('phone', '==', '6641123344').get();
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
    const leadSnap = await db.collection('leads').where('name', '==', 'Dobby Houseelf').get();
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
    const propSnap = await db.collection('properties').where('property_address', '==', '105B WINDERLAND LN').get();
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

checkDobby().catch(console.error);
