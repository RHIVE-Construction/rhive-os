import { initializeApp, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Safe check for import.meta.env to prevent crashes in non-Vite environments
const safeEnv = (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {}) as Record<string, string>;

// Check if Firebase environment variables are missing
const isFirebaseConfigMissing = 
    !safeEnv.VITE_FIREBASE_API_KEY || 
    !safeEnv.VITE_FIREBASE_PROJECT_ID;

if (isFirebaseConfigMissing) {
    console.warn(
        "⚠️ [RHIVE QOS] Firebase configuration environment variables are missing or empty!\n" +
        "The application is falling back to dummy mock credentials. Live database sync will be offline,\n" +
        "but the client-side seed mock database is active and fully functional on localhost."
    );
}

// Firebase Configuration using Environment Variables
// If variables are missing, provide mock placeholders to prevent fatal initializeApp crashes.
const firebaseConfig = {
    apiKey: safeEnv.VITE_FIREBASE_API_KEY || "mock-api-key-for-local-testing-only",
    authDomain: safeEnv.VITE_FIREBASE_AUTH_DOMAIN || "rhive-os-mock.firebaseapp.com",
    projectId: safeEnv.VITE_FIREBASE_PROJECT_ID || "rhive-os",
    storageBucket: safeEnv.VITE_FIREBASE_STORAGE_BUCKET || "rhive-os-mock.appspot.com",
    messagingSenderId: safeEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
    appId: safeEnv.VITE_FIREBASE_APP_ID || "1:000000000000:web:0000000000000000000000",
    measurementId: safeEnv.VITE_FIREBASE_MEASUREMENT_ID || "G-MOCK0000000"
};

console.log("RHIVE Debug Firebase Config:", {
    ...firebaseConfig,
    apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 8)}...` : 'undefined'
});

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase services
let analytics: Analytics | null = null;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

// Analytics only works in browser environment and may fail gracefully
if (typeof window !== 'undefined') {
    try {
        analytics = getAnalytics(app);
    } catch (e) {
        console.warn('Firebase Analytics not available:', e);
    }
}

// Initialize other services
auth = getAuth(app);
db = getFirestore(app);
storage = getStorage(app);

// Export initialized services
export { app, analytics, auth, db, storage };

