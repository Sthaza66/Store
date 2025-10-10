import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Bot, Cpu, Settings2 } from "lucide-react";
import { auth } from "../firebase";
import { toast } from "react-toastify";

const iconMap = {
  bot: <Bot size={50} className="text-blue-600" />,
  cpu: <Cpu size={50} className="text-purple-600" />,
  settings: <Settings2 size={50} className="text-green-600" />,
};

const Buy = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState(null);

  // ✅ Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
        console.log("🛍️ Product fetched:", data);
      } catch (err) {
        toast.error("Failed to load product.");
      }
    };
    fetchProduct();
  }, [id]);

  // ✅ Handle Yoco payment
  const handlePurchase = async () => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("You must be signed in to buy a product.");
      return navigate("/login");
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/yoco/init`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          email: user.email,
          uid: user.uid,
        }),
      });

      const data = await res.json();
      console.log("💳 Yoco API response:", data);

      if (data?.redirectUrl) {
        // ✅ Optional: Save a notification for the user
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notifications/${user.uid}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: `You started a purchase for ${product.name} at R${product.price}`,
            read: false,
            timestamp: new Date().toISOString(),
          }),
        });

        // ✅ Redirect to Yoco Checkout
        window.location.href = data.redirectUrl;
      } else {
        throw new Error("No Yoco redirect URL received.");
      }
    } catch (error) {
      console.error("❌ Yoco error:", error);
      console.log(error.message)
      toast.error("Failed to start payment. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!product) {
    return <div className="text-center text-red-500 mt-20">Loading product...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-md text-center">
        <div className="mb-4">{iconMap[product.icon]}</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <p className="text-2xl font-semibold text-blue-600 mb-6">R{product.price}</p>

        <button
          onClick={handlePurchase}
          disabled={isLoading}
          className={`w-full flex justify-center items-center py-3 rounded-xl text-white font-semibold transition ${
            isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isLoading ? "Processing..." : "Proceed to Payment"}
        </button>
      </div>
    </div>
  );
};

export default Buy;
