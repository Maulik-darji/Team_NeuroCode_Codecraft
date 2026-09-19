import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDTdk4-zJ1bzvX795diDYyBx3sgtAXg3TA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "circleloop-01.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "circleloop-01",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "circleloop-01.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "633641825251",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:633641825251:web:91f2acfccb407960b426d6",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-69H5Q8ELRZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Analytics (browser environment check)
export let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export default app;
