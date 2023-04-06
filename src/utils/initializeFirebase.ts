import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function initializeFirestore() {
    const serviceAccount = require("../../tech-blog-crawling-firebase-adminsdk-ve5xq-03ce44f69c.json");

    initializeApp({
        credential: cert(serviceAccount),
    });

    const db = getFirestore();

    return db;
}

export default initializeFirestore;