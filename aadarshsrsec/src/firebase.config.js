import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// REPLACE with your actual Firebase Console keys
const firebaseConfig = {
  apiKey: "AIzaSyBfh0j4C0Z0UqN8rYbjTRtcQQomL9Kmnpk",
  authDomain: "aadarshsrsec.firebaseapp.com",
  projectId: "aadarshsrsec",
  storageBucket: "aadarshsrsec.firebasestorage.app",
  messagingSenderId: "604324358156",
  appId: "1:604324358156:web:299ab66c607949f75ea629",
  measurementId: "G-4VT83K3FT2"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);