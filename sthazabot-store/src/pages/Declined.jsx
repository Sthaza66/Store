import React from "react";
import { useNavigate } from "react-router-dom";

const Declined = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Declined</h1>
        <p className="text-gray-600 mb-6">
          Your payment was declined. Please try again or contact support if the issue persists.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Declined;
