const admin = require('firebase-admin');
if (!admin.apps.length) admin.initializeApp({ projectId: 'rhive-os' });
const db = admin.firestore();

db.collection('password_reset_rate_limits').get().then(snap => {
    const deletes = snap.docs.map(d => d.ref.delete());
    return Promise.all(deletes).then(() => {
        console.log('Cleared ' + snap.docs.length + ' rate limit documents.');
        process.exit(0);
    });
}).catch(e => { console.error(e.message); process.exit(1); });
