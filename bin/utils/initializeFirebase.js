"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
function initializeFirestore() {
    const serviceAccount = require("../../firebase_init.json");
    (0, app_1.initializeApp)({
        credential: (0, app_1.cert)(serviceAccount),
    });
    return (0, firestore_1.getFirestore)();
}
exports.default = initializeFirestore;
