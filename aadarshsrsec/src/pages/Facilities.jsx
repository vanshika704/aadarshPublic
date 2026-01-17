import React, { useState, useEffect } from 'react';
import { Bus, Monitor, BookOpen, Building2, ShieldCheck, Wifi, Edit, Save, X, Upload, Loader2 } from 'lucide-react';
// 1. IMPORT TOAST
import toast from 'react-hot-toast';

import { useAuth } from '../context/AuthContext';
import { getInfraPageData, updateInfraPageData, uploadFile } from '../services/content.service';

// Default Assets
import img1 from "../assets/building.jpg";
import img2 from "../assets/library.jpg";
import img3 from "../assets/computerlab2.jpg";
import img4 from "../assets/transport.jpg";
import img5 from "../assets/sm1.jpg";
import img6 from "../assets/sm2.jpg";
import img7 from "../assets/sm3.jpg";
import img8 from "../assets/sm4.jpg";
import img9 from "../assets/sm5.jpg";
import img10 from "../assets/sm6.jpg";

/* ---------- DEFAULT DATA ---------- */
const DEFAULTS = {
  title: "Infrastructure & Facilities",
  subtitle: "A safe, pleasant, and nurturing environment.",
  
  intro: {
    highlight: "ADARSH buildings stand tall surrounded with lush green surroundings.",
    description: "All the new buildings are as per the latest safety norms and are earthquake proof. Spacious classrooms, standard sized playgrounds, new fleet of buses, smart classes, separate Kids Zones are a few of the specialties of ADARSH schools that make them infrastructural marvels. Video cameras are installed for safety purposes that keep a regular watch on the activities round the clock. Classrooms are spacious and airy, fitted with all the modern equipments, a high level of sanitation, maintained all the time.",
    campusDetails: "ADARSH School has a big campus consisting of separate buildings for Primary, Middle and Senior Secondary classes and separate Hostel buildings for Boys & Girls. School has spacious, airy classrooms furnished with suitable furniture, lighting arrangements and other infrastructure. It has 24 hours uninterrupted power supply. It has vast lush green lawns and playground."
  },

  features: [
    {
      title: "State of the Art Building",
      icon: "Building2",
      image: img1,
      description: "The school has been operating officially under the trust/society Shaheed Bhagat Singh Education Society. The school is equipped with 26 class rooms and all essential facilities like computer lab, science labs, smart classrooms, own transport, big playground etc."
    },
    {
      title: "School Library & Language Lab",
      icon: "BookOpen",
      image: img2,
      description: "Books can play the role of best friend in any student's life. The importance of books, quality literature, and articles cannot be ignored. We have maintained a decent collection of books & other reading material to cater to the needs of our students & teachers. The language lab with all necessary audio-visual aids is available for students."
    },
    {
      title: "Computer Lab",
      icon: "Monitor",
      image: img3,
      description: "The modern age education system cannot survive without computer education, information technology & internet. The school has a fully loaded computer lab for students with internet facility."
    },
    {
      title: "Transport Facility",
      icon: "Bus",
      image: img4,
      description: "We have our own fleet of school buses equipped with GPS Enabled devices and experienced drivers for our students & staff. The indoor parking facility is an added feature. Timely inspection of school buses & workshops to sensitize drivers & attendants is part of our transport department."
    },
    {
      title: "Smart Class",
      icon: "Wifi",
      image: img5,
      description: "Classrooms are equipped with smart technology to enhance the learning experience, making education interactive and engaging for all students."
    }
  ],

  gallery: [
    { src: img6, span: "col-span-1 md:col-span-2 row-span-2" }, 
    { src: img7, span: "col-span-1 row-span-1" },
    { src: img8, span: "col-span-1 row-span-1" },
    { src: img9, span: "col-span-1 row-span-2" }, 
    { src: img10, span: "col-span-1 md:col-span-2 row-span-1" },
  ]
};

/* ---------- HELPER: ICON MAPPER ---------- */
const getIcon = (iconName) => {
  const icons = {
    Building2: <Building2 className="w-5 h-5" />,
    BookOpen: <BookOpen className="w-5 h-5" />,
    Monitor: <Monitor className="w-5 h-5" />,
    Bus: <Bus className="w-5 h-5" />,
    Wifi: <Wifi className="w-5 h-5" />,
    ShieldCheck: <ShieldCheck className="w-5 h-5" />
  };
  return icons[iconName] || <Building2 className="w-5 h-5" />;
};

