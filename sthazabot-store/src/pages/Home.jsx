import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <section className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 min-h-screen text-white flex items-center justify-center py-16 px-4">
        <div className="text-center max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Elevate Your Trading with <span className="text-yellow-300">AI Models</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-100">
            Unlock the power of cutting-edge Trading Bots, AI Indicators, and Financial Models — expertly built and trusted by professionals worldwide.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/products"
              className="bg-white text-purple-700 font-semibold px-8 py-3 rounded-full shadow hover:bg-gray-200 transition duration-300"
            >
              Shop Now
            </Link>
            <Link
              to="/pricing"
              className="border-2 border-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-purple-700 transition duration-300"
            >
              Pricing
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-300 py-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Sthazabot</h2>
            <p className="text-sm">
              Empowering traders with intelligent tools, from expert advisors to AI-driven analysis.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Products</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="hover:underline">Trading Bots</Link></li>
              <li><Link to="/products" className="hover:underline">AI Indicators</Link></li>
              <li><Link to="/products" className="hover:underline">Signal Services</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:underline">About Us</Link></li>
              <li><Link to="/contact" className="hover:underline">Contact</Link></li>
              <li><Link to="/pricing" className="hover:underline">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:underline">Twitter</a></li>
              <li><a href="#" className="hover:underline">LinkedIn</a></li>
              <li><a href="#" className="hover:underline">YouTube</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-8 text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Sthazabot. All rights reserved.
        </div>
      </footer>
    </>
  );
}
