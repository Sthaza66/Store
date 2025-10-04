import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { format } from "date-fns";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/notifications/${user.uid}`
        );
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error("Error fetching notifications:", err.message);
        setError("Failed to load notifications.");
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Notifications</h1>

      {error && <p className="text-red-600">{error}</p>}
      {notifications.length === 0 && (
        <p className="text-gray-600">No notifications yet.</p>
      )}

      <ul className="space-y-4">
        {notifications.map((notif) => (
          <li
            key={notif.id}
            className={`bg-white p-4 rounded shadow border ${
              notif.read ? "border-gray-100" : "border-blue-500"
            }`}
          >
            <p className="text-gray-800">{notif.message}</p>
            {notif.timestamp && (
              <p className="text-sm text-gray-500 mt-1">
                {format(new Date(notif.timestamp), "PPPpp")}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
