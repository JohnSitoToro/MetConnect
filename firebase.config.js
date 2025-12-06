// firebase.config.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔹 Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD51FZWIOH2E6IPWmrRzs-FapQTBAmuoQ8",
  authDomain: "med-connect-4fac7.firebaseapp.com",
  projectId: "med-connect-4fac7",
  storageBucket: "med-connect-4fac7.firebasestorage.app",
  messagingSenderId: "674656540884",
  appId: "1:674656540884:web:a0b7768e3c311071af8341",
  measurementId: "G-9F4H8YL45G"
};

// 🔹 Inicializar Firebase
const app = initializeApp(firebaseConfig);

// 🔹 Exportar servicios
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();