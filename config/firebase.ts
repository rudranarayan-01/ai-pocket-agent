// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC92j_zmqRuFxTRLY55rQEkfI6KsOGcleg",
    authDomain: "ai-pocket-agent-30826.firebaseapp.com",
    projectId: "ai-pocket-agent-30826",
    storageBucket: "ai-pocket-agent-30826.firebasestorage.app",
    messagingSenderId: "627243627276",
    appId: "1:627243627276:web:6b8a3b5ec6da0a63db8f29",
    measurementId: "G-9FJ5F9HS42"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export async function initAnalyticsIfWeb() {
    if (Platform.OS !== "web") return null;                // bail on native
    if (typeof document === "undefined") return null;      // extra safety
    // dynamic import so bundlers don't execute web-only code on native
    const analyticsModule = await import("firebase/analytics");
    const { getAnalytics } = analyticsModule;
    return getAnalytics(app);
}

export const firestoreDb = getFirestore(app);