"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
function initializeFirestore() {
    const serviceAccount = require("../../tech-blog-crawling-firebase-adminsdk-ve5xq-03ce44f69c.json");
    (0, app_1.initializeApp)({
        credential: (0, app_1.cert)(serviceAccount),
    });
    const db = (0, firestore_1.getFirestore)();
    return db;
}
exports.default = initializeFirestore;
