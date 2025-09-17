// routes/auth.js
const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

// OPTIONAL: Use your DB here if you're storing users
// const User = require("../models/User"); // Example

router.post("/signup", async (req, res) => {
  const { uid, email } = req.body;

  try {
    // Just log or store user details — DO NOT create user in Firebase again
    console.log("Received new user signup:", uid, email);

    // Example: Save to your DB (optional)
    // await User.create({ uid, email });

    res.status(200).json({ message: "User saved successfully" });
  } catch (error) {
    console.error("Error saving user:", error.message);
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.post("/login", async (req, res) => {
  const { uid, email } = req.body;

  try {
    console.log("User logged in:", uid, email);

    // Optional: track logins or fetch user data from DB

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ error: "Login failed" });
  }
});

// backend/routes/auth.js
router.post('/logout', (req, res) => {
  const { uid } = req.body;
  console.log(`User with UID ${uid} logged out`);
  res.status(200).json({ message: 'Logout recorded' });
});



module.exports = router;
