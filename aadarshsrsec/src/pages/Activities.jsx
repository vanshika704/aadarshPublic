import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Save, Loader2, Upload, FileImage } from 'lucide-react';

// Services & Auth
import { useAuth } from '../context/AuthContext';
import { 
  getActivities, 
  addActivity, 
  updateActivity, 
  deleteActivity,
  getActivitiesData 
} from '../services/content.service';

const DEFAULT_FORM = { 
  category: '', 
  location: 'Campus', 
  image: '' 
};

// --- FALLBACK CATEGORIES (Safety Net) ---
// If the database returns nothing (e.g. first time setup), these will show up.
const STATIC_CATEGORIES = [
  { label: "Sports Meet", value: "sports" },
  { label: "Annual Day", value: "annual-day" },
  { label: "Diwali Celebrations", value: "diwali" },
  { label: "Rakhi Making", value: "rakhi" },
  { label: "Janmashtami", value: "janmashtami" },
  { label: "Clean India", value: "clean-india" },
  { label: "Dental Camp", value: "dental" },
  { label: "Excursions", value: "excursions" },
  { label: "Lab Activities", value: "lab" },
];

// --- 1. ADMIN MODAL ---
const AdminModal = ({ onClose, onSubmit, initialData, categories }) => {
  const isEditing = !!initialData; 

  const [formData, setFormData] = useState(() => {
    if (initialData) return initialData;
    return {
      ...DEFAULT_FORM,
      // Default to first available category
      category: categories && categories.length > 0 ? categories[0].value : ''
    };
  });

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (isEditing) {
        setFiles([selectedFiles[0]]);
      } else {
        setFiles(prev => [...prev, ...selectedFiles]);
      }
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category) {
      alert("Please select a category");
      return;
    }

    if (!isEditing && files.length === 0) {
        alert("Please select at least one photo.");
        return;
    }

    setLoading(true);
    
    // Auto-generate a title base
    const selectedCatLabel = categories.find(c => c.value === formData.category)?.label || "Activity";
    const baseTitle = isEditing ? initialData.title : `${selectedCatLabel} Photo`;

    await onSubmit({ ...formData, title: baseTitle }, files);
    
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between mb-6">
          <h3 className="font-bold text-lg text-gray-800">
            {isEditing ? 'Edit Activity Photo' : 'Add Activity Photos'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500"><X /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* CATEGORY SELECT */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Select Category</label>
            <select 
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" 
              value={formData.category} 
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option value="" disabled>Select a category...</option>
              {categories.map((c, idx) => (
                <option key={idx} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          
          {/* IMAGE UPLOAD AREA */}
          <div>
             <label className="block text-sm font-semibold text-gray-700 mb-1">
                {isEditing ? "Replace Photo" : "Upload Photos (Select Multiple)"}
             </label>
             
             <div className="border-2 border-dashed border-gray-300 bg-gray-50 p-6 rounded-lg text-center cursor-pointer relative hover:bg-gray-100 transition-colors">
                <input 
                  type="file" 
                  onChange={handleFileChange} 
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                  accept="image/*"
                  multiple={!isEditing} 
                />
                <div className="flex flex-col items-center justify-center gap-2 text-sm text-gray-500">
                  <Upload size={24} className="text-blue-500" /> 
                  <span className="font-medium text-gray-700">
                    {isEditing ? "Click to replace image" : "Click to select images"}
                  </span>
                </div>
             </div>
          </div>

          {/* PREVIEW LIST */}
          {files.length > 0 && (
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p className="text-xs font-bold text-gray-500 mb-2 uppercase">{files.length} Files Selected:</p>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                    {files.map((f, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white p-2 rounded shadow-sm">
                            <div className="flex items-center gap-2 overflow-hidden">
                                <FileImage size={16} className="text-blue-500 shrink-0" />
                                <span className="text-xs truncate text-gray-700">{f.name}</span>
                            </div>
                            <button 
                                type="button" 
                                onClick={() => removeFile(idx)} 
                                className="text-gray-400 hover:text-red-500"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading} 
            className="w-full bg-red-700 hover:bg-red-800 text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2 transition-all shadow-md"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />} 
            {loading ? `Uploading ${files.length} items...` : (isEditing ? 'Update Photo' : `Save ${files.length} Photos`)}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

// --- 2. MAIN PAGE ---
export default function Activities() {
  const { category } = useParams();
  const { currentUser, userRole } = useAuth(); 
  const isAdmin = currentUser && userRole === 'admin';

  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // --- FETCH DATA ---
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // 1. Fetch Images
      const imagesData = await getActivities();
      setActivities(imagesData);

      // 2. Fetch Categories (With Fallback Logic)
      const navbarItems = await getActivitiesData();
      
      let finalCategories = STATIC_CATEGORIES; // Start with fallback

      if (navbarItems && Array.isArray(navbarItems) && navbarItems.length > 0) {
        // Data exists in DB, map it
        finalCategories = navbarItems.map(item => ({
            label: item.name,
            value: item.path.split('/').pop()
        }));
      } else {
        console.warn("No categories found in DB (Navbar not saved yet?). Using static defaults.");
      }
      
      setCategories(finalCategories);

    } catch (error) {
      console.error("Failed to load data", error);
      // Even on error, use static categories so admin isn't locked out
      setCategories(STATIC_CATEGORIES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    fetchData(); 
  }, [fetchData]);

  const filtered = category ? activities.filter(a => a.category === category) : activities;
  
  // Find display title
  const currentCatObj = categories.find(c => c.value === category);
  const displayTitle = currentCatObj ? currentCatObj.label : "Activities Gallery";

  // --- ACTIONS ---
  const handleSave = async (data, files) => {
    if (editingItem) {
        const fileToUpload = files.length > 0 ? files[0] : null;
        await updateActivity(editingItem.id, data, fileToUpload);
    } else {
        const uploadPromises = files.map(file => addActivity(data, file));
        await Promise.all(uploadPromises);
    }
    fetchData(); 
  };
  
  const handleDelete = async (id) => {
    if(window.confirm("Delete this photo? This cannot be undone.")) {
      await deleteActivity(id);
      fetchData();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-10 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
          <div>
             <h1 className="text-3xl font-bold text-gray-900">{displayTitle}</h1>
             <p className="text-gray-500 mt-1">
               {filtered.length} {filtered.length === 1 ? 'photo' : 'photos'} found
             </p>
          </div>
          
          {isAdmin && (
            <button 
              onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
              className="bg-red-700 text-white px-5 py-2.5 rounded-full flex items-center gap-2 hover:bg-red-800 shadow-lg transition-transform hover:scale-105 font-medium"
            >
              <Plus size={20} /> Add Photos
            </button>
          )}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center text-gray-500">
             <Loader2 className="w-8 h-8 animate-spin mb-2 text-red-700" />
             Loading gallery...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
             <p className="text-gray-500 text-lg">No photos found in this category.</p>
             {isAdmin && <p className="text-sm text-gray-400 mt-1">Use the "Add Photos" button to upload.</p>}
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filtered.map((item) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ y: -5 }}
                  className="relative group rounded-xl overflow-hidden shadow-md bg-white aspect-4/3"
                >
                  {/* ADMIN CONTROLS */}
                  {isAdmin && (
                    <div className="absolute top-3 right-3 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setEditingItem(item); setIsModalOpen(true); }} 
                        className="p-2 bg-white text-blue-600 rounded-full shadow-lg hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <Edit size={16}/>
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} 
                        className="p-2 bg-white text-red-600 rounded-full shadow-lg hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  )}

                  <img 
                    src={item.image || "https://placehold.co/600x400?text=No+Image"} 
                    alt={item.title || "Activity"} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  
                  <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-md text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {categories.find(c => c.value === item.category)?.label || item.category}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {isModalOpen && (
        <AdminModal 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={handleSave} 
          initialData={editingItem} 
          categories={categories} 
        />
      )}
    </div>
  );
}