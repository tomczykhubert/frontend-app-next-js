import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: "frontendapp-2d726.firebaseapp.com",
  projectId: "frontendapp-2d726",
  storageBucket: "frontendapp-2d726.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: "1:503581534265:web:7ff131264f1bf8cc2b85e8",
  measurementId: "G-R7152342HP",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
