// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBF5J6dC8Cgo9YyFanlSKgcIFEnvBes4cY",
  authDomain: "login1-f1143.firebaseapp.com",
  projectId: "login1-f1143",
  storageBucket: "login1-f1143.firebasestorage.app",
  messagingSenderId: "722603114262",
  appId: "1:722603114262:web:0223d69754104bfd801a37",
  measurementId: "G-WM2LL540HV"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);