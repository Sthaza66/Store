import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { format } from "date-fns";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "notifications"),
      where("uid", "==", user.uid),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications(data);
      },
      (err) => {
        console.error("Error fetching notifications:", err.message);
        setError("Failed to load notifications.");
      }
    );

    return () => unsubscribe();
  }, [auth.currentUser]);

  // ✅ Mark notification as read
  const markAsRead = async (id) => {
    try {
      const notifRef = doc(db, "notifications", id);
      await updateDoc(notifRef, {
        read: true,
      });
    } catch (err) {
      console.error("Failed to mark as read:", err.message);
    }
  };

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
            <div className="flex justify-between items-center">
              <p className="text-gray-800">{notif.message}</p>
              {!notif.read && (
                <button
                  onClick={() => markAsRead(notif.id)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Mark as read
                </button>
              )}
            </div>
            {notif.timestamp?.toDate && (
              <p className="text-sm text-gray-500 mt-1">
                {format(notif.timestamp.toDate(), "PPPpp")}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
