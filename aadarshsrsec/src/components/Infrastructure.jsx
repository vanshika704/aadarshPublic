import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // IMPORT LINK
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Edit, Save, X, Upload, Trash2, Plus, Loader2 } from "lucide-react";
// 1. Import Auth Context
import { useAuth } from "../context/AuthContext";
// 2. Import Service Functions
import { updateInfraData, uploadFile } from "../services/content.service";

/* ---------- FALLBACK DATA ---------- */
const DEFAULTS = {
  leftGallery: [
    "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=500&q=80",
    "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=500&q=80",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500&q=80",
    "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=500&q=80",
  ],
  infraText:
    "ADARSH buildings stand tall surrounded with lush green surroundings. All the new buildings are as per the latest safety norms and are earthquake proof.\n\nSpacious classrooms, standard sized playgrounds, new fleet of buses, smart classes, separate Kids Zones are a few of the specialties of ADARSH schools that make them infrastructural marvels.",
  middleImg1:
    "https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80",
  middleImg2:
    "https://images.unsplash.com/photo-1588072432836-e10032774350?w=600&q=80",
  rightImg1:
    "https://images.unsplash.com/photo-1577896335477-2858506f9354?w=500&q=80",
  toursText:
    "The excursions & educational tours are also important for the students so that they can have maximum exposure to new things, places & can meet new people.",
  dentalImg:
    "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=500&q=80",
  dentalText:
    "Free Dental Checkup and Awareness Camp organized at Adarsh Senior Secondary Public School- Nahra. The camp was initiated with dental awareness talk, educating students about oral hygiene.",
};

/* ---------- SMALL UI HELPERS ---------- */
const FadeIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
);

// FIX: Updated to use Link and accept a 'to' prop
const RedButton = ({ text, to }) => (
  <Link 
    to={to} 
    className="inline-block bg-[#b93c3c] border border-white/50 text-white text-[10px] px-3 py-1 uppercase font-bold mt-2 hover:bg-[#a32e2e] transition-colors tracking-wider cursor-pointer"
  >
    {text}
  </Link>
);

const Divider = () => <div className="w-full h-px bg-slate-400/30 my-5" />;

const UploadOverlay = ({ onChange }) => (
  <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 transition-opacity opacity-0 hover:opacity-100">
    <label className="cursor-pointer bg-white text-black px-3 py-1.5 rounded shadow-lg flex gap-2 items-center hover:bg-gray-100 transition-transform hover:scale-105">
      <Upload size={14} /> <span className="text-xs font-bold uppercase">Change</span>
      <input 
        type="file" 
        hidden 
        accept="image/*" 
        onChange={(e) => {
            onChange(e);
            e.target.value = ''; // Reset input so same file can be selected again
        }} 
      />
    </label>
  </div>
);

