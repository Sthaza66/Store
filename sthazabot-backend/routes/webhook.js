const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { admin, db, bucket } = require("../firebase/firebaseAdmin");
const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");

// ✅ Setup SendGrid transporter
const transporter = nodemailer.createTransport(
  sgTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);

// 🔔 Push notification sender
const sendPurchaseNotification = async (userId, productName) => {
  try {
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) return console.warn("User not found");

    const { fcmToken } = userDoc.data();
    if (!fcmToken) return console.warn("No FCM token for user");

    const message = {
      notification: {
        title: `${productName} Purchased 🎉`,
        body: "Check your email for the download link. It expires in 1 hour.",
      },
      token: fcmToken,
    };

    await admin.messaging().send(message);
    console.log("✅ Push notification sent");
  } catch (err) {
    console.error("❌ Failed to send push notification:", err.message);
  }
};

// Stripe Webhook Handler
router.post("/", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("⚠️ Stripe signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ✅ When a payment is successful
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { uid, productId, productName, price } = session.metadata;
    const email = session.customer_email;

    try {
      // 🔐 Generate download link from Firebase Storage
      const filePath = `products/${productId}/${productName.replace(/\s+/g, "")}.zip`;
      const file = bucket.file(filePath);

      const [downloadUrl] = await file.getSignedUrl({
        action: "read",
        expires: Date.now() + 60 * 60 * 1000, // 1 hour
      });

      // 📩 Send email with download link
      await transporter.sendMail({
        from: `"Sthazabot Team" <no-reply@sthazabot.store>`, // ✅ your verified sender
        to: email, // 📥 customer's email
        subject: `Your ${productName} is ready to download!`,
        html: `
          <h2>Thanks for purchasing ${productName} 🎉</h2>
          <p>Click the link below to download. It expires in 1 hour:</p>
          <a href="${downloadUrl}" style="color: blue;">Download ${productName}</a>
          <br /><br />
          <strong>Installation Instructions:</strong>
          <ul>
            <li>Unzip the file</li>
            <li>Open MetaTrader 5 → File → Open Data Folder → MQL5 → Experts</li>
            <li>Paste the bot here, then restart MT5</li>
          </ul>
          <p>If you need help, contact us at <a href="mailto:support@sthazabot.store">support@sthazabot.store</a></p>
        `,
      });

      // 🧾 Save Order
      await db.collection("orders").add({
        uid,
        email,
        productId,
        productName,
        price: parseFloat(price),
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });

      // 🔔 Create Notification in DB
      await db.collection("notifications").add({
        uid,
        productId,
        message: `You purchased ${productName} for $${price}`,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        read: false,
      });

      // 🚀 Send Push Notification
      await sendPurchaseNotification(uid, productName);

      console.log("✅ Email, DB, and push notification completed");
    } catch (err) {
      console.error("❌ Webhook process failed:", err);
    }
  }

  res.status(200).json({ received: true });
});

module.exports = router;
