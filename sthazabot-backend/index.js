// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const checkoutRoutes = require("./routes/checkout");
const downloadRoutes = require("./routes/download");
const contactRoutes = require("./routes/contacts");
const orderRoutes = require("./routes/orders");
const notificationRoutes = require("./routes/notifications");
const { router: productsRouter } = require("./routes/products");

// ✅ Yoco routes
const yocoInit = require("./routes/yoko.init");
const yocoWebhook = require("./webhooks/yocoWebhook");

const app = express();

// ✅ Enable CORS for your frontend
app.use(
  cors({
    origin: "https://sthazabot-inc.netlify.app",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Yoco Webhook FIRST with raw body
app.post(
  "/yoco/webhook",
  express.raw({ type: "*/*" }),
  yocoWebhook
);

// ✅ JSON middleware AFTER webhook
app.use(express.json());

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/yoco", yocoInit); // Yoco init route
app.use("/api", userRoutes);
app.use("/api", checkoutRoutes);
app.use("/api", downloadRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/products", productsRouter);

// ✅ Health check
app.get("/", (req, res) => {
  res.send("🚀 Sthazabot backend running with Yoco integration");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server is running on port ${PORT}`));
