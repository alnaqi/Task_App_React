// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1zJv0p95emPDPOhbj2IV5ltBOgky5OR0",
  authDomain: "ba8alh.firebaseapp.com",
  projectId: "ba8alh",
  storageBucket: "ba8alh.appspot.com",
  messagingSenderId: "977163847690",
  appId: "1:977163847690:web:a947bfa79824fe8c95b7f3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const db = getFirestore(app)