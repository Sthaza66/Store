// src/App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { requestNotificationPermission } from "./firebase/firebase-messaging";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Products from "./pages/Products";
import Pricing from "./pages/Pricing";
import Contacts from "./pages/contacts";
import Buy from "./pages/Buy";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Success from "./pages/success";
import Declined from "./pages/Declined"
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";

// Wrapper to control layout and conditionally show/hide Navbar
const LayoutWrapper = () => {
  const location = useLocation();
  const path = location.pathname;

  // Define exact paths where Navbar should be hidden
  const hideNavbarPaths = [
    "/login",
    "/signup",
    "/dashboard",
    "/dashboard/profile",
    "/dashboard/notifications",
    "/products",
    "/success",
    "/declined"
  ];

  // Function to determine whether to hide Navbar
  const shouldHideNavbar = hideNavbarPaths.includes(path) || path.startsWith("/buy/");


  return (

    <>

      {/* ✅ Only show Navbar if route is not in the hide list */}
      {!shouldHideNavbar && <Navbar />}


      {/* ✅ Your routes go here */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<Products />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contacts />} />
        <Route path="/buy/:id" element={<Buy />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/profile" element={<Profile />} />
        <Route path="/success" element={<Success />} />
        <Route path="/declined" element={<Declined/>}/>
        <Route path="/dashboard/notifications" element={<Notifications />} />
      </Routes>

      {/* ✅ Toast notifications (always available) */}
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
};

export default function App() {
  return (
    <Router>
      <LayoutWrapper />
    </Router>
  );
}
