/**
 * seed_james_phone.cjs
 * 
 * Ensures james.g@rhiveconstruction.com has phone +639560213304 in Firestore.
 * Run from the workspace root with: node scripts/seed_james_phone.cjs
 */

const admin = require('firebase-admin');

// Initialize with application default credentials (uses gcloud auth)
admin.initializeApp({
    projectId: 'rhive-os'
});

const db = admin.firestore();
const auth = admin.auth();

const TARGET_EMAIL = 'james.g@rhiveconstruction.com';
const TARGET_PHONE = '+639560213304';

async function main() {
    console.log('\n🔍 RHIVE — Seeding James Phone Number for OTP Test');
    console.log('═══════════════════════════════════════════════════');
    console.log(`📧 Email: ${TARGET_EMAIL}`);
    console.log(`📱 Phone: ${TARGET_PHONE}`);
    console.log('═══════════════════════════════════════════════════\n');

    let firebaseUid = null;

    // 1. Check Firebase Auth
    try {
        const userRecord = await auth.getUserByEmail(TARGET_EMAIL);
        firebaseUid = userRecord.uid;
        console.log(`✅ Found in Firebase Auth: UID = ${firebaseUid}`);
        console.log(`   Display Name: ${userRecord.displayName || '(none)'}`);
        console.log(`   Phone in Auth: ${userRecord.phoneNumber || '(none)'}`);
    } catch (e) {
        console.log(`⚠️  Not found in Firebase Auth by email: ${e.message}`);
    }

    // 2. Search Firestore users collection
    console.log('\n🔍 Searching Firestore users collection...');

    // Search by email
    const emailQuery = await db.collection('users').where('email', '==', TARGET_EMAIL).get();
    if (!emailQuery.empty) {
        console.log(`✅ Found ${emailQuery.size} Firestore user doc(s) with email: ${TARGET_EMAIL}`);
        for (const docSnap of emailQuery.docs) {
            const data = docSnap.data();
            console.log(`\n   Doc ID: ${docSnap.id}`);
            console.log(`   Name: ${data.name || data.firstName + ' ' + data.lastName || '(none)'}`);
            console.log(`   Current Phone: ${data.phone || '(none)'}`);
            console.log(`   Role: ${data.role || '(none)'}`);

            if (data.phone !== TARGET_PHONE) {
                console.log(`\n🔧 Updating phone from '${data.phone || '(none)'}' → '${TARGET_PHONE}'...`);
                await docSnap.ref.update({ phone: TARGET_PHONE });
                console.log(`✅ Phone updated successfully!`);
            } else {
                console.log(`✅ Phone already correct: ${data.phone}`);
            }
        }
    } else {
        console.log(`⚠️  No Firestore user docs found with email: ${TARGET_EMAIL}`);

        // Try to find by phone already existing
        const phoneQuery = await db.collection('users').where('phone', '==', TARGET_PHONE).get();
        if (!phoneQuery.empty) {
            console.log(`✅ Found ${phoneQuery.size} user(s) already with phone ${TARGET_PHONE}:`);
            for (const d of phoneQuery.docs) {
                console.log(`   Doc ID: ${d.id}, email: ${d.data().email || '(none)'}`);
            }
        } else {
            console.log(`\n📝 No existing user found. Creating Firestore user doc for James...`);
            // Use firebaseUid as document ID if available
            const docId = firebaseUid || TARGET_EMAIL.replace(/[@.]/g, '_');
            await db.collection('users').doc(docId).set({
                email: TARGET_EMAIL,
                phone: TARGET_PHONE,
                name: 'James G.',
                role: 'Admin',
                firebaseUid: firebaseUid || null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }, { merge: true });
            console.log(`✅ User doc created with ID: ${docId}`);
        }
    }

    // 3. Verify final state
    console.log('\n📊 Final verification:');
    const finalQuery = await db.collection('users').where('phone', '==', TARGET_PHONE).get();
    if (!finalQuery.empty) {
        for (const docSnap of finalQuery.docs) {
            const data = docSnap.data();
            console.log(`✅ Confirmed user with phone ${TARGET_PHONE}:`);
            console.log(`   Doc ID: ${docSnap.id}`);
            console.log(`   Email: ${data.email}`);
            console.log(`   Name: ${data.name || data.firstName || '(none)'}`);
        }
    } else {
        console.log(`❌ ERROR: Still no user found with phone ${TARGET_PHONE}!`);
    }

    console.log('\n═══════════════════════════════════════════════════');
    console.log('✅ Seed script complete. Ready to test OTP flow!');
    console.log('═══════════════════════════════════════════════════\n');

    process.exit(0);
}

main().catch(err => {
    console.error('\n💥 Script failed:', err.message);
    process.exit(1);
});
