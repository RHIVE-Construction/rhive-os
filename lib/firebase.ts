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

// True when all required Firebase identifiers are present (i.e. real production build).
// When false, the app is running on localhost without env vars — mock database is active.
const isRealFirebaseConfig =
    !!FIREBASE_API_KEY &&
    FIREBASE_API_KEY !== "mock-api-key-for-local-testing-only" &&
    !!FIREBASE_PROJECT_ID &&
    !!FIREBASE_APP_ID;

if (!isRealFirebaseConfig) {
    console.warn(
        "⚠️ [RHIVE QOS] Firebase env vars not found — using offline mock credentials.\n" +
        "Live database sync is disabled. The local mock database is active and fully functional."
    );
}

// Firebase Configuration — falls back to safe mock values only on localhost.
// On production (Firebase App Hosting), all VITE_* vars are injected at build time
// via apphosting.yaml so the fallbacks here are never reached in production.
const firebaseConfig = {
    apiKey:            FIREBASE_API_KEY           || "mock-api-key-for-local-testing-only",
    authDomain:        FIREBASE_AUTH_DOMAIN        || "rhive-os-mock.firebaseapp.com",
    projectId:         FIREBASE_PROJECT_ID         || "rhive-os",
    storageBucket:     FIREBASE_STORAGE_BUCKET     || "rhive-os-mock.appspot.com",
    messagingSenderId: FIREBASE_MESSAGING_ID       || "000000000000",
    appId:             FIREBASE_APP_ID             || "1:000000000000:web:0000000000000000000000",
    // Only pass measurementId when it is real — prevents Analytics from
    // making a dynamic config-fetch call with an invalid/mock ID, which
    // causes the "[Analytics: Dynamic config fetch failed: [400] API key not valid]" error.
    ...(FIREBASE_MEASUREMENT_ID ? { measurementId: FIREBASE_MEASUREMENT_ID } : {}),
};

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
