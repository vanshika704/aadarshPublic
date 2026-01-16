import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, useMotionValue } from "framer-motion";
import { Edit, Trash2, Upload, X, Plus, Loader2 } from "lucide-react";
// 1. Import Auth Context
import { useAuth } from "../context/AuthContext";
// 2. Import Service Functions
import { uploadBanner, deleteBanner } from "../services/content.service";

// Bottom bar static assets (Ensure paths are correct)
import img1 from "../assets/20-03-41-348_512.webp";
import img2 from "../assets/logo.jpg";

/* ================= CONFIG ================= */
const ONE_SECOND = 1000;
const AUTO_DELAY = ONE_SECOND * 6;
const DRAG_BUFFER = 50;

const SPRING_OPTIONS = {
  type: "spring",
  mass: 3,
  stiffness: 400,
  damping: 50,
};

/* ================= COMPONENT ================= */
const HeroCarousel = ({ banners = [] }) => {
  // 3. Strict Admin Check
  const { currentUser, userRole } = useAuth();
  const isAdmin = currentUser && userRole === 'admin';

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localBanners, setLocalBanners] = useState([]);
  const [imgIndex, setImgIndex] = useState(0);

  const dragX = useMotionValue(0);

  /* ===== SYNC STATE WITH PROPS ===== */
  useEffect(() => {
    // Only sync if we are not currently editing (to prevent overwrites)
    if (!isEditing) {
      setLocalBanners(banners || []);
      // Reset index if out of bounds
      if (imgIndex >= (banners?.length || 0)) {
        setImgIndex(0);
      }
    }
  }, [banners, imgIndex, isEditing]);

  /* ===== AUTOPLAY LOGIC ===== */
  useEffect(() => {
    // Stop autoplay if editing or only 1 slide
    if (isEditing || localBanners.length <= 1) return;

    const timer = setInterval(() => {
      // Only slide if user isn't currently dragging
      if (dragX.get() === 0) {
        setImgIndex(i => (i + 1) % localBanners.length);
      }
    }, AUTO_DELAY);

    return () => clearInterval(timer);
  }, [localBanners, isEditing, dragX]);

  /* ===== DRAG HANDLER ===== */
  const onDragEnd = () => {
    if (isEditing) return;

    const x = dragX.get();

    if (x <= -DRAG_BUFFER && imgIndex < localBanners.length - 1) {
      setImgIndex(i => i + 1);
    } else if (x >= DRAG_BUFFER && imgIndex > 0) {
      setImgIndex(i => i - 1);
    }
  };

  /* ===== ADMIN ACTIONS ===== */
  const handleUpload = async e => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      // Upload to Firebase Storage & get URL
      const url = await uploadBanner(file);
      // Optimistically update local state
      setLocalBanners(prev => [...prev, url]);
    } catch (error) {
      console.error(error);
      alert("Failed to upload banner.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (url, index) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;

    setLoading(true);
    try {
      // Remove from Firestore
      await deleteBanner(url);
      
      // Update local state
      setLocalBanners(prev => prev.filter((_, i) => i !== index));
      
      // Safety: adjust index if we deleted the last slide
      if (index <= imgIndex) {
         setImgIndex(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error(error);
      alert("Failed to delete banner.");
    } finally {
      setLoading(false);
    }
  };

  /* ===== EMPTY STATE (No Banners) ===== */
  if (localBanners.length === 0 && !isEditing) {
    return (
      <div className="h-[60vh] md:h-[80vh] w-full bg-gray-100 flex items-center justify-center relative border-b border-gray-200">
        {isAdmin ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition"
          >
            <Plus /> Add First Banner
          </button>
        ) : (
          <div className="text-center text-gray-400">
             <p className="text-xl font-bold uppercase tracking-widest">Welcome to Adarsh School</p>
             <p className="text-sm">No banners available.</p>
          </div>
        )}
      </div>
    );
  }

  /* ================= RENDER ================= */
  return (
    <div className="relative overflow-hidden bg-gray-900 h-[50vh] md:h-[85vh] w-full group">

      {/* ADMIN EDIT BUTTON */}
      {isAdmin && !isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-6 right-6 z-50 bg-white text-gray-800 p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
          title="Manage Slides"
        >
          <Edit size={20} />
        </button>
      )}

      {/* --- EDIT MODAL OVERLAY --- */}
      {isEditing && (
        <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md p-6 md:p-12 animate-fade-in">
          <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
            <div>
               <h3 className="text-2xl font-bold text-gray-800">Manage Carousel</h3>
               <p className="text-sm text-gray-500">Add or remove slides for the homepage.</p>
            </div>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-800 text-white px-5 py-2 rounded-full flex gap-2 items-center hover:bg-black transition"
            >
              <X size={18} /> Close
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 overflow-y-auto max-h-[70vh] pb-20">
            {/* Upload Button Tile */}
            <label className="aspect-video border-2 border-dashed border-blue-400 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition group/upload">
              {loading ? <Loader2 className="animate-spin text-blue-600" /> : <Upload size={32} className="text-blue-500 group-hover/upload:scale-110 transition" />}
              <span className="font-bold mt-2 text-sm text-blue-600">
                {loading ? "Uploading..." : "Add New Slide"}
              </span>
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleUpload}
                disabled={loading}
              />
            </label>

            {/* Existing Images */}
            {localBanners.map((src, idx) => (
              <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 shadow-sm group/card">
                <img src={src} className="w-full h-full object-cover" alt={`Slide ${idx}`} />
                <button
                  onClick={() => handleDelete(src, idx)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover/card:opacity-100 transition shadow-md hover:bg-red-700"
                  title="Delete Slide"
                >
                  <Trash2 size={14} />
                </button>
                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded">
                  Slide {idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- CAROUSEL SLIDER --- */}
      <motion.div
        drag={!isEditing && localBanners.length > 1 ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        style={{ x: dragX }}
        animate={{ translateX: `-${imgIndex * 100}%` }}
        transition={SPRING_OPTIONS}
        onDragEnd={onDragEnd}
        className="flex h-full w-full cursor-grab active:cursor-grabbing"
      >
        {localBanners.map((src, idx) => (
          <motion.div
            key={idx}
            className="h-full w-full shrink-0 relative"
          >
            {/* Dark Overlay for text readability */}
            <div className="absolute inset-0 bg-black/20 z-10" />
            <div 
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${src})` }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* --- DOTS INDICATOR --- */}
      {localBanners.length > 1 && (
        <div className="absolute bottom-20 md:bottom-24 w-full flex justify-center gap-3 z-30">
          {localBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setImgIndex(idx)}
              className={`h-2 transition-all rounded-full shadow-sm ${
                idx === imgIndex ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}

      {/* --- BOTTOM INFO BAR --- */}
      <div className="absolute bottom-0 w-full bg-[#1e3a8a]/90 backdrop-blur-sm py-3 md:py-4 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-3 z-30 border-t border-blue-400/30">
        <h2 className="text-white text-xs md:text-lg font-bold uppercase tracking-wider text-center md:text-left drop-shadow-md">
          Welcome to Adarsh Senior Secondary School – Nahra (Ambala)
        </h2>
        <div className="flex items-center gap-4 opacity-90">
          <img src={img1} className="h-6 md:h-8 object-contain" alt="Flag" />
          <div className="h-6 w-px bg-blue-400/50"></div>
          <img src={img2} className="h-6 md:h-8 object-contain rounded-full bg-white p-0.5" alt="Logo" />
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;