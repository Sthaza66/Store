// routes/paystack.js
const express = require("express");
const axios = require("axios");
const router = express.Router();

// ✅ Initialize Paystack Transaction
router.post("/initialize", async (req, res) => {
  const { productId, productName, amount, email, uid } = req.body;

  if (!productId || !amount || !email || !uid) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Convert USD → cents (Paystack expects amount in kobo)
    const koboAmount = amount * 100;

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: koboAmount,
        currency: "ZAR", // 🇿🇦 change to "ZAR" if your Paystack account is ZAR based
        callback_url: `${process.env.VITE_BACKEND_URL}/success`, // where Paystack redirects after payment
        metadata: {
          uid,
          productId,
          productName,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.json(response.data.data); // send authorization_url to frontend
  } catch (err) {
    console.error("❌ Paystack init error:", err.response?.data || err.message);
    return res.status(500).json({ error: "Failed to initialize payment" });
  }
});

module.exports = router;
