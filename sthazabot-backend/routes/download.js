// routes/download.js
const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

// Dummy product data
const products = {
  "1": {
    name: "Robotrader",
    price: 299,
    storagePath: "products/1/robotrader.zip",
  },
};

router.post("/download", async (req, res) => {
  const { productId } = req.body;

  const product = products[productId];
  if (!product) {
    return res.status(404).json({ error: "Invalid product ID" });
  }

  try {
    // ✅ This is where the link is created
    const file = admin.storage().bucket().file(product.storagePath);

    const [url] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 60 * 60 * 1000, // 1 hour
    });

    return res.json({ downloadUrl: url });
  } catch (error) {
    console.error("Error generating download link:", error);
    return res.status(500).json({ error: "Download failed" });
  }
});

module.exports = router;
