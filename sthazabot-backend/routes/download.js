// routes/download.js
const express = require("express");
const router = express.Router();
const { bucket } = require("../firebase/firebaseAdmin");
const {products} = require("../routes/products")

// Dummy product dat
router.post("/download", async (req, res) => {
  const { productId } = req.body;

   const product = products[productId] || products[String(productId)];
  if (!product) {
    return res.status(404).json({ error: "Invalid product ID" });
  }

  try {
    const file = bucket.file(product.storagePath);

    const [url] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 60 * 60 * 1000, // 1 hour
    });

    return res.json({
      productName: product.name,
      downloadUrl: url, // ✅ Direct Firebase signed URL
    });
  } catch (error) {
    console.error("❌ Error generating download link:", error);
    return res.status(500).json({ error: "Download failed" });
  }
});

module.exports = router;
