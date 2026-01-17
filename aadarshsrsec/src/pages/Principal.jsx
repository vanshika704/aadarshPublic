import React, { useState, useEffect } from 'react';
import { Edit, Save, X, Upload, Loader2 } from 'lucide-react';
// 1. IMPORT TOAST
import toast from 'react-hot-toast';

import { useAuth } from '../context/AuthContext';
// FIX: Import getPrincipalPageData to fetch data directly
import { getPrincipalPageData, updatePrincipalPageData, uploadFile } from '../services/content.service';

// Default Assets
import img1 from "../assets/principal.jpeg";

/* ---------- DEFAULT DATA ---------- */
const DEFAULTS = {
  tag: "Leadership", 
  title: "A Message From The Principal's Desk",
  greeting: "Dear Parents and Students,",
  message: [
    "It is with great pleasure that I welcome you to our school website.",
    "As The Principal of Adarsh Senior Secondary School I am hugely impressed by the commitment of the school and the staffs to the provision of an excellent all-round education for our students in our state of the art facilities.",
    "We understands that all the parents expect the best for their wards.",
    "We at Adarsh are endeavour to provide each student a diverse education that promotes self-discipline, sense of responsibility, social and global consciousness and excellence in learning."
  ],
  highlightQuote: "We at Adarsh are endeavour to provide each student a diverse education that promotes self-discipline, sense of responsibility, social and global consciousness and excellence in learning.",
  signOff: "Sincerely,",
  principal: {
    name: "Mr. Rajesh Gohri",
    qualification: "M.Com, B.Ed", 
    designation: "Principal",
    image: img1 
  }
};

/* ---------- UPLOAD OVERLAY ---------- */
const UploadOverlay = ({ onChange }) => (
  <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
    <label className="cursor-pointer bg-white text-blue-900 px-3 py-1.5 rounded shadow-lg flex gap-2 items-center hover:bg-gray-100 transform hover:scale-105 transition-all">
      <Upload size={14} /> <span className="text-xs font-bold uppercase">Change Photo</span>
      <input type="file" hidden accept="image/*" onChange={onChange} />
    </label>
  </div>
);

