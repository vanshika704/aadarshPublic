
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Save, Loader2, Upload } from 'lucide-react';

// Services & Auth
import { useAuth } from '../context/AuthContext';
import { 
  getActivities, 
  addActivity, 
  updateActivity, 
  deleteActivity,
  getActivitiesData // Imports the function to fetch Navbar items
} from '../services/content.service';

const DEFAULT_FORM = { 
  category: '', 
  location: 'Campus', 
  image: '' 
};

// --- 1. ADMIN MODAL (Fixed State Initialization) ---
const AdminModal = ({ isOpen, onClose, onSubmit, initialData, categories }) => {
  // FIX: Initialize state lazily.
  // Because the parent passes a unique 'key' prop, this component remounts
  // when the key changes, running this initialization logic exactly once per open.
  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return initialData;
    } else {
      return {
        ...DEFAULT_FORM,
        // Default to first available category if adding new
        category: categories && categories.length > 0 ? categories[0].value : ''
      };
    }
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category) {
      alert("Please select a category");
      return;
    }

    setLoading(true);
    
    // Auto-generate a title based on the category label
    const selectedCatLabel = categories.find(c => c.value === formData.category)?.label || "Activity";
    const autoTitle = initialData ? initialData.title : `${selectedCatLabel} Photo`;

    await onSubmit({ ...formData, title: autoTitle }, file);
    
    setLoading(false);
    setFile(null); 
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl w-full max-w-sm p-6 shadow-2xl"
      >
        <div className="flex justify-between mb-6">
          <h3 className="font-bold text-lg text-gray-800">{initialData ? 'Edit' : 'Add'} Activity Photo</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500"><X /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* CATEGORY SELECT */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Select Category</label>
            <select 
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              value={formData.category} 
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option value="" disabled>Select a category...</option>
              {categories.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          
          {/* IMAGE UPLOAD */}
          <div>
             <label className="block text-sm font-semibold text-gray-700 mb-1">Upload Photo</label>
             <div className="border-2 border-dashed border-gray-300 bg-gray-50 p-6 rounded-lg text-center cursor-pointer relative hover:bg-gray-100 transition-colors">
                <input 
                  type="file" 
                  onChange={e => setFile(e.target.files[0])} 
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                  accept="image/*" 
                />
                <div className="flex flex-col items-center justify-center gap-2 text-sm text-gray-500">
                  <Upload size={24} className="text-blue-500" /> 
                  <span className="font-medium text-gray-700">
                    {file ? file.name : "Click to Browse"}
                  </span>
                </div>
             </div>
             {initialData && !file && (
                <p className="text-xs text-gray-400 mt-1 ml-1">Current image will be kept if no new file is chosen.</p>
             )}
          </div>

          <button 
            type="submit"
            disabled={loading} 
            className="w-full bg-red-700 hover:bg-red-800 text-white py-2.5 rounded-lg font-bold flex justify-center items-center gap-2 transition-all shadow-md mt-4"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />} 
            {initialData ? 'Update Photo' : 'Save Photo'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

// --- 2. MAIN PAGE ---
export default function Activities() {
  const { category } = useParams(); // URL param: e.g. "diwali"
  const { currentUser, userRole } = useAuth(); 
  const isAdmin = currentUser && userRole === 'admin';

  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]); // Dynamic Categories from DB
  const [loading, setLoading] = useState(true);
  
  // Admin State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // --- FETCH DATA ---
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      // 1. Fetch Images (The Gallery)
      const imagesData = await getActivities();
      setActivities(imagesData);

      // 2. Fetch Categories from Navbar DB (The valid list)
      const navbarItems = await getActivitiesData();
      if (navbarItems && Array.isArray(navbarItems)) {
        // Transform Navbar items { name: "Diwali", path: "/activities/diwali" } 
        // into Select Options { label: "Diwali", value: "diwali" }
        const formattedCats = navbarItems.map(item => ({
            label: item.name,
            value: item.path.split('/').pop() // Extracts 'diwali' from '/activities/diwali'
        }));
        setCategories(formattedCats);
      }
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    fetchData(); 
  }, [fetchData]);

  // --- FILTER LOGIC ---
  const filtered = category ? activities.filter(a => a.category === category) : activities;
  const displayTitle = category 
    ? categories.find(c => c.value === category)?.label 
    : "Activities Gallery";

  // --- ACTIONS ---
  const handleSave = async (data, file) => {
    if (editingItem) await updateActivity(editingItem.id, data, file);
    else await addActivity(data, file);
    fetchData(); // Refresh grid
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
              <Plus size={20} /> Add Photo
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
             {isAdmin && <p className="text-sm text-gray-400 mt-1">Use the "Add Photo" button to upload one.</p>}
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
                  {/* ADMIN CONTROLS (Only visible on hover if admin) */}
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

                  {/* THE IMAGE */}
                  <img 
                    src={item.image || "https://placehold.co/600x400?text=No+Image"} 
                    alt={item.title || "Activity"} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  
                  {/* Category Badge on Image */}
                  <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-md text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {categories.find(c => c.value === item.category)?.label || item.category}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Admin Modal */}
      <AdminModal 
        // This KEY is crucial. Changing the key forces React to re-mount the component,
        // which runs the useState initialization logic again.
        key={editingItem ? editingItem.id : 'create-new'} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleSave} 
        initialData={editingItem} 
        categories={categories} 
      />
    </div>
  );
}