import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyA734Cu8WeDY5EVR4dzKWO6-RdyqPZhMes",
  authDomain: "sthazabot.firebaseapp.com",
  projectId: "sthazabot",
  storageBucket: "sthazabot.firebasestorage.app",
  messagingSenderId: "161168359918",
  appId: "1:161168359918:web:52a7ee0e61b40ffac3ceff",
  measurementId: "G-154FXLVY8K"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Request token for notifications
export const requestNotificationPermission = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: "BD6_BXsZPjGYJAHQsTyC4nTKIxuMuI9GqUCuV_Ea0aRofgTpebqvcpDnw-CPJcl8uG6cTuuURtvuDtDxVTs75Q0"
    });

    if (token) {
      console.log("FCM Token:", token);
      // Store this token in your backend linked to the user
      return token;
    } else {
      console.log("No registration token available");
    }
  } catch (error) {
    console.error("An error occurred while retrieving token.", error);
  }
};

// Listen for messages
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
3