// src/pages/Success.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();

  const handleKeepShopping = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
      <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 Purchase Successful!</h1>
      <p className="text-gray-700 mb-6">
        Thank you for your purchase! Your download link has been sent to your email.
        Please also check spam folder if email does not appear in your inbox!!
        <br />
        <strong>It will expire in 10 minutes.</strong>
      </p>
      <button
        onClick={handleKeepShopping}
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Keep Shopping
      </button>
    </div>
  );
};

export default Success;
