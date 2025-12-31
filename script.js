/* script.js */
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { 
    getFirestore, collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc, writeBatch, query, where, orderBy, Timestamp 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { 
    getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// --- PASTE YOUR FIREBASE CONFIG HERE ---
const firebaseConfig = {
  apiKey: "AIzaSyDcOx7keARxAM-W3aLoUzO1gDdfwsmp-PM",
  authDomain: "attendance-app-33e78.firebaseapp.com",
  projectId: "attendance-app-33e78",
  storageBucket: "attendance-app-33e78.firebasestorage.app",
  messagingSenderId: "947436572816",
  appId: "1:947436572816:web:d98f3b04ed7b32f4b14815"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // Initialize Auth

// Export everything needed
export { 
    db, auth, collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc, writeBatch, query, where, orderBy, Timestamp,
    GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged 
};

// --- UTILITY: HAVERSINE FORMULA ---
export function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; 
}

function deg2rad(deg) { return deg * (Math.PI / 180); }
