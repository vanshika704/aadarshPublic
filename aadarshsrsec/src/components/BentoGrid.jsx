

import React, { useState, useEffect } from 'react';
import { Edit, Save, X, Upload, Trash2, Plus, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateGridData, uploadFile } from '../services/content.service';

/* ===== LOCAL DEFAULT IMAGES ===== */
import toppers from '../assets/ntopers.jpeg';
import assembly1 from '../assets/assembly.jpg';
import assembly2 from '../assets/assembly2.jpg';
import adv from '../assets/adver.jpg';
import img1 from '../assets/1.jpg';
import img2 from '../assets/2.jpg';
import img3 from '../assets/4.jpg';
import img4 from '../assets/6.jpg';

const DEFAULTS = {
  toppersPoster: toppers,
  assemblyImg1: assembly1,
  assemblyImg2: assembly2,
  advPoster: adv,
  topCarousel: [{ src: img1 }, { src: img2 }],
  bottomCarousel: [{ src: img3 }, { src: img4 }]
};

/* --- SUB-COMPONENT: SIMPLE CAROUSEL --- */
const SimpleFadeCarousel = ({ images, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images?.length) return;
    const timer = setInterval(() => setCurrentIndex(i => (i + 1) % images.length), interval);
    return () => clearInterval(timer);
  }, [images, interval]);

  if (!images?.length) return (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs uppercase tracking-widest">
      No Images Added
    </div>
  );

  return (
    <div className="relative w-full h-full overflow-hidden">
      {images.map((img, idx) => (
        <div 
          key={idx} 
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          <img src={img.src} className="w-full h-full object-cover" alt={`Slide ${idx}`} />
        </div>
      ))}
    </div>
  );
};

/* --- SUB-COMPONENT: UPLOAD OVERLAY --- */
const UploadOverlay = ({ onFile }) => (
  <label className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center cursor-pointer hover:bg-black/60 transition z-20 group">
    <Upload className="text-white w-8 h-8 group-hover:scale-110 transition-transform mb-2" />
    <span className="text-white text-xs font-bold uppercase tracking-wider">Change Image</span>
    <input type="file" hidden accept="image/*" onChange={e => onFile(e.target.files[0])} />
  </label>
);

