const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const checkoutRoutes = require("./routes/checkout");
const downloadRoutes = require("./routes/download");
const contactRoutes = require("./routes/contacts");
const paystackRoutes = require("./routes/paystack");
const paystackWebhook = require("./routes/paystackWebhook");

const app = express();

// ✅ CORS first
app.use(cors());

// ✅ Normal JSON middleware (for most routes)
app.use(express.json());

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use("/api/paystack", paystackRoutes);
app.use('/api', userRoutes);
app.use('/api', checkoutRoutes);
app.use('/api', downloadRoutes);
app.use("/api/contact", contactRoutes);

// ✅ Paystack Webhook (must read raw body)
app.post(
  "/api/paystack/webhook",
  express.raw({ type: "application/json" }), // capture raw body
  paystackWebhook
);

// ✅ Test route
app.get('/', (req, res) => {
  res.send('Sthazabot backend is running 🚀');
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is listening on port ${PORT}`);
});