/* ---------- MAIN COMPONENT ---------- */
// FIX: Added refreshData to props destructuring
const SchoolInfrastructure = ({ data, refreshData }) => {
  // 3. Strict Admin Check
  const { currentUser, userRole } = useAuth();
  const isAdmin = currentUser && userRole === 'admin';

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(DEFAULTS);

  // Sync data from props
  useEffect(() => {
    if (data && !isEditing) {
      setFormData((prev) => {
        const incoming = { ...DEFAULTS, ...data };
        // Prevent infinite loop if data is identical
        if (JSON.stringify(prev) === JSON.stringify(incoming)) return prev;
        return incoming;
      });
    }
  }, [data, isEditing]);

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  // Handle Single Image Uploads
  const handleImageUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const url = await uploadFile(file, "infra_assets");
      // Immediate state update to show the new image
      setFormData((prev) => ({ ...prev, [fieldName]: url }));
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // Handle Gallery Add
  const handleGalleryAdd = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const url = await uploadFile(file, "infra_gallery");
      setFormData((p) => ({
        ...p,
        leftGallery: [...p.leftGallery, url],
      }));
    } catch (err) {
      console.error(err);
      alert("Gallery upload failed");
    } finally {
      setLoading(false);
    }
  };

  // Handle Gallery Remove
  const handleGalleryRemove = (idx) => {
    if (!window.confirm("Delete this image?")) return;
    setFormData((p) => ({
      ...p,
      leftGallery: p.leftGallery.filter((_, i) => i !== idx),
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateInfraData(formData);
      
      // FIX: Refresh the parent data so the new image persists when we exit edit mode
      if(refreshData) await refreshData();
      
      setIsEditing(false);
      alert("Infrastructure section updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to save changes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a2350] p-4 py-16 text-white flex justify-center relative group">
      
      {/* Edit Button */}
      {isAdmin && !isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-6 right-6 bg-white text-[#1a2350] p-2.5 rounded-full z-50 hover:bg-blue-50 transition shadow-lg"
          title="Edit Section"
        >
          <Edit size={20} />
        </button>
      )}

      {/* Save/Cancel Controls */}
      {isEditing && (
        <div className="fixed bottom-10 right-10 flex gap-3 z-50 animate-bounce-in">
          <button
            onClick={() => setIsEditing(false)}
            className="bg-white text-gray-700 px-5 py-2.5 rounded-full flex gap-2 shadow-xl hover:bg-gray-100 font-bold items-center"
          >
            <X size={18} /> Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-green-600 text-white px-5 py-2.5 rounded-full flex gap-2 shadow-xl hover:bg-green-700 font-bold items-center disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} 
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}

      <div className={`max-w-7xl w-full grid grid-cols-1 md:grid-cols-12 gap-6 ${isEditing ? "border-2 border-dashed border-blue-400/50 p-6 rounded-xl bg-blue-900/20" : ""}`}>
        
        {/* LEFT COLUMN: Gallery */}
        <div className="md:col-span-3 flex flex-col gap-4 md:pr-6 md:border-r border-slate-500/30">
          {formData.leftGallery.map((src, i) => (
            <FadeIn key={i}>
              <div className="relative group/img rounded-sm overflow-hidden border border-white/10">
                <img src={src} className="h-32 w-full object-cover shadow-md transition-transform duration-500 group-hover/img:scale-105" alt="Gallery" />
                {isEditing && (
                  <button
                    onClick={() => handleGalleryRemove(i)}
                    className="absolute top-1 right-1 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity shadow-md"
                    title="Remove Image"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            </FadeIn>
          ))}
          
          {isEditing && (
            <label className="border-2 border-dashed border-gray-400/50 h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 text-gray-300 rounded transition-colors">
              {loading ? <Loader2 className="animate-spin" /> : <Plus size={24} />}
              <span className="text-[10px] font-bold mt-2 uppercase tracking-wider">Add Image</span>
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleGalleryAdd}
                disabled={loading}
              />
            </label>
          )}
        </div>

        {/* MIDDLE COLUMN */}
        <div className="md:col-span-5 flex flex-col md:px-6 md:border-r border-slate-500/30 pt-6 md:pt-0">
          <FadeIn>
             <div className="mb-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-blue-200">INFRASTRUCTURE</h2>
              <div className="w-8 h-0.5 bg-blue-500 mt-1"></div>
            </div>

            {isEditing ? (
              <textarea
                name="infraText"
                value={formData.infraText}
                onChange={handleChange}
                rows={10}
                className="w-full p-3 text-black text-sm rounded border-2 border-transparent focus:border-blue-400 outline-none"
              />
            ) : (
              <p className="whitespace-pre-line text-[13px] leading-relaxed text-gray-300 mb-4 text-justify">{formData.infraText}</p>
            )}
            
            {/* LINK TO FACILITIES */}
            <RedButton text="READ MORE" to="/facilities" />
          </FadeIn>
          
          <Divider />
          
          {/* Middle Images */}
          <div className="flex flex-col gap-4">
             <div className="relative group/mid1 rounded-sm overflow-hidden border border-white/10">
                <img src={formData.middleImg1} className="h-48 w-full object-cover shadow-lg" alt="Infra 1" />
                {isEditing && <UploadOverlay onChange={(e) => handleImageUpload(e, 'middleImg1')} />}
             </div>
             <div className="relative group/mid2 rounded-sm overflow-hidden border border-white/10">
                <img src={formData.middleImg2} className="h-48 w-full object-cover shadow-lg" alt="Infra 2" />
                {isEditing && <UploadOverlay onChange={(e) => handleImageUpload(e, 'middleImg2')} />}
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="md:col-span-4 flex flex-col md:pl-6 pt-6 md:pt-0">
          
          {/* Static Logo Box */}
          <div className="bg-white p-4 mb-6 text-center shadow-md rounded-sm">
             <div className="border-b-2 border-red-600 inline-block mb-1 px-4 pb-1">
                <h3 className="text-[#1a2350] text-xl font-extrabold tracking-widest">ADARSH</h3>
             </div>
             <p className="text-[#1a2350] text-[10px] font-bold uppercase tracking-wide">Senior Secondary Public School</p>
          </div>

          <div className="relative group/right1 mb-6 rounded-sm overflow-hidden border border-white/10">
            <img src={formData.rightImg1} className="h-40 w-full object-cover shadow-md" alt="Right 1" />
            {isEditing && <UploadOverlay onChange={(e) => handleImageUpload(e, 'rightImg1')} />}
          </div>

          {/* Tours Section */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wide border-l-2 border-red-500 pl-2">Educational Tours</h3>
            {isEditing ? (
               <textarea name="toursText" value={formData.toursText} onChange={handleChange} rows={4} className="w-full p-2 text-black text-sm rounded mb-2" />
            ) : (
               <p className="text-[13px] text-gray-300 mb-2 leading-relaxed text-justify">{formData.toursText}</p>
            )}
            {/* LINK TO EXCURSIONS */}
            <RedButton text="READ MORE" to="/activities/excursions" />
          </div>

          <Divider />

          {/* Dental Section */}
          <div>
            <div className="relative group/dental mb-4 rounded-sm overflow-hidden border border-white/10">
               <img src={formData.dentalImg} className="h-32 w-full object-cover shadow-md" alt="Dental" />
               <div className="absolute bottom-0 left-0 w-full bg-linear-to-t from-black/80 to-transparent p-2">
                 <p className="text-white text-[10px] font-bold tracking-wide uppercase">DENTAL CHECK UP CAMP</p>
               </div>
               {isEditing && <UploadOverlay onChange={(e) => handleImageUpload(e, 'dentalImg')} />}
            </div>

            <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wide border-l-2 border-red-500 pl-2">Health Checkup</h3>
            {isEditing ? (
               <textarea name="dentalText" value={formData.dentalText} onChange={handleChange} rows={4} className="w-full p-2 text-black text-sm rounded mb-2" />
            ) : (
               <p className="text-[13px] text-gray-300 mb-2 leading-relaxed text-justify">{formData.dentalText}</p>
            )}
            {/* LINK TO DENTAL */}
            <RedButton text="READ MORE" to="/activities/dental" />
          </div>

        </div>
      </div>
    </div>
  );
};

export default SchoolInfrastructure;