import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Edit2, Save, X, UploadCloud, Loader2 } from 'lucide-react';
// IMPORT TOAST
import toast from 'react-hot-toast';

import { useAuth } from '../context/AuthContext';
import { updateLeadershipData, uploadFile } from '../services/content.service';

// --- 1. EDIT MODAL COMPONENT (Admin Only) ---
const EditModal = ({ data, onClose, onSave, isSaving }) => {
  const [formData, setFormData] = useState({ ...data });
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) setImageFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, imageFile);
  };

  return (
    // Restored z-100 as per your original code
    <div className="fixed inset-0 bg-black/60 z-100 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Edit Leader</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition"><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Role</label>
              <input 
                name="role" 
                value={formData.role || ""} 
                onChange={handleChange} 
                className="w-full border p-2 rounded focus:ring-2 focus:ring-red-200 outline-none" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Name</label>
              <input 
                name="name" 
                value={formData.name || ""} 
                onChange={handleChange} 
                className="w-full border p-2 rounded focus:ring-2 focus:ring-red-200 outline-none" 
              />
            </div>
          </div>
          
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Subtitle / Degree</label>
            <input 
              name="subTitle" 
              value={formData.subTitle || ""} 
              onChange={handleChange} 
              className="w-full border p-2 rounded focus:ring-2 focus:ring-red-200 outline-none" 
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Message</label>
            <textarea 
              name="message" 
              value={formData.message || ""} 
              onChange={handleChange} 
              rows={5} 
              className="w-full border p-2 rounded focus:ring-2 focus:ring-red-200 outline-none text-sm" 
            />
          </div>

          {/* Image Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition group">
            <input type="file" id="leaderUpload" className="hidden" onChange={handleFileChange} accept="image/*" />
            <label htmlFor="leaderUpload" className="cursor-pointer flex flex-col items-center gap-2 text-gray-500">
              <UploadCloud size={24} className="text-red-600 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold uppercase">{imageFile ? imageFile.name : "Click to Change Photo"}</span>
            </label>
          </div>

          <button 
            type="submit" 
            disabled={isSaving} 
            className="w-full bg-red-800 text-white py-3 rounded-lg font-bold hover:bg-red-900 transition flex justify-center gap-2 items-center disabled:opacity-70"
          >
            {isSaving ? <><Loader2 className="animate-spin" size={18}/> Saving...</> : <><Save size={18} /> Save Changes</>}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- 2. SINGLE CARD COMPONENT (SCROLLABLE + HIDDEN SCROLLBAR) ---
const MessageCard = ({ data, isAdmin, onEdit }) => {
  const message = data.message || "";

  return (
    <>
      {/* CSS to hide scrollbar across all browsers */}
      <style>
        {`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
        `}
      </style>

      <div className="flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-full relative group hover:shadow-md transition-shadow">
        
        {/* ADMIN EDIT BUTTON */}
        {isAdmin && (
          <button 
            onClick={() => onEdit(data)}
            className="absolute top-3 right-3 z-10 bg-white/90 p-2 rounded-full shadow-lg text-gray-600 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
            title="Edit Leader"
          >
            <Edit2 size={16} />
          </button>
        )}

        {/* Header */}
        <div className="p-4 border-b border-gray-100 text-center bg-gray-50/50">
          <h3 className="text-red-800 font-bold uppercase tracking-wider text-xs sm:text-sm">
            {data.role === "Principal" ? "From the Principal's Desk" : `Message from ${data.role}`}
          </h3>
        </div>

        {/* Image */}
        <div className="w-full h-72 bg-gray-200 relative overflow-hidden">
          <img 
            src={data.image || 'https://placehold.co/400x500?text=No+Image'} 
            alt={data.name} 
            className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col grow">
          <div className="text-center mb-4">
            <h4 className="text-lg font-bold text-gray-900">{data.name}</h4>
            {data.subTitle && (
              <p className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-wide">{data.subTitle}</p>
            )}
          </div>

          {/* SCROLLABLE AREA 
              - Replaced truncation with fixed height scrolling
              - Added 'no-scrollbar' class to hide the bars
          */}
          <div className="text-sm text-gray-600 leading-relaxed text-justify whitespace-pre-wrap h-48 overflow-y-auto no-scrollbar mb-4">
            {message}
          </div>

        </div>
      </div>
    </>
  );
};

// --- 3. MAIN SECTION CONTAINER ---
const LeadershipSection = ({ initialData = [], refreshData }) => {
  // 2. Strict Admin Check using Context
  const { currentUser, userRole } = useAuth();
  const isAdmin = currentUser && userRole === 'admin';

  const [editingItem, setEditingItem] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Handle Save
  const handleSave = async (updatedItem, newImageFile) => {
    setIsSaving(true);
    const toastId = toast.loading("Updating leader...");

    try {
      let imageUrl = updatedItem.image;

      // 1. Upload new image if selected
      if (newImageFile) {
        imageUrl = await uploadFile(newImageFile, "leadership");
      }

      // 2. Prepare new item
      const newItem = { ...updatedItem, image: imageUrl };

      // 3. Update the array locally
      const newArray = initialData.map(item => 
        item.id === newItem.id ? newItem : item
      );

      // 4. Save entire array to Firebase
      // Pass the array directly as per our service definition
      await updateLeadershipData(newArray);
      
      // 5. Trigger Parent Refresh
      if(refreshData) await refreshData();
      
      setEditingItem(null);
      toast.success("Leader updated successfully!", { id: toastId });
    } catch (error) {
      console.error("Failed to save:", error);
      toast.error("Failed to save changes.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  // If no data, we can either return null or show a placeholder. 
  // Returning null allows the parent to decide (e.g., showing a loader).
  if (!initialData || initialData.length === 0) {
    return null; 
  }

  return (
    <section className="bg-gray-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        
        {isAdmin && (
            <div className="mb-6 flex justify-center">
                <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full border border-red-200">
                    ADMIN MODE ACTIVE
                </span>
            </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start justify-center">
          {initialData.map((item, index) => (
            <MessageCard 
              // Fallback to index if ID is missing (though ID is preferred)
              key={item.id || index} 
              data={item} 
              isAdmin={isAdmin}
              onEdit={setEditingItem}
            />
          ))}
        </div>
      </div>

      {/* Edit Modal Overlay */}
      {editingItem && (
        <EditModal 
          data={editingItem} 
          onClose={() => setEditingItem(null)} 
          onSave={handleSave}
          isSaving={isSaving}
        />
      )}
    </section>
  );
};

export default LeadershipSection;