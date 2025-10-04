const express = require("express");
const router = express.Router();
const { db } = require("../firebase/firebaseAdmin");

// Get notifications for a specific user
router.get("/:uid", async (req, res) => {
  try {
    const { uid } = req.params;


    if (!uid) {
      console.error("❌ No UID provided in request params");
      return res.status(400).json({ error: "User ID is required" });
    }

    console.log("🔍 Querying Firestore for notifications...");
    const snapshot = await db
      .collection("notifications")
      .where("uid", "==", uid)
      .orderBy("timestamp", "desc")
      .get();

    console.log("📊 Firestore query size:", snapshot.size);
  
   
    if (snapshot.empty) {
      console.warn("⚠️ No notifications found for uid:", uid);
      return res.json([]);
    }

    const notifications = snapshot.docs.map((doc) => {
      const data = doc.data();
    

      return {
        id: doc.id,
        message: data.message || "",
        read: data.read || false,
        timestamp: data.timestamp?.toDate
          ? data.timestamp.toDate().toISOString()
          : null,
      };
    });

  
    res.json(notifications);
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

module.exports = router;
