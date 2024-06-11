import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function initializeFirestore() {
    const serviceAccount = require("../../firebase_init.json");

    initializeApp({
        credential: cert(serviceAccount),
    });

    return getFirestore();
}

export default initializeFirestore;