/* script.js */
// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDoc, doc, updateDoc, Timestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// --- CONFIGURATION START ---
// COPY THIS FROM YOUR FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY_HERE",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
// --- CONFIGURATION END ---

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Export functions to be used by HTML files
export { db, collection, addDoc, getDoc, doc, updateDoc, Timestamp };

// --- UTILITY: HAVERSINE FORMULA (Calculate Distance) ---
export function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d * 1000; // Return in meters
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}
