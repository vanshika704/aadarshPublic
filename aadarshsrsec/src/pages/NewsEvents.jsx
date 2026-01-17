import React, { useState, useEffect } from 'react';
import { 
  Image as ImageIcon, 
  Edit, 
  Save, 
  X, 
  Trash2, 
  Plus, 
  Loader2, 
  Maximize2 
} from 'lucide-react';
// 1. IMPORT TOAST
import toast from 'react-hot-toast';

import { useAuth } from '../context/AuthContext';
import { getNewsData, updateNewsData, uploadFile } from '../services/content.service';

// Fallback images
import img1 from "../assets/sm1.jpg";
import img2 from "../assets/sm2.jpg";
import img3 from "../assets/sm3.jpg";

/* ---------- DEFAULT DATA ---------- */
const DEFAULTS = {
  sectionTitle: "Gallery & Events",
  subtitle: "Glimpses of activities and achievements at Adarsh School.",
  gallery: [
    { id: 1, image: img1 },
    { id: 2, image: img2 },
    { id: 3, image: img3 },
  ]
};

const NewsGallery = () => {
  const { currentUser, userRole } = useAuth();
  const isAdmin = currentUser && userRole === 'admin';

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // State for data
  const [data, setData] = useState(DEFAULTS);
  
  // State for Lightbox (Expanded Image)
  const [selectedImage, setSelectedImage] = useState(null);

  // --- 1. FETCH DATA ON MOUNT ---
  const fetchData = async () => {
    try {
      const serverData = await getNewsData();
      if (serverData) {
        setData({
          sectionTitle: serverData.sectionTitle || DEFAULTS.sectionTitle,
          subtitle: serverData.subtitle || DEFAULTS.subtitle,
          gallery: serverData.gallery || (serverData.events ? serverData.events.map(e => ({ id: e.id, image: e.image })) : DEFAULTS.gallery)
        });
      }
    } catch (error) {
      console.error("Error fetching gallery:", error);
      toast.error("Failed to load gallery.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* --- HANDLERS --- */

  const handleHeaderChange = (e) => {
    setData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    // TOAST: Loading
    const toastId = toast.loading("Uploading photo...");

    try {
      const url = await uploadFile(file, "news_gallery");
      const newItem = {
        id: Date.now(),
        image: url
      };
      
      setData(prev => ({
        ...prev,
        gallery: [newItem, ...prev.gallery]
      }));
      // TOAST: Success
      toast.success("Photo added!", { id: toastId });
    } catch (err) {
      console.error(err);
      // TOAST: Error
      toast.error("Upload failed.", { id: toastId });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this photo?")) return;
    setData(prev => ({
      ...prev,
      gallery: prev.gallery.filter(item => item.id !== id)
    }));
    toast.success("Photo removed (Click Save to apply).");
  };

  const handleSave = async () => {
    setLoading(true);
    // TOAST: Loading
    const toastId = toast.loading("Saving gallery...");

    try {
      await updateNewsData(data);
      setIsEditing(false);
      // TOAST: Success
      toast.success("Gallery updated successfully!", { id: toastId });
    } catch (err) {
      console.error(err);
      // TOAST: Error
      toast.error("Failed to save gallery.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="w-full bg-slate-50 py-16 px-4 md:px-8 relative group/section">
        
        {/* ADMIN EDIT TOGGLE */}
        {isAdmin && !isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="absolute top-6 right-6 z-10 bg-blue-900 text-white p-2.5 rounded-full shadow-lg hover:scale-110 transition border-2 border-white"
            title="Edit Gallery"
          >
            <Edit size={20} />
          </button>
        )}

        {/* ADMIN CONTROLS (Floating Bottom) */}
        {isEditing && (
          <div className="fixed bottom-10 right-10 z-50 flex gap-3 animate-bounce-in">
            <button 
              onClick={() => { setIsEditing(false); fetchData(); }} 
              className="bg-white text-gray-700 border border-gray-300 px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2 font-bold hover:bg-gray-50"
            >
              <X size={18} /> Cancel
            </button>
            <button 
              onClick={handleSave} 
              disabled={loading || uploading} 
              className="bg-green-600 text-white px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2 font-bold hover:bg-green-700 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} 
              Save Changes
            </button>
          </div>
        )}

        <div className={`max-w-7xl mx-auto ${isEditing ? 'p-6 border-2 border-dashed border-blue-300 rounded-2xl bg-blue-50/50' : ''}`}>
          
          {/* --- Header Section --- */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 flex items-center justify-center gap-3">
              <ImageIcon className="w-8 h-8 text-red-700" />
              {isEditing ? (
                <input 
                  name="sectionTitle"
                  value={data.sectionTitle}
                  onChange={handleHeaderChange}
                  className="text-center bg-transparent border-b-2 border-blue-300 outline-none min-w-[300px] focus:border-blue-600"
                />
              ) : (
                data.sectionTitle
              )}
            </h2>
            
            <div className="mt-3">
              {isEditing ? (
                <input 
                  name="subtitle"
                  value={data.subtitle}
                  onChange={handleHeaderChange}
                  className="text-center bg-transparent border-b border-gray-300 outline-none text-slate-500 w-full max-w-lg focus:border-gray-500"
                />
              ) : (
                <p className="text-slate-500 text-lg">{data.subtitle}</p>
              )}
            </div>
            
            <div className="h-1.5 w-24 bg-red-700 mx-auto mt-6 rounded-full"></div>
          </div>

          {/* --- Image Grid --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            
            {/* Add New Button (Edit Mode) */}
            {isEditing && (
              <label className="aspect-4/3 bg-white border-2 border-dashed border-blue-400 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors group">
                {uploading ? (
                  <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                ) : (
                  <>
                    <div className="bg-blue-100 p-4 rounded-full mb-3 group-hover:scale-110 transition-transform">
                      <Plus size={32} className="text-blue-600" />
                    </div>
                    <span className="font-bold text-blue-900">Add Photo</span>
                    <span className="text-xs text-blue-400 mt-1">Click to upload</span>
                  </>
                )}
                <input 
                  type="file" 
                  hidden 
                  accept="image/*" 
                  onChange={handleAddImage}
                  disabled={uploading} 
                />
              </label>
            )}

            {/* Gallery Items */}
            {data.gallery.map((item) => (
              <div 
                key={item.id} 
                onClick={() => !isEditing && setSelectedImage(item.image)}
                className={`relative group aspect-4/3 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-gray-200 ${!isEditing ? 'cursor-pointer' : ''}`}
              >
                <img 
                  src={item.image} 
                  alt="Gallery" 
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                />

                {/* Hover Overlay & Icon */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                   {!isEditing && (
                       <div className="bg-white/90 p-3 rounded-full shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300">
                           <Maximize2 size={24} className="text-blue-900" />
                       </div>
                   )}
                </div>

                {/* Delete Button (Edit Mode Only) */}
                {isEditing && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                    className="absolute top-2 right-2 bg-white text-red-600 p-2 rounded-full shadow-lg hover:bg-red-50 hover:scale-105 transition-all z-20"
                    title="Delete Photo"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* --- LIGHTBOX MODAL --- */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-100 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close Button */}
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} />
          </button>

          {/* Full Image */}
          <img 
            src={selectedImage} 
            alt="Expanded" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
          />
        </div>
      )}
    </>
  );
};

export default NewsGallery;