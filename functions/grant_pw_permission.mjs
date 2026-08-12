import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync, existsSync } from 'fs';

let app;
try {
    if (existsSync('./service-account.json')) {
        const sa = JSON.parse(readFileSync('./service-account.json', 'utf8'));
        app = initializeApp({ credential: cert(sa) });
    } else {
        initializeApp({ projectId: 'rhive-os' });
    }
} catch(e) {
    console.error('Init error:', e.message);
    process.exit(1);
}

const db = getFirestore();

const snapshot = await db.collection('users').where('email', '==', 'james.g@rhiveconstruction.com').get();

if (snapshot.empty) {
    console.log('User not found with that email. Listing all users:');
    const all = await db.collection('users').limit(30).get();
    all.forEach(d => {
        const u = d.data();
        console.log(' -', d.id, '|', u.name ?? '?', '|', u.email ?? 'no-email', '|', u.role ?? '?');
    });
} else {
    for (const doc of snapshot.docs) {
        const data = doc.data();
        console.log('Found:', doc.id, data.name, data.email, data.role);
        await doc.ref.update({ can_change_passwords: true, updated_at: new Date().toISOString() });
        console.log('DONE: can_change_passwords=true set on', data.email);
    }
}
process.exit(0);
