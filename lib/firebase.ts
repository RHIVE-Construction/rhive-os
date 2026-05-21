import { initializeApp, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Firebase Configuration using Environment Variables with safe fallbacks
// Firestore automatically creates collections when data is added.
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCOTpHodVEPLC3G96KwFnX8JF-0DOpgBBI",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "rhive-os.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "rhive-os",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "rhive-os.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "672274474306",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:672274474306:web:226d0a7064e8ae894e14db",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-T8H6BQPK3H"
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
