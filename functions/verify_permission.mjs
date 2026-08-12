import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp({ projectId: 'rhive-os' });
const db = getFirestore();

const snap = await db.collection('users').doc('JevPZMb6J2TX6mzJv2LjGCziJLu2').get();
const data = snap.data();
console.log('=== James G user record ===');
console.log('Name:', data.name);
console.log('Email:', data.email);
console.log('Role:', data.role);
console.log('can_change_passwords:', data.can_change_passwords);
console.log('updated_at:', data.updated_at);
process.exit(0);
