import React, { useState, useEffect } from 'react';
import { Target, Eye, Edit, Save, X, Upload, Loader2 } from 'lucide-react';
// 1. Auth & Service
import { useAuth } from '../context/AuthContext';
// FIX: Import getMissionVisionData to fetch data directly
import { getMissionVisionData, updateMissionVisionData, uploadFile } from '../services/content.service';

// Default Assets
import img1 from "../assets/assembly.jpg";
import img2 from "../assets/2.jpg";

/* ---------- DEFAULT DATA ---------- */
const DEFAULTS = {
  sectionTag: "Our Core Values",
  mission: {
    title: "Our Mission",
    icon: "Target", 
    text: [
      "The School prepares students to understand, contribute to, and succeed in a rapidly changing society, thus making the world a better and more just place.",
      "We will ensure that our students develop both the skills a sound education provides and the competencies essential for success and leadership in the emerging creative economy.",
      "We will also lead in generating practical and theoretical knowledge that enables people to better understand our world and improve conditions for local and global communities."
    ]
  },
  vision: {
    title: "Our Vision",
    icon: "Eye",
    intro: "Our vision aligns with shifts in the global economy, society, and environment, which animate our mission and our values:",
    points: [
      "Creativity, innovation, and a desire to challenge the status quo, both in what and how we teach and in the intellectual ambitions of the school itself.",
      "Social engagement, orienting students' academic experiences to help them become critically engaged citizens dedicated to solving problems and contributing to the public good."
    ]
  },
  images: {
    img1: img1,
    img2: img2 
  }
};

/* ---------- UPLOAD OVERLAY ---------- */
const UploadOverlay = ({ onChange, label }) => (
  <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
    <label className="cursor-pointer bg-white text-blue-900 px-3 py-1.5 rounded shadow-lg flex gap-2 items-center hover:bg-gray-100 transform hover:scale-105 transition-all">
      <Upload size={14} /> <span className="text-xs font-bold uppercase">{label}</span>
      <input type="file" hidden accept="image/*" onChange={onChange} />
    </label>
  </div>
);

