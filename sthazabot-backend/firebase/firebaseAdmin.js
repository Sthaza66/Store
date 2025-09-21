// firebaseAdmin.js
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "sthazabot.firebasestorage.app", // ✅ Use .appspot.com not .firebasestorage.app
  });
}

const db = admin.firestore();
const bucket = admin.storage().bucket(); // ✅ properly initialized

module.exports = {
  admin,
  db,
  bucket,
};
