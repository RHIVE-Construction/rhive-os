/**
 * seed_test_phone.mjs
 * Adds +639560213304 to the Firestore users collection for OTP testing.
 * Run: node seed_test_phone.mjs
 */
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Load .firebaserc to get project ID
const firebaserc = JSON.parse(readFileSync('.firebaserc', 'utf8'));
const projectId = firebaserc.projects?.default || 'rhive-os';

// Use Application Default Credentials (gcloud auth)
initializeApp({ projectId });

const db = getFirestore();

async function main() {
    console.log(`\n🔧 Seeding test phone number into Firestore...`);
    console.log(`   Project: ${projectId}`);
    console.log(`   Phone: +639560213304\n`);

    // Check if test user already exists
    const existing = await db.collection('users')
        .where('phone', '==', '+639560213304')
        .limit(1)
        .get();

    if (!existing.empty) {
        const doc = existing.docs[0];
        console.log(`✅ User already exists: ${doc.id}`);
        console.log(`   Email: ${doc.data().email}`);
        console.log(`   Phone: ${doc.data().phone}`);
        return;
    }

    // Add test user
    const ref = await db.collection('users').add({
        name: 'Sheena Test User',
        email: 'sheena@rhive.com',
        phone: '+639560213304',
        role: 'Admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        _test: true // mark as test record
    });

    console.log(`✅ Test user created: ${ref.id}`);
    console.log(`   Phone: +639560213304`);
    console.log(`   Email: sheena@rhive.com`);
    console.log(`\n🎯 Now run: node test_sms_otp.mjs\n`);
}

main().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
