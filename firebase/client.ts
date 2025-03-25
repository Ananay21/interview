// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBcaJZkPPCWHca8ZFYia2GbFHJjf7Anmpc",
  authDomain: "prepcoding-2501a.firebaseapp.com",
  projectId: "prepcoding-2501a",
  storageBucket: "prepcoding-2501a.firebasestorage.app",
  messagingSenderId: "274060132594",
  appId: "1:274060132594:web:cad8238ccb4b2ab368906b",
  measurementId: "G-ZWHPYF6QJ5"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);