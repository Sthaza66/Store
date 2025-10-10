// webhooks/yocoWebhook.js
const crypto = require("crypto");
const { db } = require("../firebase/firebaseAdmin"); // Firebase Admin SDK
const fetch = require("node-fetch");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Helper: Send download email
async function sendDownloadEmail(email, productId) {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/api/download`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    const data = await res.json();
    if (!data.downloadUrl) throw new Error("No download URL from backend");

    const msg = {
      to: email,
      from: "noreply@sthazabot.store",
      subject: "Your Sthazabot Download Link",
      html: `<h2>Thank you for your purchase! 🎉</h2>
             <p>Click below to download your product:</p>
             <a href="${data.downloadUrl}" 
                style="background:#2563eb;color:#fff;padding:12px 20px;text-decoration:none;border-radius:8px;display:inline-block;font-weight:bold;">
               Download Now
             </a>`,
    };
    await sgMail.send(msg);
    console.log("📧 Download email sent to:", email);
  } catch (err) {
    console.error("❌ sendDownloadEmail error:", err.message);
  }
}

// Verify Yoco webhook signature
function verifyYocoSignature(req, secret) {
  const signature = req.headers["yoco-signature"];
  const payload = req.body.toString();
  const hmac = crypto.createHmac("sha256", secret).update(payload).digest("base64");
  return signature === hmac;
}

// Yoco webhook handler
module.exports = async (req, res) => {
  try {
    // ✅ Verify signature first
    if (!verifyYocoSignature(req, process.env.YOCO_WEBHOOK_SECRET)) {
      console.warn("⚠️ Invalid Yoco webhook signature");
      return res.sendStatus(401);
    }

    // Parse raw body
    const event = JSON.parse(req.body.toString());
    console.log("💳 Yoco Webhook event received:", JSON.stringify(event, null, 2));

    const payload = event.payload;
    if (!payload) {
      console.warn("⚠️ No payload in webhook");
      return res.sendStatus(400);
    }

    // Only handle successful payments
    if (payload.status === "succeeded") {
      const { metadata, amount, id: paymentId } = payload;

      // Save order in Firebase
      await db.collection("orders").add({
        uid: metadata.uid,
        productId: metadata.productId,
        checkoutId: metadata.checkoutId,
        amount,
        email: metadata.email,
        paymentId,
        createdAt: new Date(),
      });
      console.log("💾 Order saved in Firebase:", metadata);

      // Send notification
      await db.collection("notifications").add({
        uid: metadata.uid,
        message: `✅ Your purchase of product ${metadata.productName} was successful.`,
        read: false,
        timestamp: new Date(),
      });

      // Send download email
      await sendDownloadEmail(metadata.email, metadata.productId);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Yoco webhook error:", err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
};
