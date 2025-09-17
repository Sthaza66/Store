const express = require('express');
const router = express.Router();
const { admin, db } = require('../firebase/firebaseAdmin'); // Import admin and db

// @route    POST /api/profile/:uid
// @desc     Create or update a user's profile in Firestore
// @access   Public (you can protect it later with middleware)
router.post('/profile/:uid', async (req, res) => {
  const { uid } = req.params;
  const { name, email, phoneNumber, photoURL } = req.body;

  if (!uid || !email || !name) {
    return res.status(400).json({ error: 'UID, name, and email are required.' });
  }

  try {
    const userRef = db.collection('users').doc(uid);
    const doc = await userRef.get();

    const userData = {
      name,
      email,
      phoneNumber: phoneNumber || '',
      photoURL: photoURL || '',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (!doc.exists) {
      userData.createdAt = admin.firestore.FieldValue.serverTimestamp();
      await userRef.set(userData);
      return res.status(201).json({ message: 'User profile created successfully.' });
    } else {
      await userRef.update(userData);
      return res.status(200).json({ message: 'User profile updated successfully.' });
    }
  } catch (error) {
    console.error('🔥 Error updating/creating profile:', error);
    return res.status(500).json({ error: 'Failed to create or update profile.' });
  }
});

// @route    GET /api/profile/:uid
// @desc     Retrieve a user's profile from Firestore
// @access   Public
router.get('/profile/:uid', async (req, res) => {
  const { uid } = req.params;

  if (!uid) {
    return res.status(400).json({ error: 'UID is required.' });
  }

  try {
    const userRef = db.collection('users').doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'User profile not found.' });
    }

    return res.status(200).json(doc.data());
  } catch (error) {
    console.error('🔥 Error fetching profile:', error);
    return res.status(500).json({ error: 'Failed to fetch profile.' });
  }
});

// @route    POST /api/profile/save-token
// @desc     Save FCM token for a user
// @access   Public
router.post("/profile/save-token", async (req, res) => {
  const { token, userId } = req.body;

  if (!token || !userId) {
    return res.status(400).json({ error: "Token and userId are required." });
  }

  try {
    await db.collection("users").doc(userId).set({ fcmToken: token }, { merge: true });
    res.status(200).json({ message: "FCM token saved" });
  } catch (err) {
    console.error("🔥 Save token error:", err.message);
    res.status(500).json({ error: "Failed to save token" });
  }
});

module.exports = router;
