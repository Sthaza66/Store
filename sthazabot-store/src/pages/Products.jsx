// src/pages/Products.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ✅ import context
import { Bot, Cpu, Settings2 } from 'lucide-react';

const products = [
  {
    id: 1,
    name: 'Robotrader AI',
    description: 'An advanced trading bot for MetaTrader 5 with 90% win rate.',
    price: 'R350',
    icon: <Bot size={40} className="text-blue-600" />,
  },
  {
    id: 2,
    name: 'Sthazabot Binary Pro',
    description: 'Binary options bot with trend and reversal detection.',
    price: 'R250',
    icon: <Cpu size={40} className="text-purple-600" />,
  },
  {
    id: 3,
    name: 'Smart EA Builder',
    description: 'Drag-and-drop EA builder for non-coders.',
    price: 'R1000',
    icon: <Settings2 size={40} className="text-green-600" />,
  },
];

const Products = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ get current user

  const handleBuy = (productId) => {
    if (!user) {
      navigate('/login', { state: { from: `/buy/${productId}` } });
    } else {
      navigate(`/buy/${productId}`);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Our Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {products.map(product => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300"
          >
            <div className="flex justify-center mt-6">{product.icon}</div>
            <div className="p-6 text-center">
              <h2 className="text-xl font-bold text-gray-800">{product.name}</h2>
              <p className="text-gray-600 mt-2">{product.description}</p>
              <p className="text-lg font-semibold text-blue-600 mt-4">{product.price}</p>
              <button
                onClick={() => handleBuy(product.id)}
                className="mt-6 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
