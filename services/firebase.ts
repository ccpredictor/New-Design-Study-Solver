
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// Fixed: Corrected modular named exports for Firebase Auth services
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDPJEEvdVfDEvOECh1Pc0L4RByImJ5x8gw",
  authDomain: "ai-study-solver.firebaseapp.com",
  projectId: "ai-study-solver",
  storageBucket: "ai-study-solver.firebasestorage.app",
  messagingSenderId: "327600523437",
  appId: "1:327600523437:web:b722e3568b05aa0d90de24",
  measurementId: "G-TRMJ4FKY7T"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Initialize each service with the app instance
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { app, analytics, auth, db, storage, googleProvider };