/* --- SUB-COMPONENT: CAROUSEL EDITOR --- */
const CarouselEditBox = ({ images, isEditing, onAdd, onDelete }) => (
  <div className="relative flex-1 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 min-h-[150px] shadow-sm">
    {isEditing ? (
      <div className="flex items-center gap-2 p-2 overflow-x-auto h-full scrollbar-hide bg-gray-50">
        {images?.map((img, i) => (
          <div key={i} className="relative w-24 h-24 shrink-0 rounded overflow-hidden shadow-sm border border-gray-200 group">
            <img src={img.src} className="w-full h-full object-cover" alt="" />
            <button 
              onClick={() => onDelete(i)} 
              className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition shadow-md"
              title="Remove Image"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
        
        <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer shrink-0 hover:bg-blue-50 hover:border-blue-400 transition text-gray-400 hover:text-blue-500">
          <Plus size={24} />
          <span className="text-[10px] font-bold mt-1">ADD IMAGE</span>
          <input type="file" hidden accept="image/*" onChange={e => onAdd(e.target.files[0])} />
        </label>
      </div>
    ) : (
      <SimpleFadeCarousel images={images} />
    )}
  </div>
);

/* --- MAIN COMPONENT --- */
const Grid = ({ data }) => {
  const { currentUser, userRole } = useAuth();
  const isAdmin = currentUser && userRole === 'admin';
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // State only used during editing
  const [draft, setDraft] = useState(DEFAULTS);

  // FIX: Determine what to display based on mode. 
  // If editing, show draft. If not, show live data (or defaults).
  // This removes the need for useEffect synchronization.
  const view = isEditing ? draft : { ...DEFAULTS, ...data };

  const startEdit = () => {
    // Initialize draft ONLY when user enters edit mode
    setDraft({ ...DEFAULTS, ...data });
    setIsEditing(true);
  };

  const cancelEdit = () => setIsEditing(false);

  const handleUpload = async (file, key) => {
    if (!file) return;
    setLoading(true);
    try {
      const url = await uploadFile(file, 'grid_assets');
      setDraft(prev => ({ ...prev, [key]: url }));
    } catch (e) { 
      console.error(e);
      alert("Upload failed"); 
    }
    setLoading(false);
  };

  const handleCarouselAdd = async (file, key) => {
    if (!file) return;
    setLoading(true);
    try {
      const url = await uploadFile(file, 'grid_carousel');
      setDraft(prev => ({ 
        ...prev, 
        [key]: [...(prev[key] || []), { src: url }] 
      }));
    } catch (e) { 
      console.error(e);
      alert("Upload failed"); 
    }
    setLoading(false);
  };

  const handleCarouselDelete = (index, key) => {
    setDraft(prev => ({ 
      ...prev, 
      [key]: prev[key].filter((_, i) => i !== index) 
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateGridData(draft);
      setIsEditing(false);
      alert("Grid section updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to save changes.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 relative group min-h-[500px]">

      {/* ADMIN EDIT BUTTON */}
      {isAdmin && !isEditing && (
        <button
          onClick={startEdit}
          className="absolute top-4 right-4 z-50 bg-white text-gray-500 p-2 rounded-full shadow-md border border-gray-200 hover:text-blue-600 hover:border-blue-200 transition-all"
          title="Edit Grid"
        >
          <Edit size={20} />
        </button>
      )}

      {/* SAVE CONTROLS */}
      {isEditing && (
        <div className="fixed bottom-10 right-10 z-100 flex gap-2 animate-bounce-in">
          <button 
            onClick={cancelEdit} 
            className="bg-white text-gray-700 border border-gray-200 px-6 py-3 rounded-full shadow-xl font-bold flex gap-2 items-center hover:bg-gray-50"
          >
            <X size={18} /> Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={loading} 
            className="bg-zinc-900 text-white px-6 py-3 rounded-full shadow-xl font-bold flex gap-2 items-center hover:bg-black disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save Changes
          </button>
        </div>
      )}

      {/* GRID LAYOUT */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 transition-all duration-300 ${isEditing ? 'ring-2 ring-blue-400 ring-offset-4 rounded-xl p-2' : ''}`}>
        
        {/* TOPPERS (Static Image) */}
        <div className="relative h-64 md:h-96 bg-gray-100 rounded-xl overflow-hidden shadow-sm border border-gray-100">
          <img src={view.toppersPoster} className="w-full h-full object-contain bg-white" alt="Toppers" />
          {isEditing && <UploadOverlay onFile={f => handleUpload(f, 'toppersPoster')} />}
        </div>

        {/* ASSEMBLY (Two Static Images) */}
        <div className="flex flex-col gap-4 h-64 md:h-96">
          <div className="relative flex-1 bg-gray-100 rounded-xl overflow-hidden shadow-sm border border-gray-100">
            <img src={view.assemblyImg1} className="w-full h-full object-cover" alt="Assembly 1" />
            {isEditing && <UploadOverlay onFile={f => handleUpload(f, 'assemblyImg1')} />}
          </div>
          <div className="relative flex-1 bg-gray-100 rounded-xl overflow-hidden shadow-sm border border-gray-100">
            <img src={view.assemblyImg2} className="w-full h-full object-cover" alt="Assembly 2" />
            {isEditing && <UploadOverlay onFile={f => handleUpload(f, 'assemblyImg2')} />}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-300 ${isEditing ? 'ring-2 ring-blue-400 ring-offset-4 rounded-xl p-2 mt-6' : ''}`}>
        
        {/* ADVERTISEMENT (Static Image) */}
        <div className="relative h-64 md:h-96 bg-gray-100 rounded-xl overflow-hidden shadow-sm border border-gray-100">
          <img src={view.advPoster} className="w-full h-full object-contain bg-white" alt="Advertisement" />
          {isEditing && <UploadOverlay onFile={f => handleUpload(f, 'advPoster')} />}
        </div>

        {/* CAROUSELS (Two Dynamic Carousels) */}
        <div className="flex flex-col gap-4 h-auto md:h-96">
          <CarouselEditBox 
            images={view.topCarousel} 
            isEditing={isEditing} 
            onAdd={f => handleCarouselAdd(f, 'topCarousel')}
            onDelete={i => handleCarouselDelete(i, 'topCarousel')}
          />
          <CarouselEditBox 
            images={view.bottomCarousel} 
            isEditing={isEditing} 
            onAdd={f => handleCarouselAdd(f, 'bottomCarousel')}
            onDelete={i => handleCarouselDelete(i, 'bottomCarousel')}
          />
        </div>
      </div>
    </div>
  );
};

export default Grid;