// src/pages/Pricing.jsx
import React from 'react';

const plans = [
  {
    title: 'Starter',
    price: '$29/month',
    features: ['1 AI Bot', 'Basic Support', 'Updates Included'],
  },
  {
    title: 'Pro',
    price: '$59/month',
    features: ['3 AI Bots', 'Priority Support', 'Backtesting Suite'],
    highlighted: true,
  },
  {
    title: 'Ultimate',
    price: '$99/month',
    features: ['Unlimited Bots', '1-on-1 Coaching', 'Lifetime Updates'],
  },
];

const Pricing = () => {
  return (
    <div className="bg-white py-20 px-6">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Choose Your Plan</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`rounded-2xl p-8 shadow-lg transition-all duration-300 ${
              plan.highlighted ? 'bg-blue-600 text-white scale-105' : 'bg-gray-100 text-gray-800'
            }`}
          >
            <h2 className="text-2xl font-bold mb-4 text-center">{plan.title}</h2>
            <p className="text-3xl font-extrabold text-center mb-6">{plan.price}</p>
            <ul className="mb-6 space-y-3">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center justify-center gap-2">
                  ✅ {feature}
                </li>
              ))}
            </ul>
            <button
              className={`w-full py-2 rounded ${
                plan.highlighted ? 'bg-white text-blue-600 hover:bg-gray-200' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Get Started
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
