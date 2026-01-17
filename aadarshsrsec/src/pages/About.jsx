import React, { useState, useEffect } from 'react';
import { Edit, Save, X, Upload, Loader2 } from 'lucide-react';
// 1. IMPORT TOAST
import toast from 'react-hot-toast';

import { useAuth } from '../context/AuthContext';
// 2. Import Service Functions
// FIX: Import 'getAboutPageData' to fetch data directly
import { getAboutPageData, updateAboutPageData, uploadFile } from '../services/content.service';

// Import Assets
import img1 from "../assets/banner1.jpg";
import img2 from "../assets/chairman.jpg";

/* ---------- DEFAULT DATA ---------- */
const DEFAULTS = {
  schoolName: "Adarsh Senior Secondary Public School, Nahra",
  schoolImage: img1, 
  aboutTitle: "A Tradition of Excellence Since 1995",
  aboutText: [
    "Since 1995, Adarsh Senior Secondary School has offered a safe, pleasant, and nurturing environment for students from mountain city preschool to senior secondary level. We are dedicated to providing first-class education to embrace the vision of our students achieving excellence through their experience at Adarsh school.",
    "Located in the suburbs of Haryana, the school started as a humble effort in 1995 with the mission of rural educational development. During its journey, it has evolved as a pioneer in the field of education and is now better known as a synonym for right education direction.",
    "It is not hyperbolical to say that less known places like Nahra, a small village, are now well-recognized names in educational corridors for producing a large number of well-qualified professionals. Adarsh Senior Secondary Public School, Nahra, in its true sense, is a ray of hope for this rural belt of Haryana. The school is co-educational, English-medium for classes Nursery to XII, and is affiliated with C.B.S.E., New Delhi."
  ],
  chairman: {
    name: "Dr. T.P. Singh",
    designation: "Chairman",
    credentials: "Educationist, Mathematician, & Researcher",
    image: img2, 
    message: "Education is the passport to the future, a challenge for tomorrow belongs to those who prepare for it today. Adarsh Sr. Sec. School has been striving hard since 1995 to fulfill this dream of students to acquire quality education and hence, prepare them to face the challenge of future. For the last 27 years, the school has been trying to keep pace with the rural and backward area students with the latest developments in the field of education and information on the pattern of CBSE NEW DELHI. An environment of academic excellence, self discipline, co-curricular activities, and sports culture has made our school a preferred destination for the knowledge seekers of this region.",
    welcomeNote: "It is a matter of great pleasure and honor for me to welcome the new principal of Adarsh Sen Sec School, Ms. Anju Batra, who has previously worked for 16 years in various institutions and remained successful in delivering positive results. Congratulations to the principal, staff team, and students for making innovative and inspiring work."
  }
};

/* ---------- UPLOAD OVERLAY COMPONENT ---------- */
const UploadOverlay = ({ onChange, label = "Change Image" }) => (
  <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 transition-opacity opacity-0 group-hover:opacity-100">
    <label className="cursor-pointer bg-white text-black px-3 py-1.5 rounded shadow-lg flex gap-2 items-center hover:bg-gray-100 transition-transform hover:scale-105">
      <Upload size={14} /> <span className="text-xs font-bold uppercase">{label}</span>
      <input type="file" hidden accept="image/*" onChange={onChange} />
    </label>
  </div>
);

