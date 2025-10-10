const express = require("express");
const router = express.Router();

const products = {
  "1": {
    id: "1",
    name: "Robotrader AI",
    description: "An advanced trading bot for MetaTrader 5 with 90% win rate.",
    price: 500,
    icon: "bot",
    storagePath: "products/1/RobotraderAI.zip"
  },
  "2": {
    id: "2",
    name: "Forex Analyzer",
    description: "A powerful market structure analysis tool.",
    price: 350,
    icon: "cpu",
    storagePath: "products/2/smartbuilder.zip"
  },
  "3": {
    id: "3",
    name: "Smart EA Builder",
    description: "AI-powered Expert Advisor builder for traders.",
    price: 1000,
    icon: "settings",
    storagePath: "products/3/SmartEABuilder.zip"
  },
};

// Get all products
router.get("/", (req, res) => {
  res.json(Object.values(products));
});

// Get product by ID
router.get("/:id", (req, res) => {
  const product = products[String(req.params.id)];
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

module.exports = { router, products };
