const crypto = require("crypto");
const sendEmail = require("../utils/email");

module.exports = async (req, res) => {
  try {
    // ✅ Verify Paystack signature
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(req.body)
      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      return res.status(401).send("Invalid signature");
    }

    const event = JSON.parse(req.body.toString());

    if (event.event === "charge.success") {
      const { reference, amount, customer, metadata } = event.data;

      console.log("✅ Payment confirmed:", reference);

      // ✅ Save order in DB (pseudo-code)
      // await db.orders.add({ uid: metadata.uid, productId: metadata.productId, reference, amount });

      // ✅ Send download link via SendGrid
      await sendEmail({
        to: customer.email,
        subject: "Your Download Link",
        text: `Thanks for your purchase! Here’s your link: ${process.env.VITE_BACKEND_URL}/download/${metadata.productId}`,
      });
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Webhook error:", err.message);
    res.sendStatus(500);
  }
};
