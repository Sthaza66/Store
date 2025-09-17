import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-50">
      <h1 className="text-2xl font-bold text-purple-700">Sthazabot Inc</h1>

      {/* Hamburger Menu Button for mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="sm:hidden text-gray-700 focus:outline-none"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Menu Links */}
      <div
        className={`flex-col sm:flex-row sm:flex items-center gap-4 ${
          isOpen ? "flex" : "hidden"
        } sm:flex`}
      >
        <Link
          to="/"
          className="text-gray-700 hover:text-purple-700 block px-2 py-1"
          onClick={() => setIsOpen(false)}
        >
          Home
        </Link>
        <Link
          to="/products"
          className="text-gray-700 hover:text-purple-700 block px-2 py-1"
          onClick={() => setIsOpen(false)}
        >
          Shop
        </Link>
        <Link to="/about" className="text-gray-700 hover:text-purple-700">About</Link>

        <Link
          to="/pricing"
          className="text-gray-700 hover:text-purple-700 block px-2 py-1"
          onClick={() => setIsOpen(false)}
        >
          Pricing
        </Link>
        <Link
          to="/contact"
          className="text-gray-700 hover:text-purple-700 block px-2 py-1"
          onClick={() => setIsOpen(false)}
        >
          Contact
        </Link>
        <Link
          to="/login"
          className="text-gray-700 hover:text-purple-700 block px-2 py-1"
          onClick={() => setIsOpen(false)}
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 block"
          onClick={() => setIsOpen(false)}
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}
