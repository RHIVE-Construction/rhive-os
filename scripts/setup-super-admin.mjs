/**
 * setup-super-admin.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Re-creates the super admin user in the correct Firestore collection.
 *
 * Fixes applied vs previous run:
 *  ✅ Writes to "users" (lowercase) — matches what the app reads
 *  ✅ role = "Admin"                — matches the login role check  
 *  ✅ password_hash stored          — SHA-256 of the plain password
 *
 * Run: node scripts/setup-super-admin.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { initializeApp, cert, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { createHash } from 'crypto';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ID = 'rhive-os';

// ── SHA-256 hash (matches the browser crypto.subtle.digest implementation) ────
function sha256(text) {
  return createHash('sha256').update(text).digest('hex');
}

// ── Initialise Admin SDK ───────────────────────────────────────────────────────
const svcAccountPath = resolve(__dirname, '..', 'service-account.json');
let credential;
if (existsSync(svcAccountPath)) {
  credential = cert(JSON.parse(readFileSync(svcAccountPath, 'utf8')));
  console.log('🔑  Using service account JSON');
} else {
  credential = applicationDefault();
  console.log('🔑  Using Application Default Credentials');
}

initializeApp({ credential, projectId: PROJECT_ID });
const auth = getAuth();
const db   = getFirestore();

// ── 1. Clear Firestore "users" AND "Users" collections ───────────────────────
async function clearUsersCollections() {
  for (const colName of ['users', 'Users']) {
    console.log(`\n📂  Clearing Firestore "${colName}" collection…`);
    const snap = await db.collection(colName).get();
    if (snap.empty) { console.log('    Already empty.'); continue; }
    let batch = db.batch(); let i = 0;
    for (const doc of snap.docs) {
      batch.delete(doc.ref); i++;
      if (i % 499 === 0) { await batch.commit(); batch = db.batch(); }
    }
    await batch.commit();
    console.log(`    ✅  Deleted ${snap.size} document(s).`);
  }
}

// ── 2. Delete all Firebase Auth users ────────────────────────────────────────
async function clearAuthUsers() {
  console.log('\n🔐  Removing all Firebase Auth users…');
  let total = 0; let pageToken;
  do {
    const list = await auth.listUsers(1000, pageToken);
    if (list.users.length) {
      const res = await auth.deleteUsers(list.users.map(u => u.uid));
      total += res.successCount;
    }
    pageToken = list.pageToken;
  } while (pageToken);
  console.log(`    ✅  Deleted ${total} Auth user(s).`);
}

// ── 3. Create the super admin ─────────────────────────────────────────────────
async function createSuperAdmin() {
  const email        = 'james.g@rhiveconstruction.com';
  const plainPassword = 'pa$$word';
  const name          = 'James G';

  // Hash the password exactly like the browser does (SHA-256 hex)
  const password_hash = sha256(plainPassword);

  console.log(`\n👤  Creating super admin: ${email}`);

  // Create in Firebase Auth
  const userRecord = await auth.createUser({
    email,
    password: plainPassword,
    displayName: name,
    emailVerified: true,
  });

  // Write to Firestore "users" (lowercase) — this is the collection the app reads
  await db.collection('users').doc(userRecord.uid).set({
    id:            userRecord.uid,
    uid:           userRecord.uid,
    email,
    name,
    displayName:   name,
    firstName:     'James',
    lastName:      'G',
    role:          'Admin',          // matches the internal login role check
    password_hash,                   // SHA-256 hex — used by app login
    isActive:      true,
    createdAt:     new Date().toISOString(),
    updatedAt:     new Date().toISOString(),
    created_at:    new Date().toISOString(),
    updated_at:    new Date().toISOString(),
  });

  console.log(`    Auth UID      : ${userRecord.uid}`);
  console.log(`    Firestore     : users/${userRecord.uid}`);
  console.log(`    Role          : Admin`);
  console.log(`    Password hash : ${password_hash.substring(0, 16)}…`);
  console.log(`\n🎉  Done!`);
  console.log(`    Email    : ${email}`);
  console.log(`    Password : ${plainPassword}`);
  console.log(`\n    ➡️  Login via Internal Admin Access → Admin tab`);
}

// ── Main ─────────────────────────────────────────────────────────────────────
(async () => {
  try {
    await clearUsersCollections();
    await clearAuthUsers();
    await createSuperAdmin();
    process.exit(0);
  } catch (err) {
    console.error('\n❌  Error:', err.message);
    process.exit(1);
  }
})();
