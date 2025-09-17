// src/pages/Buy.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Bot, Cpu, Settings2 } from "lucide-react";
import { db, auth } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { toast } from "react-toastify";

const productMap = {
  1: {
    name: "Robotrader AI",
    description: "An advanced trading bot for MetaTrader 5 with 90% win rate.",
    price: 99,
    icon: <Bot size={50} className="text-blue-600" />,
  },
  2: {
    name: "Sthazabot Binary Pro",
    description: "Binary options bot with trend and reversal detection.",
    price: 79,
    icon: <Cpu size={50} className="text-purple-600" />,
  },
  3: {
    name: "Smart EA Builder",
    description: "Drag-and-drop EA builder for non-coders.",
    price: 49,
    icon: <Settings2 size={50} className="text-green-600" />,
  },
};

const Buy = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const product = productMap[id];

  const handlePurchase = async () => {
    const user = auth.currentUser;

    if (!user) {
      toast.error("You must be signed in to buy a product.");
      return navigate("/login");
    }

    setIsLoading(true);

    try {
      // 👇 Call backend to initialize Paystack transaction
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/paystack/initialize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: id,
            productName: product.name,
            amount: product.price,
            email: user.email,
            uid: user.uid,
          }),
        }
      );

      const data = await res.json();

      if (data?.authorization_url) {
        window.location.href = data.authorization_url; // 🔁 Redirect to Paystack
      } else {
        throw new Error("No Paystack authorization URL received.");
      }
    } catch (error) {
      console.error("Paystack error:", error);
      toast.error("Failed to start payment.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="text-center text-red-500 mt-20">Product not found.</div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-md text-center">
        <div className="mb-4">{product.icon}</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {product.name}
        </h1>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <p className="text-2xl font-semibold text-blue-600 mb-6">
          ${product.price}
        </p>

        <button
          onClick={handlePurchase}
          disabled={isLoading}
          className={`w-full flex justify-center items-center py-3 rounded-xl text-white font-semibold transition ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            "Proceed to Payment"
          )}
        </button>
      </div>
    </div>
  );
};

export default Buy;
