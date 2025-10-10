import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Correct way to read env in Vite
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          await fetchOrders(user);
          await fetchNotifications(user);
        } catch (err) {
          console.error("Dashboard init error:", err);
          toast.error("Failed to load dashboard data");
        } finally {
          setLoading(false);
        }
      } else {
        console.warn("No user logged in");
        setLoading(false);
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchOrders = async (user) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/orders/${user.uid}`);
      setOrders(res.data);

      const total = res.data.reduce((sum, order) => sum + (order.amount || 0), 0);
      setTotalSales(total);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Could not load orders");
    }
  };

  const fetchNotifications = async (user) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/notifications/${user.uid}`);
      setRecentActivity(res.data.slice(0, 5));
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Could not load notifications");
    }
  };

  const handleLogout = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await axios.post(`${BACKEND_URL}/api/auth/logout`, { uid: user.uid });
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
            <h3 className="text-base md:text-lg font-semibold">Orders</h3>
            <p className="text-xl md:text-2xl font-bold mt-2">{orders.length}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-base md:text-lg font-semibold">Notifications</h3>
            <p className="text-xl md:text-2xl font-bold mt-2">{recentActivity.length}</p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="mt-8 bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Recent Orders</h2>
          {orders.length === 0 ? (
            <p className="text-gray-600">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {orders.slice(0, 5).map((order) => {
                let orderDate = "N/A";
                if (order.createdAt) {
                  try {
                    orderDate = format(new Date(order.createdAt), "PPpp");
                  } catch {
                    orderDate = "Invalid date";
                  }
                }
                return (
                  <li key={order.id || order.reference} className="py-2 flex justify-between text-sm md:text-base">
                    <span>Order ID: {order.reference}</span>
                    <span>R{order.amount}</span>
                    <span>{orderDate}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
