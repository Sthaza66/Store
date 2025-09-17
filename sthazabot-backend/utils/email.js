const sgMail = require("@sendgrid/mail");

// Set API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendDownloadEmail(email, productId) {
  const downloadLink = `${process.env.FRONTEND_URL}/download/${productId}`;

  const msg = {
    to: email,
    from: `noreply@sthazabot.store`, // Use your verified domain
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

  try {
    await sgMail.send(msg);
    console.log("📧 Download email sent to:", email);
  } catch (error) {
    console.error("❌ SendGrid error:", error.response?.body || error.message);
    throw new Error("Failed to send email");
  }
}

module.exports = { sendDownloadEmail };
