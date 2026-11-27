import { initializeApp, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Vite replaces import.meta.env.VITE_* at BUILD time — never at runtime.
// Reading directly avoids the dynamic safeEnv lookup that minification can break.
const FIREBASE_API_KEY         = import.meta.env.VITE_FIREBASE_API_KEY         as string | undefined;
const FIREBASE_AUTH_DOMAIN     = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN     as string | undefined;
const FIREBASE_PROJECT_ID      = import.meta.env.VITE_FIREBASE_PROJECT_ID      as string | undefined;
const FIREBASE_STORAGE_BUCKET  = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET  as string | undefined;
const FIREBASE_MESSAGING_ID    = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined;
const FIREBASE_APP_ID          = import.meta.env.VITE_FIREBASE_APP_ID          as string | undefined;
const FIREBASE_MEASUREMENT_ID  = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID  as string | undefined;

// Firebase Web SDK config values are public browser identifiers (same values as apphosting.yaml).
// Env vars still take precedence when injected at build time, with the live `rhive-os`
// public config as fallback so Google Sign-In / Connect Email never fails with
// `auth/api-key-not-valid` when `.env` is absent (e.g. fresh clones or CI/preview builds).
const firebaseConfig = {
    apiKey:            FIREBASE_API_KEY           || "AIzaSyBI7Ae41_JcMtHLuAzit3ajoTRHjETtCt8",
    authDomain:        FIREBASE_AUTH_DOMAIN        || "rhive-os.firebaseapp.com",
    projectId:         FIREBASE_PROJECT_ID         || "rhive-os",
    storageBucket:     FIREBASE_STORAGE_BUCKET     || "rhive-os.firebasestorage.app",
    messagingSenderId: FIREBASE_MESSAGING_ID       || "672274474306",
    appId:             FIREBASE_APP_ID             || "1:672274474306:web:542a4f84bad36a114e14db",
    ...(FIREBASE_MEASUREMENT_ID ? { measurementId: FIREBASE_MEASUREMENT_ID } : {}),
};

const isRealFirebaseConfig =
    !!firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== "mock-api-key-for-local-testing-only" &&
    !!firebaseConfig.projectId &&
    !!firebaseConfig.appId;

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase services
let analytics: Analytics | null = null;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

// Analytics: ONLY initialize when:
//   1. Running in a browser context.
//   2. A real (non-mock) Firebase config is present.
//   3. A valid measurementId was provided.
//
// Skipping Analytics with a mock config prevents the production error:
//   "@firebase/analytics: Failed to fetch this Firebase app's measurement ID
//    from the server. Falling back to the measurement ID G-MOCK0000000 ...
//    [Analytics: Dynamic config fetch failed: [400] API key not valid.]"
if (typeof window !== 'undefined' && isRealFirebaseConfig && !!FIREBASE_MEASUREMENT_ID) {
    try {
        analytics = getAnalytics(app);
    } catch (e) {
        console.warn('[RHIVE] Firebase Analytics unavailable:', e);
    }
}

// Initialize other services
auth    = getAuth(app);
db      = getFirestore(app);
storage = getStorage(app);

// Export initialized services
export { app, analytics, auth, db, storage };
