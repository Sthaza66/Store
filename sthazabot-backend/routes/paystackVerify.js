// routes/paystackVerify.js
const express = require("express");
const fetch = require("node-fetch");
const { db } = require("../firebase/firebaseAdmin");
const router = express.Router();

router.get("/verify/:reference", async (req, res) => {
  const { reference } = req.params;

  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    });
    const data = await response.json();

    if (!data.status) throw new Error(data.message);

    const trx = data.data;
    if (trx.status === "success") {
      // ✅ save order
      await db.collection("orders").add({
        uid: trx.metadata.uid,
        productId: trx.metadata.productId,
        reference: trx.reference,
        amount: trx.amount,
        email: trx.customer.email,
        createdAt: new Date(),
      });

      // redirect to frontend success page
      return res.redirect(`${process.env.VITE_BACKEND_URL}/success?reference=${reference}`);
    } else if (trx.status === "failed") {
      return res.redirect(`${process.env.VITE_BACKEND_URL}/decline`);
    } else {
      return res.redirect(`${process.env.VITE_BACKEND_URL}/dashboard`);
    }
  } catch (err) {
    console.error("❌ Paystack Verify Error:", err.message);
    res.redirect(`${process.env.VITE_BACKEND_URL}/decline`);
  }
});

module.exports = router;