/* ---------- MAIN COMPONENT ---------- */
const About = () => {
  const { currentUser, userRole } = useAuth();
  const isAdmin = currentUser && userRole === 'admin';

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // State to hold the data fetched from the server
  const [serverData, setServerData] = useState(null);
  
  // State for the edit form
  const [formData, setFormData] = useState(DEFAULTS);

  // --- 1. FETCH DATA ON MOUNT ---
  const fetchData = async () => {
    try {
      const data = await getAboutPageData();
      setServerData(data);
    } catch (error) {
      console.error("Error fetching about page data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- 2. DEEP MERGE HELPER ---
  // Merges Server Data with Defaults to ensure no fields are undefined
  const getMergedData = () => {
    return { 
      ...DEFAULTS, 
      ...serverData,
      chairman: { 
        ...DEFAULTS.chairman, 
        ...(serverData?.chairman || {}) 
      }
    };
  };

  // --- 3. DETERMINE DISPLAY CONTENT ---
  // If editing, show form data. If viewing, show merged server data.
  const content = isEditing ? formData : getMergedData();

  // --- HANDLERS ---

  const startEdit = () => {
    // When editing starts, seed the form with the latest merged data
    setFormData(getMergedData());
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleChairmanChange = (e) => {
    setFormData(prev => ({
      ...prev,
      chairman: { ...prev.chairman, [e.target.name]: e.target.value }
    }));
  };

  const handleAboutTextChange = (e) => {
    const text = e.target.value;
    const paragraphs = text.split('\n\n'); 
    setFormData(prev => ({ ...prev, aboutText: paragraphs }));
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    // TOAST: Loading
    const toastId = toast.loading("Uploading image...");

    try {
      const url = await uploadFile(file, "about_assets");
      setFormData(prev => {
        if (type === 'school') {
          return { ...prev, schoolImage: url };
        } else if (type === 'chairman') {
          return { ...prev, chairman: { ...prev.chairman, image: url } };
        }
        return prev;
      });
      // TOAST: Success
      toast.success("Image uploaded!", { id: toastId });
    } catch (err) {
      console.error(err);
      // TOAST: Error
      toast.error("Upload failed.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    // TOAST: Loading
    const toastId = toast.loading("Saving changes...");

    try {
      // Update the 'about_page' document
      await updateAboutPageData(formData);
      
      // Re-fetch the data to update the view
      await fetchData();

      setIsEditing(false);
      // TOAST: Success
      toast.success("About page updated successfully!", { id: toastId });
    } catch (err) {
      console.error(err);
      // TOAST: Error
      toast.error("Failed to save.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-full bg-white py-10 px-4 md:px-8 overflow-hidden group/section">
      
      {/* EDIT BUTTON */}
      {isAdmin && !isEditing && (
        <button
          onClick={startEdit}
          className="absolute top-4 right-4 z-50 bg-white text-blue-900 p-2 rounded-full shadow-lg border border-gray-100 hover:scale-110 transition"
          title="Edit About Page"
        >
          <Edit size={20} />
        </button>
      )}

      {/* SAVE CONTROLS */}
      {isEditing && (
        <div className="fixed bottom-10 right-10 z-100 flex gap-2 animate-bounce-in">
          <button onClick={cancelEdit} className="bg-white text-gray-700 border border-gray-200 px-5 py-2 rounded-full shadow-xl flex gap-2 items-center font-bold">
            <X size={18} /> Cancel
          </button>
          <button onClick={handleSave} disabled={loading} className="bg-green-600 text-white px-5 py-2 rounded-full shadow-xl flex gap-2 items-center font-bold disabled:opacity-70">
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save
          </button>
        </div>
      )}

      {/* --- Main Grid --- */}
      <div className={`max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${isEditing ? 'border-2 border-dashed border-blue-300 p-4 rounded-xl' : ''}`}>
        
        {/* Left: School Image */}
        <div className="relative group">
          <div className="absolute -inset-2 bg-linear-to-tr from-blue-900 to-red-700 rounded-xl opacity-20 group-hover:opacity-30 transition duration-500 blur-lg"></div>
          
          <div className="relative h-[380px] lg:h-[580px] w-full rounded-xl overflow-hidden shadow-xl border-2 border-white group/image">
            <img 
              src={content.schoolImage} 
              alt="School Campus" 
              className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700 ease-in-out"
            />
            {isEditing && <UploadOverlay onChange={(e) => handleImageUpload(e, 'school')} />}
            
            <div className="absolute bottom-4 left-4 bg-red-700 text-white px-4 py-2 rounded shadow-lg pointer-events-none">
              <span className="block text-[10px] font-medium uppercase tracking-wider">Est.</span>
              <span className="block text-xl font-bold">1995</span>
            </div>
          </div>
        </div>

        {/* Right: Text Content */}
        <div className="space-y-4">
          <div className="inline-block w-full">
            <h4 className="text-red-700 font-bold uppercase tracking-widest text-[10px] mb-1">Who We Are</h4>
            
            {isEditing ? (
              <input 
                name="schoolName"
                value={formData.schoolName || ""}
                onChange={handleChange}
                className="text-2xl md:text-3xl font-bold text-blue-900 leading-tight w-full border-b border-blue-300 outline-none bg-transparent mb-2 placeholder-blue-300"
                placeholder="School Name"
              />
            ) : (
              <h2 className="text-2xl md:text-3xl font-bold text-blue-900 leading-tight">
                {content.schoolName}
              </h2>
            )}
            <div className="h-1 w-16 bg-red-700 mt-3 rounded-full"></div>
          </div>

          <div className="space-y-3 text-gray-600 text-sm md:text-base leading-relaxed text-justify">
             {isEditing ? (
                <textarea 
                  value={(formData.aboutText || []).join('\n\n')} 
                  onChange={handleAboutTextChange}
                  rows={15}
                  className="w-full p-3 border border-gray-300 rounded-md text-sm leading-relaxed outline-none focus:border-blue-500"
                  placeholder="Enter paragraphs separated by blank lines..."
                />
             ) : (
                (content.aboutText || []).map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))
             )}
          </div>
        </div>
      </div>

      {/* --- Bottom Section: Chairman's Message --- */}
      <div className={`max-w-6xl mx-auto mt-12 ${isEditing ? 'border-2 border-dashed border-red-300 p-4 rounded-xl mt-8' : ''}`}>
        <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border-l-4 border-red-700 shadow-sm relative">
          
          <div className="absolute top-2 right-6 text-6xl text-gray-200 font-serif opacity-50 select-none">
            &rdquo;
          </div>

          <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            
            {/* Chairman Avatar */}
            <div className="shrink-0 w-full md:w-auto flex flex-col items-center md:items-start text-center md:text-left">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-2 border-blue-900 shadow-lg overflow-hidden mb-3 relative group/chair">
                <img 
                  src={content.chairman.image} 
                  alt={content.chairman.name} 
                  className="w-full h-full object-cover"
                />
                {isEditing && <UploadOverlay onChange={(e) => handleImageUpload(e, 'chairman')} label="Photo" />}
              </div>
              
              {isEditing ? (
                <div className="flex flex-col gap-2 w-full min-w-[200px]">
                  <input name="name" value={formData.chairman.name || ""} onChange={handleChairmanChange} className="text-center md:text-left font-bold text-blue-900 border border-blue-200 p-1 text-sm rounded bg-white" placeholder="Name" />
                  <input name="designation" value={formData.chairman.designation || ""} onChange={handleChairmanChange} className="text-center md:text-left text-red-700 font-medium text-xs border border-red-200 p-1 rounded bg-white" placeholder="Role" />
                  <input name="credentials" value={formData.chairman.credentials || ""} onChange={handleChairmanChange} className="text-center md:text-left text-gray-500 text-xs border border-gray-200 p-1 rounded bg-white" placeholder="Degrees" />
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-blue-900">{content.chairman.name}</h3>
                  <p className="text-red-700 font-medium text-[10px]">{content.chairman.designation}</p>
                  <p className="text-gray-500 text-[10px] mt-0.5 max-w-[150px]">{content.chairman.credentials}</p>
                </>
              )}
            </div>

            {/* Message Content */}
            <div className="flex-1 w-full">
              <h3 className="text-xl font-bold text-blue-900 mb-4">Message from the Chairman</h3>
              
              <div className="text-gray-700 space-y-3 italic leading-relaxed text-sm md:text-base">
                {isEditing ? (
                  <>
                    <textarea 
                      name="message"
                      value={formData.chairman.message || ""}
                      onChange={handleChairmanChange}
                      rows={8}
                      className="w-full p-2 border border-gray-300 rounded italic text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                      placeholder="Main Message..."
                    />
                    <textarea 
                      name="welcomeNote"
                      value={formData.chairman.welcomeNote || ""}
                      onChange={handleChairmanChange}
                      rows={4}
                      className="w-full p-2 border-l-4 border-blue-900 bg-white rounded text-sm not-italic font-medium text-blue-900 focus:ring-2 focus:ring-blue-100 outline-none"
                      placeholder="Welcome Note..."
                    />
                  </>
                ) : (
                  <>
                    <p>"{content.chairman.message}"</p>
                    <p className="font-medium text-blue-900 not-italic border-l-2 border-blue-900 pl-3 bg-white py-2 pr-2 rounded-r">
                      {content.chairman.welcomeNote}
                    </p>
                  </>
                )}
              </div>

              <div className="mt-6 flex items-center justify-end">
                <div className="text-right">
                  <p className="text-gray-900 font-signature text-lg">Best Wishes,</p>
                  <p className="text-red-700 font-bold mt-0.5 text-sm">{content.chairman.name}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </section>
  );
};

export default About;