// src/firebase.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsGjs2AtcADp7z0Ct4XHT-w7-bPRxEk50",
  authDomain: "zylo-lms.firebaseapp.com",
  projectId: "zylo-lms",
  storageBucket: "zylo-lms.appspot.com", // ✅ Corrected
  messagingSenderId: "24340429374",
  appId: "1:24340429374:web:28538a5f90094318d5af6f",
  measurementId: "G-PFLKQRC7TC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize individual services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

// Export all Firebase services
export { auth, db, storage, analytics };
