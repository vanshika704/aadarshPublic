import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Bell, GraduationCap, Edit, Save, X, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
// Import ALL update functions
import { 
  updateSchoolSectionData, 
  updateAboutPageData, 
  updatePrincipalPageData,
  uploadFile 
} from '../services/content.service';

/* ---------------- DEFAULT DATA ---------------- */
const DEFAULTS = {
  flagImage: "https://media.giphy.com/media/xmlk55j90mtys0r2/giphy.gif",
  aboutText: "",
  principalText: "",
  activitiesText: "Teaching does not need to be limited to textbooks and blackboards.",
  noticeText: "Admission Open - Session 2025–26"
};

/* ---------------- MAIN COMPONENT ---------------- */
const SchoolSection = ({ aboutData, principalData, miscData, refreshData }) => {
  const { currentUser, userRole } = useAuth(); 
  const isAdmin = currentUser && userRole === 'admin';

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(DEFAULTS);

  // --- HELPER: Extract Data safely from props ---
  const getSafeData = () => {
    // 1. Get About Text (Handle Array or String)
    let abtTxt = "";
    if (aboutData?.aboutText) {
       abtTxt = Array.isArray(aboutData.aboutText) 
          ? aboutData.aboutText.join("\n\n") 
          : aboutData.aboutText;
    }

    // 2. Get Principal Text
    const priTxt = principalData?.message || "";

    // 3. Get Misc Data
    const flag = miscData?.flagImage || DEFAULTS.flagImage;
    const actTxt = miscData?.activitiesText || DEFAULTS.activitiesText;
    const notTxt = miscData?.noticeText || DEFAULTS.noticeText;

    return {
        flagImage: flag,
        aboutText: abtTxt,
        principalText: priTxt,
        activitiesText: actTxt,
        noticeText: notTxt
    };
  };

  // --- LOGIC: Display Data vs Form Data ---
  const displayData = isEditing ? formData : getSafeData();

  const startEdit = () => {
    setFormData(getSafeData());
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
    try {
      const url = await uploadFile(file, "school_assets");
      setFormData(prev => ({ ...prev, flagImage: url }));
    } catch (error) {
      console.error("Upload failed", error);
      alert("Image upload failed");
    }
    setLoading(false);
  };

  // --- SAVE LOGIC ---
  const handleSave = async () => {
    setLoading(true);
    try {
      // 1. Update About Page
      const aboutPayload = { 
          ...aboutData, 
          aboutText: formData.aboutText.split("\n\n") 
      };
      const update1 = updateAboutPageData(aboutPayload);

      // 2. Update Principal Page
      const principalPayload = {
          ...principalData,
          message: formData.principalText
      };
      const update2 = updatePrincipalPageData(principalPayload);

      // 3. Update Misc Data
      const miscPayload = {
          flagImage: formData.flagImage,
          activitiesText: formData.activitiesText,
          noticeText: formData.noticeText
      };
      const update3 = updateSchoolSectionData(miscPayload);

      await Promise.all([update1, update2, update3]);

      if (refreshData) await refreshData();

      setIsEditing(false);
      alert("All sections updated successfully!");
    } catch (error) {
      console.error("Save failed", error);
      alert("Failed to save changes.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white font-sans relative group">
        
        {/* --- EDIT CONTROLS --- */}
        {isAdmin && !isEditing && (
          <button
            onClick={startEdit}
            className="absolute top-4 right-4 z-10 text-gray-400 hover:text-blue-600 transition-colors bg-white p-2 rounded-full shadow-md border border-gray-100"
            title="Edit Section"
          >
            <Edit size={20} />
          </button>
        )}

        {isEditing && (
          <div className="fixed bottom-6 right-6 z-50 flex gap-3 animate-fade-in-up">
            <button
              onClick={cancelEdit}
              className="bg-white text-gray-600 px-5 py-2 rounded-full text-sm font-medium shadow-lg border border-gray-200 flex items-center gap-2 hover:bg-gray-50"
            >
              <X size={14} /> Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-zinc-900 text-white px-5 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2 hover:bg-black disabled:opacity-70"
            >
              {loading ? "Saving..." : <><Save size={14} /> Save Changes</>}
            </button>
          </div>
        )}

        <div className={`flex flex-col lg:flex-row gap-8 items-start ${isEditing ? "ring-2 ring-blue-500/20 rounded-xl p-6 bg-blue-50/10" : ""}`}>
          
          {/* --- LEFT COLUMN: IMAGE --- */}
          <div className="w-full lg:w-1/3 flex flex-col items-center">
            <div className="bg-white p-2 border border-gray-200 shadow-lg rounded-sm w-full max-w-sm relative group/image">
              <div className="aspect-square bg-blue-100 relative overflow-hidden">
                <img 
                  src={displayData.flagImage}
                  alt="Indian Flag or School Image" 
                  className="w-full h-full object-cover"
                />
                
                {isEditing && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <label className="cursor-pointer bg-white text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center gap-2 transition-transform hover:scale-105">
                      <Upload size={14} /> Change Image
                      <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                    </label>
                  </div>
                )}
              </div>
            </div>
            <p className="mt-3 text-gray-500 text-sm font-medium tracking-wide uppercase">
              29 Years Establishment.
            </p>
          </div>

          {/* --- RIGHT COLUMN: CONTENT GRID --- */}
          <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
            
            <ContentBlock
              icon={<Users className="w-10 h-10 text-yellow-500" />}
              title="About"
              name="aboutText"
              value={displayData.aboutText}
              isEditing={isEditing}
              onChange={handleChange}
              link="/about-adarsh"
            />

            <ContentBlock
              icon={<Bell className="w-10 h-10 text-yellow-500" />}
              title="Meet Our Principal"
              name="principalText"
              value={displayData.principalText}
              isEditing={isEditing}
              onChange={handleChange}
              link="/principal" 
            />

            <ContentBlock
              icon={<GraduationCap className="w-10 h-10 text-yellow-500" />}
              title="Activities"
              name="activitiesText"
              value={displayData.activitiesText}
              isEditing={isEditing}
              onChange={handleChange}
              link="/activities"
              className="-mt-4" // FIX: Shift Activities up
            />

            <div className="flex items-end justify-center px-2">
              <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-xl border border-red-700 bg-white">
                <div className="bg-linear-to-r from-red-700 to-red-600 py-4 text-center shadow-md">
                  <h3 className="text-white font-extrabold text-xl tracking-wide drop-shadow-sm uppercase">
                    Notice Board
                  </h3>
                </div>
                <div className="bg-white p-5">
                  <div className="bg-white/90 border border-red-300 rounded-xl p-4 shadow-sm">
                    {isEditing ? (
                        <textarea
                            name="noticeText"
                            value={displayData.noticeText}
                            onChange={handleChange}
                            rows={4}
                            className="w-full p-2 text-sm font-semibold text-red-900 border border-red-200 rounded focus:outline-none focus:border-red-500 bg-red-50"
                        />
                    ) : (
                        <p className="text-red-900 font-semibold text-sm leading-relaxed whitespace-pre-line">
                            {displayData.noticeText}
                        </p>
                    )}
                  </div>
                </div>
                <div className="h-1 bg-linear-to-r from-red-700 to-red-400 animate-pulse"></div>
              </div>
            </div>

          </div>
        </div>
    </div>
  );
};

/* ---------------- REUSABLE CONTENT BLOCK ---------------- */
const ContentBlock = ({ icon, title, name, value, isEditing, onChange, link, className = "" }) => (
  <div className={`flex gap-4 ${className}`}>
    <div className="shrink-0">
      {icon}
    </div>
    <div className="flex-1">
      <h3 className="text-red-700 font-bold text-lg mb-2 uppercase">{title}</h3>
      
      {isEditing ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={5}
          className="w-full p-2 text-sm text-gray-600 border border-gray-300 rounded focus:outline-none focus:border-blue-500 mb-2"
        />
      ) : (
        // FIX: Replaced truncateText with 'line-clamp-4' for perfect visual alignment
        <p className="text-gray-500 text-sm leading-relaxed mb-4 text-justify line-clamp-4">
          {value}
        </p>
      )}

      {link && (
        <Link 
          to={link}
          className="inline-block border border-red-700 text-red-700 px-4 py-1 text-xs font-semibold hover:bg-red-50 transition-colors uppercase"
        >
          Read More
        </Link>
      )}
    </div>
  </div>
);

export default SchoolSection;