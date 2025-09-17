import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { format } from "date-fns";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const urlParams = new URLSearchParams(location.search);
  const success = urlParams.get("success");

  if (success === "true") {
    const productId = localStorage.getItem("lastProductId");
    if (productId) {
      fetchDownloadLink(productId);
      localStorage.removeItem("lastProductId");
    }
  }

  const unsubscribe = auth.onAuthStateChanged(async (user) => {
    if (user) {
      await fetchOrders(user);
      await fetchNotifications(user);
      setLoading(false);
    } else {
      console.warn("No user logged in");
      setLoading(false);
    }
  });

  return () => unsubscribe();
}, []);


  const fetchOrders = async (user) => {
    try {
      const q = query(
        collection(db, "orders"),
        where("uid", "==", user.uid),
        orderBy("timestamp", "desc")
      );

      const snapshot = await getDocs(q);
      const orderList = snapshot.docs.map((doc) => doc.data());
      setOrders(orderList);

      const total = orderList.reduce((sum, order) => sum + (order.price || 0), 0);
      setTotalSales(total);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchNotifications = async (user) => {
    try {
      const q = query(
        collection(db, "notifications"),
        where("uid", "==", user.uid),
        orderBy("timestamp", "desc")
      );

      const snap = await getDocs(q);
      const recent = snap.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .slice(0, 5);

      setRecentActivity(recent);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const fetchDownloadLink = async (productId) => {
  try {
    const res = await fetch("http://localhost:5000/api/download-link", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId }),
    });

    const data = await res.json();
    if (data.downloadUrl) {
      toast.success("Your download is starting...");
      window.location.href = data.downloadUrl;
    } else {
      toast.error("No download link available.");
    }
  } catch (err) {
    console.error("Download fetch error:", err);
    toast.error("Failed to get your download.");
  }
};


  const handleLogout = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await axios.post("http://localhost:5000/api/auth/logout", { uid: user.uid });
      }

      await signOut(auth);
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white shadow-lg p-6 space-y-4 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-6">Sthazabot Inc.</h2>
          <nav className="space-y-2">
            <Link to="/dashboard" className="block py-2 px-3 rounded hover:bg-gray-200">Dashboard</Link>
            <Link to="/dashboard/notifications" className="block py-2 px-3 rounded hover:bg-gray-200">Notifications</Link>
            <Link to="/dashboard/profile" className="block py-2 px-3 rounded hover:bg-gray-200">Profile</Link>
            <Link to="/products" className="block py-2 px-3 rounded hover:bg-gray-200">Products</Link>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-6 bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Welcome to your Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-base md:text-lg font-semibold">Total Sales</h3>
            <p className="text-xl md:text-2xl font-bold mt-2">R{totalSales}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-base md:text-lg font-semibold">Active Users</h3>
            <p className="text-xl md:text-2xl font-bold mt-2">87</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-base md:text-lg font-semibold">New Orders</h3>
            <p className="text-xl md:text-2xl font-bold mt-2">{orders.length}</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Recent Activity</h2>
          {recentActivity.length === 0 ? (
            <p className="text-gray-600">No recent activity.</p>
          ) : (
            <ul className="space-y-2">
              {recentActivity.map((act) => (
                <li key={act.id} className="text-gray-800 text-sm md:text-base">
                  • {act.message}
                  {act.timestamp && (
                    <span className="text-xs md:text-sm text-gray-500 ml-2">
                      ({format(act.timestamp.toDate(), "PPpp")})
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
