const express = require("express");
const axios = require("axios");
const router = express.Router();
const { products } = require("./products"); // your product list

// ⚡ Initialize Paystack Transaction
router.post("/init", async (req, res) => {
  try {
    const { productId, email, uid } = req.body;

    if (!productId || !email) {
      return res.status(400).json({ error: "Product ID and email are required" });
    }

    const product = products[productId];
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const amount = product.price * 100; // Paystack amount in kobo

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount,
        metadata: { productId: product.id, productName: product.name, uid },
        callback_url: `${process.env.BACKEND_URL}/api/paystack/verify`, // Paystack hits backend
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.json(response.data.data); // send authorization URL to frontend
  } catch (error) {
    console.error("Paystack Init Error:", error.response?.data || error.message);
    return res.status(400).json({ error: "Failed to initialize Paystack payment" });
  }
});

// ⚡ Verify Payment (Paystack callback)
router.get("/verify", async (req, res) => {
  const reference = req.query.reference; // Paystack sends ?reference=...

  if (!reference) {
    return res.redirect(`${process.env.VITE_BACKEND_URL}/declined`);
  }

  try {
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    });

    const { status, amount, metadata } = response.data.data;

    if (status === "success") {
      // Success → redirect to frontend /success page
      return res.redirect(
        `${process.env.VITE_BACKEND_URL}/success?product=${encodeURIComponent(metadata.productName)}&amount=${amount / 100}`
      );
    } else {
      // Declined or failed
      return res.redirect(`${process.env.VITE_BACKEND_URL}/declined`);
    }
  } catch (error) {
    console.error("Paystack Verify Error:", error.response?.data || error.message);
    return res.redirect(`${process.env.VITE_BACKEND_URL}/declined`);
  }
});

module.exports = router;
