/**
 * check-mail-collection.mjs
 * Reads the last 10 docs from the Firestore 'mail' collection
 * and prints their delivery status — tells us if the extension is
 * actually processing them or silently failing.
 *
 * Usage: node check-mail-collection.mjs
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load service account from the standard Firebase CLI location
// (uses Application Default Credentials if no service account found)
let app;
try {
    // Try GOOGLE_APPLICATION_CREDENTIALS env var first
    app = initializeApp({ projectId: 'rhive-os' });
} catch (e) {
    app = initializeApp({ projectId: 'rhive-os' });
}

const db = getFirestore(app);

console.log('\n════════════════════════════════════════════');
console.log('  RHIVE — Firestore mail collection check');
console.log('════════════════════════════════════════════\n');

try {
    const snap = await db.collection('mail')
        .orderBy('createdAt', 'desc')
        .limit(10)
        .get();

    if (snap.empty) {
        console.log('⚠️  mail collection is EMPTY — no documents found.');
        console.log('   This means sendSignVerifyEmail is NOT writing to Firestore.\n');
        process.exit(0);
    }

    console.log(`Found ${snap.size} recent mail document(s):\n`);

    snap.forEach((doc, i) => {
        const d = doc.data();
        const delivery = d.delivery || {};
        const state = delivery.state || 'PENDING (not yet picked up)';
        const error = delivery.error || null;
        const attempts = delivery.attempts || 0;
        const endTime = delivery.endTime?.toDate?.() || null;

        console.log(`─── [${i + 1}] Doc ID: ${doc.id}`);
        console.log(`    To      : ${JSON.stringify(d.to)}`);
        console.log(`    Subject : ${d.message?.subject || '(none)'}`);
        console.log(`    Created : ${d.createdAt?.toDate?.() || '(no timestamp)'}`);
        console.log(`    State   : ${state}`);
        console.log(`    Attempts: ${attempts}`);
        if (endTime) console.log(`    EndTime : ${endTime}`);
        if (error)   console.log(`    ❌ Error : ${error}`);
        console.log('');
    });

    // Summary diagnosis
    const allStates = snap.docs.map(d => d.data().delivery?.state || 'PENDING');
    const hasPending = allStates.some(s => s === 'PENDING');
    const hasError   = allStates.some(s => s === 'ERROR');
    const hasSent    = allStates.some(s => s === 'SUCCESS');

    console.log('─── Diagnosis ───────────────────────────────');
    if (hasSent)    console.log('✅ At least one email was delivered successfully.');
    if (hasPending) console.log('⏳ Documents stuck in PENDING — extension is not processing them.');
    if (hasError)   console.log('❌ Delivery errors found — check OAuth2/SMTP config.');
    if (!hasPending && !hasError && !hasSent) console.log('ℹ️  Unknown state — check individual docs above.');
    console.log('');

} catch (err) {
    console.error('❌ Failed to read Firestore:', err.message);
    console.log('\nTry: GOOGLE_APPLICATION_CREDENTIALS=path/to/serviceAccount.json node check-mail-collection.mjs');
    process.exit(1);
}
