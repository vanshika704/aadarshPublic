import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Edit, Save, X, Upload } from 'lucide-react';
// IMPORT TOAST
import toast from 'react-hot-toast';

import { useAuth } from '../context/AuthContext';
import { updateAnnualFunctionData, uploadFile } from '../services/content.service';

/* ---------------- DEFAULT DATA ---------------- */
const DEFAULTS = {
  image: "https://images.unsplash.com/photo-1526725702345-bdda2b97ef73?q=80&w=2667&auto=format&fit=crop",
  title: "ANNUAL FUNCTION",
  description: "The much awaited Annual Function was organized at Adarsh Senior Secondary Public School - Nahra to recognize shining stars of the school amidst great zest, vibrancy and elation. The programme commenced with the lighting of the Ceremonial lamp by the Chief Guest escorted by the other dignitaries and the Principal."
};

const AnnualFunction = ({ data, refreshData }) => {
  const { currentUser, userRole } = useAuth();
  const isAdmin = currentUser && userRole === 'admin';

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState(DEFAULTS);

  const displayData = isEditing ? formData : { ...DEFAULTS, ...data };

  // --- HANDLERS ---
  
  const startEdit = () => {
    setFormData({ ...DEFAULTS, ...data });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    // TOAST: Start Loading
    const toastId = toast.loading("Uploading image...");

    try {
      const url = await uploadFile(file, "annual_function");
      setFormData(prev => ({ ...prev, image: url }));
      // TOAST: Success
      toast.success("Image uploaded!", { id: toastId });
    } catch (error) {
      console.error(error);
      // TOAST: Error
      toast.error("Image upload failed", { id: toastId });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setLoading(true);
    // TOAST: Start Loading
    const toastId = toast.loading("Saving changes...");

    try {
      await updateAnnualFunctionData(formData);
      if (refreshData) await refreshData();
      setIsEditing(false);
      // TOAST: Success
      toast.success("Annual Function updated successfully!", { id: toastId });
    } catch (error) {
      console.error(error);
      // TOAST: Error
      toast.error("Failed to update.", { id: toastId });
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="max-w-6xl mx-auto p-4 md:p-8 relative group"
    >

      {/* --- EDIT BUTTON (ADMIN ONLY) --- */}
      {isAdmin && !isEditing && (
        <button
          onClick={startEdit}
          className="absolute top-2 right-2 z-50 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition"
          title="Edit Section"
        >
          <Edit size={18} />
        </button>
      )}

      {/* --- SAVE / CANCEL CONTROLS --- */}
      {isEditing && (
        <div className="fixed bottom-10 right-10 z-50 flex gap-2 animate-bounce-in">
          <button
            onClick={cancelEdit}
            className="bg-gray-500 text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 hover:bg-gray-600 transition"
          >
            <X size={18} /> Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 hover:bg-green-700 transition disabled:opacity-70"
          >
            {loading ? "Saving..." : <><Save size={18} /> Save Changes</>}
          </button>
        </div>
      )}

      {/* --- MAIN LAYOUT --- */}
      <div
        className={`flex flex-col md:flex-row gap-8 items-start ${
          isEditing ? "border-2 border-dashed border-blue-300 p-4 rounded-xl bg-blue-50/10" : ""
        }`}
      >

        {/* LEFT IMAGE */}
        <div className="w-full h-[200px] md:w-3/5">
          <div className="border-4 border-white shadow-lg rounded-sm overflow-hidden h-full relative group/image">
            <img
              src={displayData.image}
              alt="Annual Function"
              className="w-full h-full object-cover"
            />

            {/* Image Overlay for Editing */}
            {isEditing && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <label className="cursor-pointer bg-white text-black px-4 py-2 rounded shadow hover:bg-gray-100 flex items-center gap-2 transform hover:scale-105 transition">
                  <Upload size={16} /> Change Photo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="w-full md:w-2/5 flex flex-col justify-center">

          {/* Title */}
          {isEditing ? (
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="SECTION TITLE"
              className="text-2xl font-bold text-gray-800 uppercase mb-4 tracking-wide border-b-2 border-blue-500 outline-none w-full bg-transparent focus:border-blue-700"
            />
          ) : (
            <h2 className="text-2xl font-bold text-gray-800 uppercase mb-4 tracking-wide">
              {displayData.title}
            </h2>
          )}

          <div className="w-12 h-1 bg-blue-500 mb-6"></div>

          {/* Description */}
          {isEditing ? (
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={8}
              placeholder="Enter description here..."
              className="w-full text-sm p-3 border border-gray-300 rounded-md text-gray-600 leading-relaxed mb-6 focus:ring-2 focus:ring-blue-200 outline-none"
            />
          ) : (
            <p className="text-gray-600 text-sm leading-relaxed mb-6 text-justify">
              {displayData.description}
            </p>
          )}

          {/* Read More Link */}
          <Link to="/activities/annual-day">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#fdecec" }}
                whileTap={{ scale: 0.95 }}
                className="border border-red-500 text-red-500 px-4 py-2 text-sm font-semibold uppercase tracking-wider w-fit transition-colors duration-300 rounded-sm cursor-pointer"
              >
                Read More
              </motion.button>
          </Link>
          
        </div>
      </div>
    </motion.div>
  );
};

export default AnnualFunction;