import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import axios from "axios";
import { uploadImage } from "../utils/uploadImage";
import ClipLoader from "react-spinners/ClipLoader";

const ProfileSection = () => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    photoURL: "",
  });

  const [loading, setLoading] = useState(true); // Initial loading
  const [submitting, setSubmitting] = useState(false); // Submission spinner
  const [imageFile, setImageFile] = useState(null);

  const user = auth.currentUser;

 useEffect(() => {
  const fetchProfile = async () => {
    if (!user) return;

    try {
      const res = await axios.get(`${BACKEND_URL}/api/profile/${user.uid}`);
      const data = res.data;

      setFormData({
        name: data.name || "",
        email: data.email || user.email || "",
        phoneNumber: data.phoneNumber || "",
        photoURL: data.photoURL || "",
      });
    } catch (err) {
    
      console.log("No profile found, using auth info instead:", err.message);

      setFormData({
        name: "",
        email: user.email || "",
        phoneNumber: "",
        photoURL: user.photoURL || "", // Firebase Auth sometimes has photoURL too
      });
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, [user]);


  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, photoURL: previewURL }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    try {
      let photoURL = formData.photoURL;

      if (imageFile) {
        photoURL = await uploadImage(imageFile, user.uid);
      }

      const updatedData = {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        photoURL,
      };

      await axios.post(`${BACKEND_URL}/api/profile/${user.uid}`, updatedData);

      alert("✅ Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update profile.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <ClipLoader size={50} color="#3b82f6" />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto"
    >
      <div className="flex items-center space-x-4 mb-4">
        <img
          src={formData.photoURL || "https://via.placeholder.com/80"}
          alt="User avatar"
          className="w-20 h-20 rounded-full object-cover"
        />
        <input type="file" onChange={handleImageChange} disabled={submitting} />
      </div>

      <div className="space-y-4">
        <input
          name="name"
          type="text"
          placeholder="Full Name"
          className="w-full p-2 border rounded"
          value={formData.name}
          onChange={handleChange}
          disabled={submitting}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={formData.email}
          onChange={handleChange}
          disabled={submitting}
        />
        <input
          name="phoneNumber"
          type="text"
          placeholder="Phone Number"
          className="w-full p-2 border rounded"
          value={formData.phoneNumber}
          onChange={handleChange}
          disabled={submitting}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className={`mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex justify-center items-center space-x-2`}
      >
        {submitting ? (
          <>
            <ClipLoader size={20} color="#fff" />
            <span>Updating...</span>
          </>
        ) : (
          "Update Profile"
        )}
      </button>
    </form>
  );
};

export default ProfileSection;
