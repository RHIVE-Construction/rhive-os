/**
 * This script:
 * 1. Fetches a real contact from Firebase Firestore
 * 2. Uses their phone number to call the live justCallLookup endpoint
 * 3. Verifies the callbot correctly identifies them
 */
const axios = require('axios');
const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const LOOKUP_URL = 'https://us-central1-rhive-os.cloudfunctions.net/justCallLookup';

async function run() {
    // Initialize Firebase Admin
    if (admin.apps.length === 0) {
        admin.initializeApp({ projectId: 'rhive-os' });
    }

    const db = admin.firestore();
    const fs = require('fs');

    console.log('Fetching first 5 contacts from Firestore...\n');
    let testPhone = null;
    let testContact = null;

    try {
        const snap = await db.collection('contacts').limit(5).get();

        if (snap.empty) {
            console.log('⚠️  No contacts found in Firestore. Make sure your CRM has contact records.');
            process.exit(0);
        }

        // Print all contacts found
        snap.docs.forEach((doc, i) => {
            const d = doc.data();
            console.log(`[${i + 1}] ${d.first_name || ''} ${d.last_name || ''} | Phone: ${d.phone || 'NO PHONE'} | Status: ${d.status || 'N/A'}`);
        });

        // Pick first contact that has a phone number
        for (const doc of snap.docs) {
            const d = doc.data();
            if (d.phone) {
                testPhone = d.phone;
                testContact = d;
                break;
            }
        }

        if (!testPhone) {
            console.log('\n⚠️  None of the contacts have a phone number stored.');
            process.exit(0);
        }

    } catch (err) {
        console.error('Firestore Error:', err.message);
        // If no credentials, try a hardcoded number instead
        testPhone = process.argv[2];
        if (!testPhone) {
            console.log('Pass a phone number as argument: node test_e2e_callbot.js +1XXXXXXXXXX');
            process.exit(1);
        }
    }

    console.log(`\n${'='.repeat(55)}`);
    console.log(`Testing callbot lookup with phone: ${testPhone}`);
    console.log('='.repeat(55));

    try {
        const res = await axios.get(LOOKUP_URL, {
            params: { phone: testPhone },
            timeout: 15000
        });

        const d = res.data;
        fs.writeFileSync('e2e_result.json', JSON.stringify(d, null, 2));

        console.log('\n✅ Callbot Lookup Result:');
        console.log(`  Contact Found:  ${d.found ? '🟢 YES' : '🔴 NO'}`);
        console.log(`  Name:           ${d.firstName} ${d.lastName}`);
        console.log(`  Status:         ${d.status}`);
        console.log(`  Last Project:   ${d.lastProject}`);
        console.log(`  AI Greeting:    "${d.personalizedGreeting}"`);

        if (d.found) {
            console.log('\n✅ SUCCESS: The callbot correctly fetched the contact from Firebase!');
        } else {
            console.log('\n⚠️  Contact not found. Check the phone format stored in Firestore vs what was sent.');
            if (testContact) {
                console.log(`  Firestore phone: "${testContact.phone}"`);
                console.log(`  Sent phone:      "${testPhone}"`);
                console.log('  These must match exactly (including +1 prefix, formatting etc.)');
            }
        }

    } catch (err) {
        console.error('\n❌ Lookup Failed:', err.response?.status, err.response?.data || err.message);
    }
}

run();
