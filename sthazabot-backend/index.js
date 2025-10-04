// index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const checkoutRoutes = require("./routes/checkout");
const downloadRoutes = require("./routes/download");
const contactRoutes = require("./routes/contacts");
const paystackRoutes = require("./routes/paystack");
const paystackInit = require("./routes/paystackInit"); 
const paystackWebhook = require("./routes/paystackWebhook");
const orderRoutes = require("./routes/orders");
const notificationRoutes = require("./routes/notifications");
const { router: productsRouter } = require("./routes/products");




const app = express();

// ✅ Enable CORS
app.use(cors());

// ✅ Webhook FIRST with raw body
app.post(
  "/paystack/webhook",
  express.raw({ type: "*/*" }),
  paystackWebhook
);

// ✅ JSON middleware AFTER webhook
app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/paystack", paystackRoutes);  
app.use("/api/paystack", paystackInit);
app.use("/api", userRoutes);
app.use("/api", checkoutRoutes);
app.use("/api", downloadRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/products", productsRouter);


// ✅ Health check
app.get("/", (req, res) => {
  res.send("Sthazabot backend is running 🚀");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server is listening on port ${PORT}`)
);