/* ---------- MAIN COMPONENT ---------- */
const Principal = () => {
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
      const data = await getPrincipalPageData();
      setServerData(data);
    } catch (error) {
      console.error("Error fetching principal data:", error);
      toast.error("Failed to load principal's message.");
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
      principal: { 
        ...DEFAULTS.principal, 
        ...(serverData?.principal || {}) 
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

  // 1. Text Fields
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 2. Nested Principal Object
  const handlePrincipalChange = (e) => {
    setFormData(prev => ({
      ...prev,
      principal: { ...prev.principal, [e.target.name]: e.target.value }
    }));
  };

  // 3. Message Array
  const handleMessageChange = (e) => {
    const paragraphs = e.target.value.split('\n\n');
    setFormData(prev => ({ ...prev, message: paragraphs }));
  };

  // 4. Image Upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    // TOAST: Loading
    const toastId = toast.loading("Uploading photo...");

    try {
      const url = await uploadFile(file, "principal_assets");
      setFormData(prev => ({
        ...prev,
        principal: { ...prev.principal, image: url }
      }));
      // TOAST: Success
      toast.success("Photo uploaded!", { id: toastId });
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
      await updatePrincipalPageData(formData);
      await fetchData(); // Refresh data
      setIsEditing(false);
      // TOAST: Success
      toast.success("Principal page updated!", { id: toastId });
    } catch (err) {
      console.error(err);
      // TOAST: Error
      toast.error("Failed to save changes.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-white py-10 px-4 md:px-8 relative group/section">
      
      {/* ADMIN CONTROLS */}
      {isAdmin && !isEditing && (
        <button 
          onClick={startEdit}
          className="absolute top-4 right-4 z-50 bg-blue-900 text-white p-2 rounded-full shadow-lg border border-blue-100 hover:scale-110 transition"
          title="Edit Page"
        >
          <Edit size={20} />
        </button>
      )}

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

      <div className={`max-w-6xl mx-auto ${isEditing ? 'p-4 border-2 border-dashed border-blue-200 rounded-xl' : ''}`}>
        
        {/* Section Header */}
        <div className="mb-8 text-center md:text-left">
          <span className="text-red-700 font-bold tracking-widest text-[10px] uppercase">
            {isEditing ? (
              <input 
                name="tag"
                value={content.tag}
                onChange={handleChange}
                className="bg-transparent border-b border-red-200 outline-none w-20 text-center md:text-left"
              />
            ) : content.tag}
          </span>
          
          {isEditing ? (
            <input 
              name="title"
              value={content.title}
              onChange={handleChange}
              className="text-2xl md:text-3xl font-bold text-blue-900 mt-1 w-full border-b border-blue-200 outline-none"
            />
          ) : (
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mt-1">{content.title}</h2>
          )}
          <div className="h-1 w-16 bg-red-700 mt-2 rounded-full mx-auto md:mx-0"></div>
        </div>

        {/* Content Card */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
          
          {/* Left: Image Card */}
          <div className="w-full md:w-64 shrink-0 relative group">
            <div className="absolute top-2 -left-2 w-full h-full bg-blue-900 rounded-lg opacity-10"></div>
            
            <div className="relative bg-white p-2 rounded-lg shadow-md border border-gray-100 group/image">
              <div className="w-full h-64 md:h-72 overflow-hidden rounded-md relative">
                <img 
                  src={content.principal.image} 
                  alt={content.principal.name} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                />
                {isEditing && <UploadOverlay onChange={handleImageUpload} />}
              </div>
              
              <div className="pt-3 text-center">
                {isEditing ? (
                  <>
                    <input 
                      name="name"
                      value={content.principal.name}
                      onChange={handlePrincipalChange}
                      className="text-lg font-bold text-blue-900 w-full text-center border-b border-blue-100 mb-1"
                      placeholder="Name"
                    />
                    <input 
                      name="designation"
                      value={content.principal.designation}
                      onChange={handlePrincipalChange}
                      className="text-red-700 text-xs font-semibold uppercase w-full text-center border-b border-red-100 mb-1"
                      placeholder="Designation"
                    />
                    <input 
                      name="qualification"
                      value={content.principal.qualification}
                      onChange={handlePrincipalChange}
                      className="text-gray-500 text-[10px] w-full text-center border-b border-gray-100"
                      placeholder="Qualifications"
                    />
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-bold text-blue-900">{content.principal.name}</h3>
                    <p className="text-red-700 text-xs font-semibold uppercase">{content.principal.designation}</p>
                    <p className="text-gray-500 text-[10px] mt-0.5">{content.principal.qualification}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: Text Content */}
          <div className="flex-1 w-full">
            {isEditing ? (
              <input 
                name="greeting"
                value={content.greeting}
                onChange={handleChange}
                className="text-lg font-semibold text-gray-800 mb-3 w-full border-b border-gray-300"
              />
            ) : (
              <h4 className="text-lg font-semibold text-gray-800 mb-3">{content.greeting}</h4>
            )}
            
            <div className="space-y-3 text-gray-600 text-sm md:text-base leading-relaxed text-justify">
              {isEditing ? (
                <textarea 
                  value={(content.message || []).join('\n\n')}
                  onChange={handleMessageChange}
                  rows={10}
                  className="w-full p-3 border border-gray-300 rounded text-sm leading-relaxed"
                  placeholder="Enter paragraphs separated by blank lines..."
                />
              ) : (
                (content.message || []).map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))
              )}
            </div>

            {/* Dynamic Quote Box */}
            <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-900 rounded-r-lg">
              {isEditing ? (
                <textarea 
                  name="highlightQuote"
                  value={content.highlightQuote}
                  onChange={handleChange}
                  className="w-full p-2 bg-transparent text-blue-900 font-medium italic text-sm outline-none resize-none"
                  rows={3}
                />
              ) : (
                content.highlightQuote && (
                  <p className="text-blue-900 font-medium italic text-sm">
                    "{content.highlightQuote}"
                  </p>
                )
              )}
            </div>

            <div className="mt-6 text-right">
              {isEditing ? (
                <input 
                  name="signOff"
                  value={content.signOff}
                  onChange={handleChange}
                  className="font-signature text-xl text-gray-400 text-right w-full border-none outline-none"
                />
              ) : (
                <p className="font-signature text-xl text-gray-400">{content.signOff}</p>
              )}
              <p className="text-blue-900 font-bold text-sm mt-1">{content.principal.name}</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Principal;