/* ---------- MAIN COMPONENT ---------- */
const MissionVision = () => {
  // 2. Auth Check
  const { currentUser, userRole } = useAuth();
  const isAdmin = currentUser && userRole === 'admin';

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // State to hold server data
  const [serverData, setServerData] = useState(null);
  // State for form editing
  const [formData, setFormData] = useState(DEFAULTS);

  // --- 1. FETCH DATA ON MOUNT ---
  const fetchData = async () => {
    try {
      const data = await getMissionVisionData();
      setServerData(data);
    } catch (error) {
      console.error("Error fetching mission/vision data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- 2. DEEP MERGE HELPER ---
  const getMergedData = () => {
    return { 
      ...DEFAULTS, 
      ...serverData,
      mission: { 
        ...DEFAULTS.mission, 
        ...(serverData?.mission || {}) 
      },
      vision: {
        ...DEFAULTS.vision,
        ...(serverData?.vision || {})
      },
      images: {
        ...DEFAULTS.images,
        ...(serverData?.images || {})
      }
    };
  };

  // --- 3. DETERMINE DISPLAY CONTENT ---
  const content = isEditing ? formData : getMergedData();

  /* --- HANDLERS --- */

  const startEdit = () => {
    setFormData(getMergedData());
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  // 1. Text & Titles
  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  // 2. Mission Array (Joined by double newline for editing)
  const handleMissionTextChange = (e) => {
    const paragraphs = e.target.value.split('\n\n');
    handleNestedChange('mission', 'text', paragraphs);
  };

  // 3. Vision Array (Joined by single newline for editing bullet points)
  const handleVisionPointsChange = (e) => {
    const points = e.target.value.split('\n').filter(line => line.trim() !== "");
    handleNestedChange('vision', 'points', points);
  };

  // 4. Image Uploads
  const handleImageUpload = async (e, key) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const url = await uploadFile(file, "mission_assets");
      setFormData(prev => ({
        ...prev,
        images: { ...prev.images, [key]: url }
      }));
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateMissionVisionData(formData);
      await fetchData(); // Refresh data
      setIsEditing(false);
      alert("Section updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-slate-50 py-16 px-4 md:px-8 overflow-hidden relative group/section">
      
      {/* ADMIN EDIT BUTTON */}
      {isAdmin && !isEditing && (
        <button 
          onClick={startEdit}
          className="absolute top-4 right-4 z-50 bg-white text-blue-900 p-2 rounded-full shadow-lg border border-blue-100 hover:scale-110 transition"
          title="Edit Section"
        >
          <Edit size={20} />
        </button>
      )}

      {/* SAVE CONTROLS */}
      {isEditing && (
        <div className="fixed bottom-10 right-10 z-100 flex gap-2 animate-bounce-in">
          <button onClick={cancelEdit} className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-full shadow-xl flex items-center gap-2 font-bold">
            <X size={18} /> Cancel
          </button>
          <button onClick={handleSave} disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 font-bold disabled:opacity-70">
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save
          </button>
        </div>
      )}

      <div className={`max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${isEditing ? 'border-2 border-dashed border-blue-300 rounded-xl p-6' : ''}`}>
        
        {/* --- Left Column: Dual Image Composition --- */}
        <div className="relative h-[450px] md:h-[550px] w-full">
          
          {/* Decorative Circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-60"></div>

          {/* Image 1 (Top Left) */}
          <div className="absolute top-0 left-0 md:left-4 w-72 h-48 md:w-96 md:h-64 rounded-2xl shadow-2xl border-[6px] border-white overflow-hidden z-10 transform -rotate-3 hover:rotate-0 transition duration-500 group/img1">
             <img 
               src={content.images.img1} 
               alt="Mission" 
               className="w-full h-full object-cover"
             />
             <div className="absolute bottom-0 left-0 w-full bg-blue-900/90 p-3">
                <span className="text-white text-xs md:text-sm font-bold uppercase tracking-widest block text-center">Mission</span>
             </div>
             {isEditing && <UploadOverlay onChange={(e) => handleImageUpload(e, 'img1')} label="Change Mission Img" />}
          </div>

          {/* Image 2 (Bottom Right) */}
          <div className="absolute bottom-0 right-0 md:right-4 w-72 h-48 md:w-96 md:h-64 rounded-2xl shadow-2xl border-[6px] border-white overflow-hidden z-20 transform rotate-3 hover:rotate-0 transition duration-500 group/img2">
             <img 
               src={content.images.img2} 
               alt="Vision" 
               className="w-full h-full object-cover"
             />
             <div className="absolute bottom-0 left-0 w-full bg-red-700/90 p-3">
                <span className="text-white text-xs md:text-sm font-bold uppercase tracking-widest block text-center">Vision</span>
             </div>
             {isEditing && <UploadOverlay onChange={(e) => handleImageUpload(e, 'img2')} label="Change Vision Img" />}
          </div>
        </div>

        {/* --- Right Column: Content --- */}
        <div className="space-y-10">
          
          {/* MISSION BLOCK */}
          <div className="relative pl-8 border-l-[3px] border-red-200 hover:border-red-700 transition duration-300">
            <div className="absolute -left-3.5 top-0 bg-white p-1.5 rounded-full border border-red-200 shadow-sm">
               <Target size={20} className="text-red-700" />
            </div>
            
            {isEditing ? (
              <input 
                value={content.mission.title}
                onChange={(e) => handleNestedChange('mission', 'title', e.target.value)}
                className="text-2xl font-bold text-blue-900 mb-3 w-full border-b border-blue-200 outline-none"
              />
            ) : (
              <h3 className="text-2xl font-bold text-blue-900 mb-3">{content.mission.title}</h3>
            )}

            <div className="space-y-3 text-gray-600 text-sm md:text-base text-justify leading-relaxed">
              {isEditing ? (
                <textarea 
                  value={content.mission.text.join('\n\n')}
                  onChange={handleMissionTextChange}
                  rows={8}
                  className="w-full p-3 border border-gray-300 rounded text-sm"
                  placeholder="Enter paragraphs separated by blank lines..."
                />
              ) : (
                content.mission.text.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))
              )}
            </div>
          </div>

          {/* VISION BLOCK */}
          <div className="relative pl-8 border-l-[3px] border-blue-200 hover:border-blue-900 transition duration-300">
             <div className="absolute -left-3.5 top-0 bg-white p-1.5 rounded-full border border-blue-200 shadow-sm">
               <Eye size={20} className="text-blue-900" />
            </div>
            
            {isEditing ? (
              <input 
                value={content.vision.title}
                onChange={(e) => handleNestedChange('vision', 'title', e.target.value)}
                className="text-2xl font-bold text-blue-900 mb-3 w-full border-b border-blue-200 outline-none"
              />
            ) : (
              <h3 className="text-2xl font-bold text-blue-900 mb-3">{content.vision.title}</h3>
            )}
            
            {isEditing ? (
              <textarea 
                value={content.vision.intro}
                onChange={(e) => handleNestedChange('vision', 'intro', e.target.value)}
                rows={2}
                className="w-full p-2 border border-gray-300 rounded text-sm italic mb-3"
              />
            ) : (
              <p className="text-gray-700 text-sm md:text-base font-medium mb-3 italic">
                {content.vision.intro}
              </p>
            )}
            
            {isEditing ? (
              <textarea 
                value={content.vision.points.join('\n')}
                onChange={handleVisionPointsChange}
                rows={6}
                className="w-full p-3 border border-gray-300 rounded text-sm"
                placeholder="Enter each bullet point on a new line..."
              />
            ) : (
              <ul className="space-y-3">
                {content.vision.points.map((point, index) => (
                  <li key={index} className="flex gap-3 items-start text-gray-600 text-sm md:text-base text-justify leading-relaxed">
                    <span className="mt-2 w-2 h-2 rounded-full bg-red-700 shrink-0"></span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default MissionVision;