/* ---------- UPLOAD OVERLAY ---------- */
const UploadOverlay = ({ onChange }) => (
  <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity">
    <label className="cursor-pointer bg-white text-black px-3 py-1.5 rounded shadow-lg flex gap-2 items-center hover:bg-gray-100 transform hover:scale-105 transition-all">
      <Upload size={14} /> <span className="text-xs font-bold uppercase">Change</span>
      <input 
        type="file" 
        hidden 
        accept="image/*" 
        onChange={(e) => {
            onChange(e);
            e.target.value = ''; // Reset input
        }} 
      />
    </label>
  </div>
);

/* ---------- MAIN COMPONENT ---------- */
const Infrastructure = () => {
  const { currentUser, userRole } = useAuth();
  const isAdmin = currentUser && userRole === 'admin';

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // State for server data
  const [serverData, setServerData] = useState(null);
  // State for form editing
  const [formData, setFormData] = useState(DEFAULTS);

  // --- 1. FETCH DATA ON MOUNT ---
  const fetchData = async () => {
    try {
      const data = await getInfraPageData();
      setServerData(data);
    } catch (error) {
      console.error("Error fetching infra page data:", error);
      toast.error("Failed to load page content.");
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
      intro: { 
        ...DEFAULTS.intro, 
        ...(serverData?.intro || {}) 
      },
      // Ensure arrays exist
      features: (serverData?.features && serverData.features.length > 0) ? serverData.features : DEFAULTS.features,
      gallery: (serverData?.gallery && serverData.gallery.length > 0) ? serverData.gallery : DEFAULTS.gallery
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

  // 1. General Text Change
  const handleIntroChange = (e) => {
    setFormData(prev => ({
      ...prev,
      intro: { ...prev.intro, [e.target.name]: e.target.value }
    }));
  };

  const handleTitleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 2. Feature Array Changes
  const handleFeatureChange = (index, field, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index][field] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const handleFeatureImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const toastId = toast.loading("Uploading image...");

    try {
      const url = await uploadFile(file, "infra_features");
      const newFeatures = [...formData.features];
      newFeatures[index].image = url;
      setFormData(prev => ({ ...prev, features: newFeatures }));
      toast.success("Image uploaded!", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Upload failed.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // 3. Gallery Array Changes
  const handleGalleryUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const toastId = toast.loading("Updating gallery...");

    try {
      const url = await uploadFile(file, "infra_gallery");
      const newGallery = [...formData.gallery];
      newGallery[index].src = url;
      setFormData(prev => ({ ...prev, gallery: newGallery }));
      toast.success("Gallery updated!", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Upload failed.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const toastId = toast.loading("Saving changes...");

    try {
      await updateInfraPageData(formData);
      await fetchData(); // Refresh data
      setIsEditing(false);
      toast.success("Page updated successfully!", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Failed to save changes.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-slate-50 overflow-hidden relative group/page">
      
      {/* ADMIN CONTROLS */}
      {isAdmin && !isEditing && (
        <button
          onClick={startEdit}
          className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition hover:scale-110"
          title="Edit Page"
        >
          <Edit size={24} />
        </button>
      )}

      {isEditing && (
        <div className="fixed bottom-6 right-6 z-50 flex gap-2 animate-bounce-in">
          <button onClick={cancelEdit} className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-full shadow-xl flex items-center gap-2 font-bold">
            <X size={18} /> Cancel
          </button>
          <button onClick={handleSave} disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 font-bold disabled:opacity-70">
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save
          </button>
        </div>
      )}

      {/* --- PART 1: INTRO SECTION --- */}
      <div className={`py-12 px-4 md:px-8 bg-white border-b border-gray-100 ${isEditing ? 'border-2 border-dashed border-blue-200' : ''}`}>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center">
              <span className="text-red-700 font-bold tracking-widest text-[10px] uppercase">Campus & Facilities</span>
              
              {isEditing ? (
                <input 
                  name="title"
                  value={content.title}
                  onChange={handleTitleChange}
                  className="text-2xl md:text-3xl font-bold text-blue-900 mt-2 text-center w-full border-b border-blue-200 outline-none"
                />
              ) : (
                <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mt-1">{content.title}</h2>
              )}
          </div>
          
          <div className="text-gray-600 leading-relaxed space-y-4 text-justify text-sm md:text-base">
            {isEditing ? (
              <>
                <textarea 
                  name="highlight"
                  value={content.intro.highlight}
                  onChange={handleIntroChange}
                  className="w-full p-2 border border-gray-300 rounded font-medium text-slate-800 text-center"
                  rows={2}
                />
                <textarea 
                  name="description"
                  value={content.intro.description}
                  onChange={handleIntroChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  rows={6}
                />
                <textarea 
                  name="campusDetails"
                  value={content.intro.campusDetails}
                  onChange={handleIntroChange}
                  className="w-full p-2 border border-gray-300 rounded text-xs"
                  rows={4}
                />
              </>
            ) : (
              <>
                <p className="font-medium text-slate-800 text-center">{content.intro.highlight}</p>
                <p>{content.intro.description}</p>
                <p className="text-xs text-gray-500">{content.intro.campusDetails}</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* --- PART 2: ZIG-ZAG FEATURES --- */}
      <div className="py-12 px-4 md:px-8 max-w-6xl mx-auto space-y-16">
        {content.features.map((feature, index) => (
          <div 
            key={index} 
            className={`flex flex-col md:flex-row items-center gap-8 md:gap-12 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''} ${isEditing ? 'p-4 border border-dashed border-gray-300 rounded-xl' : ''}`}
          >
            {/* Image Side */}
            <div className="w-full md:w-1/2 group relative">
              <div className="absolute inset-2 border border-blue-900 rounded-xl transform translate-x-1 translate-y-1 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition duration-300"></div>
              <div className="relative w-full h-56 md:h-72 rounded-xl overflow-hidden shadow-md bg-white">
                <img 
                  src={feature.image} 
                  alt={feature.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                />
                {isEditing && <UploadOverlay onChange={(e) => handleFeatureImageUpload(e, index)} />}
              </div>
            </div>

            {/* Text Side */}
            <div className="w-full md:w-1/2 space-y-3">
              <div className="w-12 h-12 bg-red-100 text-red-700 rounded-lg flex items-center justify-center mb-2">
                {getIcon(feature.icon)}
              </div>
              
              {isEditing ? (
                <>
                  <input 
                    value={feature.title}
                    onChange={(e) => handleFeatureChange(index, "title", e.target.value)}
                    className="text-xl font-bold text-blue-900 w-full border-b border-blue-200 outline-none"
                  />
                  <textarea 
                    value={feature.description}
                    onChange={(e) => handleFeatureChange(index, "description", e.target.value)}
                    rows={4}
                    className="text-gray-600 w-full text-sm p-2 border border-gray-300 rounded"
                  />
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-blue-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-justify text-sm md:text-base">
                    {feature.description}
                  </p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* --- PART 3: GALLERY GRID --- */}
      <div className="py-12 px-4 md:px-8 bg-white mt-12 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-blue-900">Campus Gallery</h2>
            <div className="h-1 w-16 bg-red-700 mx-auto mt-3 rounded-full"></div>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-4 auto-rows-[160px] gap-4 ${isEditing ? 'p-4 border-2 border-dashed border-gray-300 rounded-xl' : ''}`}>
            {content.gallery.map((item, idx) => (
              <div 
                key={idx} 
                className={`relative rounded-xl overflow-hidden shadow-sm group hover:shadow-lg transition-shadow ${item.span}`}
              >
                <img 
                  src={item.src} 
                  alt={`Gallery ${idx}`}
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/20 transition duration-300"></div>
                
                {/* Always show overlay logic if editing */}
                {isEditing && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <label className="cursor-pointer bg-white text-black px-2 py-1 rounded shadow-sm text-xs font-bold uppercase hover:bg-gray-200">
                        Replace
                        <input type="file" hidden accept="image/*" onChange={(e) => handleGalleryUpload(e, idx)} />
                      </label>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
};

export default Infrastructure;