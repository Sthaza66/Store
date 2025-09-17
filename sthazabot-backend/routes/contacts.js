const express = require("express");
const router = express.Router();
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ✅ POST /api/contact
router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const msg = {
    to: "support@sthazabot.store", // 📥 Always goes to your support inbox
    from: {
      email: "no-reply@sthazabot.store", // ✅ Must be verified in SendGrid
      name: name, // 👤 Client’s name shows in "From"
    },
    replyTo: email, // 🔑 So you can reply directly to the client
    subject: `📬 New Contact Message from ${name}`,
    html: `
      <h3>New Contact Message</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong><br>${message}</p>
    `,
  };

  try {
    await sgMail.send(msg);
    return res.status(200).json({ message: "Message sent successfully!" });
  } catch (err) {
    console.error("❌ SendGrid error:", err.response?.body || err.message);
    return res.status(500).json({ error: "Failed to send message." });
  }
});

module.exports = router;
