// routes/yoco.init.js
const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

router.post("/init", async (req, res) => {
  const { productId, email, uid } = req.body;

  if (!productId || !email || !uid) {
    return res.status(400).json({ error: "productId, email, and uid are required" });
  }

  try {
    // 🧾 1. Fetch product details from your own backend
    const productRes = await fetch(`${process.env.BACKEND_URL}/api/products/${productId}`);
    if (!productRes.ok) throw new Error(`Failed to fetch product: ${productRes.status}`);
    const product = await productRes.json();

    console.log("🛍️ Product fetched:", product);

    // 🪝 2. Create checkout with Yoco
    const yocoResponse = await fetch("https://payments.yoco.com/api/checkouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.YOCO_SECRET_KEY}`,
      },
      body: JSON.stringify({
        amount: Math.round(product.price * 100), // convert R350 → 35000 cents
        currency: "ZAR",
        successUrl: `${process.env.VITE_BACKEND_URL}/success`,
        cancelUrl: `${process.env.VITE_BACKEND_URL}/declined`,
        metadata: {
          uid,
          email,
          productId: product.id,
          productName: product.name,
        },
      }),
    });

    // 🧠 Log status and raw response
    console.log("📡 Yoco response status:", yocoResponse.status);
    const rawText = await yocoResponse.text();
    console.log("📦 Raw Yoco response:", rawText);

    // ✅ Try to parse JSON after logging
    let yocoData;
    try {
      yocoData = JSON.parse(rawText);
    } catch (err) {
      console.error("❌ Failed to parse Yoco response as JSON:", err);
      return res.status(500).json({ error: "Invalid response from Yoco", raw: rawText });
    }

    console.log("💳 Parsed Yoco API response:", yocoData);

    // 🛑 If no redirect URL
    if (!yocoData.redirectUrl) {
      return res.status(500).json({
        error: "No Yoco redirect URL returned",
        details: yocoData,
      });
    }

    // ✅ Return URL to frontend
    res.json({ redirectUrl: yocoData.redirectUrl });

  } catch (err) {
    console.error("❌ Yoco Init Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
