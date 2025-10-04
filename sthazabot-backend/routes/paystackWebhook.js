// paystackWebhook.js
const crypto = require("crypto");
const sgMail = require("@sendgrid/mail");
const { db } = require("../firebase/firebaseAdmin");

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// -------------------------------
// 1️⃣ Define the email function first
// -------------------------------

async function sendDownloadEmail(email, productId) {
  console.log("sendDownloadEmail called for:", email, "Product:", productId);

  try {
    // ✅ Ask backend for the signed Firebase download URL
    const res = await fetch(`${process.env.BACKEND_URL}/api/download`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });

    const data = await res.json();
    if (!data.downloadUrl) {
      throw new Error("No download URL returned from backend");
    }

    const downloadLink = data.downloadUrl;

    const msg = {
      to: email,
      from: `noreply@sthazabot.store`, // ✅ verified sender
      subject: "Your Sthazabot Download Link",
      html: `
        <h2>Thank you for your purchase from Sthazabot! 🎉</h2>
        <p>Your download is ready. Click below to access it:</p>
        <a href="${downloadLink}" 
           style="background:#2563eb;color:#fff;padding:12px 20px;text-decoration:none;border-radius:8px;display:inline-block;font-weight:bold;">
          Download Now
        </a>
        <p style="margin-top:20px;">If the button doesn’t work, copy this link into your browser:</p>
        <p><a href="${downloadLink}">${downloadLink}</a></p>
        <hr/>
        <small>This email was sent by Sthazabot.store. If you did not make this purchase, please contact support.</small>
      `,
    };

    await sgMail.send(msg);
    console.log("📧 Download email sent to:", email);
  } catch (error) {
    console.error("❌ Error in sendDownloadEmail:", error.message);
    if (error.response?.body) {
      console.error(error.response.body);
    }
    throw new Error("Failed to send email");
  }
}
// -------------------------------
// 2️⃣ Exported webhook handler
// -------------------------------
module.exports = async (req, res) => {
  try {
    console.log("sendDownloadEmail at webhook start:", typeof sendDownloadEmail);

    // Verify signature
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(req.body)
      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      console.log("❌ Invalid Paystack signature");
      return res.status(401).send("Invalid signature");
    }

    // Parse raw body
    const event = JSON.parse(req.body.toString());

    if (event.event === "charge.success") {
      const { reference, amount, customer, metadata } = event.data;

      console.log("✅ Payment confirmed:", reference);

      // Save order in Firestore
      await db.collection("orders").add({
        uid: metadata.uid,
        productId: metadata.productId,
        reference,
        amount,
        email: customer.email,
        createdAt: new Date(),
      });

      console.log("💾 Order saved to database");

      await db.collection("notifications").add({
        uid: metadata.uid,
        message: `✅ Your purchase of product ${metadata.productId} was successful.`,
        read: false,
        timestamp: new Date(),
      });

      console.log("🔔 Notification saved for uid:", metadata.uid);

      // Check if function exists before calling
      if (typeof sendDownloadEmail !== "function") {
        console.error("❌ sendDownloadEmail is NOT defined!");
      } else {
        await sendDownloadEmail(customer.email, metadata.productId);
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Webhook error:", err.message);
    res.sendStatus(500);
  }
};
