// routes/paystack.js
const express = require("express");
const router = express.Router();
const axios = require("axios");

// Helper: use env
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

if (!PAYSTACK_SECRET) {
  console.warn("⚠️ PAYSTACK_SECRET_KEY missing in env");
}

// Initialize Paystack transaction and return authorization_url
router.post("/initialize", async (req, res) => {
  try {
    const { uid, email, productId, productName, price, currency = "ZAR" } = req.body;

    if (!email || !productId || !productName || !price) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Paystack expects smallest currency unit, so multiply by 100 (Rands -> cents)
    const amountInCents = Math.round(Number(price) * 100);

    const payload = {
      email,
      amount: amountInCents,
      currency,
      callback_url: `${process.env.VITE_BACKEND_URL}/success`, // user returns here after payment
      metadata: {
        uid,
        productId,
        productName,
      },
    };

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      payload,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;
    if (!data || !data.status) {
      return res.status(500).json({ error: "Paystack initialize failed", detail: data });
    }

    // return authorization url and reference
    return res.json({
      authorization_url: data.data.authorization_url,
      reference: data.data.reference,
    });
  } catch (err) {
    console.error("Paystack init error:", err.response?.data || err.message);
    return res.status(500).json({ error: "Failed to initialize payment", detail: err.response?.data || err.message });
  }
});

module.exports = router;
