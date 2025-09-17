export default function About() {
  return (
    <section className="bg-gradient-to-b from-white to-gray-100 min-h-screen py-20 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-purple-700 mb-6">
          About Sthazabot Inc
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-10">
          At <span className="font-semibold text-purple-600">Sthazabot Inc</span>, we build advanced <span className="font-semibold">AI-powered tools</span> that revolutionize how you trade. From high-performance <span className="text-indigo-600">Crypto Bots</span> to intelligent <span className="text-indigo-600">Forex AI Models</span>, our products are designed for professionals, institutions, and traders ready to gain an edge.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <img src="https://img.icons8.com/external-wanicon-lineal-color-wanicon/64/000000/artificial-intelligence.png" alt="AI Icon" className="mx-auto mb-4" />
          <h3 className="text-xl font-bold text-purple-700 mb-2">AI Trading Bots</h3>
          <p className="text-gray-600">Our bots use real-time data and predictive analytics to automate profitable trades — no emotions, just logic.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <img src="https://img.icons8.com/external-flatart-icons-flat-flatarticons/64/000000/cryptocurrency--v1.png" alt="Crypto Icon" className="mx-auto mb-4" />
          <h3 className="text-xl font-bold text-purple-700 mb-2">Crypto Automation</h3>
          <p className="text-gray-600">Trade Bitcoin, Ethereum, and altcoins with lightning-fast execution and smart risk controls powered by AI.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <img src="https://img.icons8.com/color/64/000000/combo-chart--v1.png" alt="Financial Models Icon" className="mx-auto mb-4" />
          <h3 className="text-xl font-bold text-purple-700 mb-2">Financial AI Models</h3>
          <p className="text-gray-600">We design deep learning models that analyze markets, identify trends, and provide actionable insights for traders.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-16 text-center">
        <h2 className="text-3xl font-bold text-indigo-700 mb-4">Why Choose Us?</h2>
        <p className="text-gray-700 text-lg">
          We’re not just coders — we’re traders. Every product we release is battle-tested, optimized for real markets, and constantly evolving.
          Whether you're new to trading or managing capital, we give you the tools to win.
        </p>
      </div>

      <div className="text-center mt-12">
        <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Sthazabot Inc. All rights reserved.</p>
      </div>
    </section>
  );
}
