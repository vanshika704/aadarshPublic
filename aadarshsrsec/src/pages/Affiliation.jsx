// import React from 'react';
// import { FileBadge, Building2, BookOpen } from 'lucide-react';
// import img1 from "../assets/affiliation.jpg"
// // COMPONENT: DataRow (Defined OUTSIDE to prevent re-render bugs)
// const DataRow = ({ label, value, fullWidth = false }) => (
//   <div className={`py-1.5 ${fullWidth ? 'col-span-full' : ''}`}>
//     <dt className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-0.5">{label}</dt>
//     <dd className="text-slate-800 text-xs md:text-sm font-medium leading-relaxed">{value}</dd>
//   </div>
// );

// const Affiliation = ({ data }) => {
//   // 1. Fallback Data
//   const defaultContent = {
//     sectionTitle: "School Status & Affiliation",
//     image: img1, 
    
//     affiliation: {
//       title: "Official Status",
//       board: "Central Board of Secondary Education (C.B.S.E.)",
//       number: "531041",
//       since: "April, 2012",
//       extensionUpto: "March, 2020", 
//       nocNumber: "9/59-07PS(1)",
//       nocDate: "10/06/2010",
//       trust: "Shaheed Bhagat Singh Education Society"
//     },

//     schoolType: {
//       title: "School Type",
//       description: "English medium schools affiliated to C.B.S.E., New Delhi. Adarsh school follow C.B.S.E. curriculum & NCERT pattern as per National Curriculum Framework."
//     },
//     curriculum: {
//       title: "Curriculum",
//       description: "The school follows C.B.S.E. curriculum."
//     }
//   };

//   const content = data || defaultContent;

//   return (
//     // Reduced outer padding: py-8 instead of py-12
//     <section className="w-full bg-white py-8 px-4 md:px-8">
//       {/* Reduced max-width: max-w-6xl instead of 7xl */}
//       <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        
//         {/* --- Left Column: Elegant Image (Scaled Down) --- */}
//         {/* Height reduced: h-[350/450px] instead of h-[500/650px] */}
//         <div className="relative h-[350px] lg:h-[450px] w-full rounded-lg overflow-hidden shadow-md bg-slate-100 group">
//            <img 
//              src={content.image} 
//              alt="School Building" 
//              className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
//            />
//            {/* Minimal Overlay Badge (Smaller) */}
//            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-2 rounded shadow-sm border border-white/50">
//               <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Affiliation No.</span>
//               <span className="block text-lg font-bold text-blue-900 leading-tight">{content.affiliation.number}</span>
//            </div>
//         </div>

//         {/* --- Right Column: Clean Content --- */}
//         <div className="flex flex-col justify-center space-y-6">
          
//           {/* Header */}
//           <div className="border-l-2 border-red-700 pl-4">
//             {/* Font reduced: text-2xl */}
//             <h2 className="text-xl font-light text-slate-800">
//               {content.sectionTitle}
//             </h2>
//           </div>

//           {/* Affiliation Details - Compact Grid */}
//           <div className="bg-slate-50/50 rounded-lg p-5 border border-slate-100">
//             <div className="flex items-center gap-2 mb-4">
//                 <FileBadge className="text-red-700 w-4 h-4 opacity-80" />
//                 <h3 className="text-base font-semibold text-blue-900">{content.affiliation.title}</h3>
//             </div>
            
//             <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 divide-y md:divide-y-0 divide-slate-200">
//                 <DataRow label="Affiliated Board" value={content.affiliation.board} fullWidth />
                
//                 <div className="col-span-full h-px bg-slate-200 my-1 hidden md:block"></div>
                
//                 <DataRow label="Since" value={content.affiliation.since} />
//                 <DataRow label="Extension Upto" value={content.affiliation.extensionUpto} />
                
//                 <div className="col-span-full h-px bg-slate-200 my-1 hidden md:block"></div>

//                 <DataRow label="NOC No." value={content.affiliation.nocNumber} />
//                 <DataRow label="NOC Date" value={content.affiliation.nocDate} />
                
//                 <div className="col-span-full h-px bg-slate-200 my-1 hidden md:block"></div>

//                 <DataRow label="Managed By Trust" value={content.affiliation.trust} fullWidth />
//             </dl>
//           </div>

//           {/* Descriptive Sections - Compact List */}
//           <div className="space-y-4">
            
//             {/* School Type */}
//             <div className="flex gap-3">
//                 <div className="mt-0.5 shrink-0">
//                     <Building2 className="w-4 h-4 text-slate-400" />
//                 </div>
//                 <div>
//                     <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-0.5">{content.schoolType.title}</h4>
//                     <p className="text-slate-600 text-xs md:text-sm leading-relaxed text-justify">
//                         {content.schoolType.description}
//                     </p>
//                 </div>
//             </div>

//             {/* Curriculum */}
//             <div className="flex gap-3">
//                  <div className="mt-0.5 shrink-0">
//                     <BookOpen className="w-4 h-4 text-slate-400" />
//                 </div>
//                 <div>
//                     <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-0.5">{content.curriculum.title}</h4>
//                     <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
//                         {content.curriculum.description}
//                     </p>
//                 </div>
//             </div>

//           </div>

//         </div>
//       </div>
//     </section>
//   );
// };

// export default Affiliation;


import React, { useState, useEffect } from 'react';
import { FileBadge, Building2, BookOpen, Edit, Save, X, Upload, Loader2 } from 'lucide-react';
// 1. Auth & Service
import { useAuth } from '../context/AuthContext';
// FIX: Import getAffiliationData to fetch data directly
import { getAffiliationData, updateAffiliationData, uploadFile } from '../services/content.service';

// Default Assets
import img1 from "../assets/affiliation.jpg";

/* ---------- DEFAULT DATA ---------- */
const DEFAULTS = {
  sectionTitle: "School Status & Affiliation",
  image: img1, 
  
  affiliation: {
    title: "Official Status",
    board: "Central Board of Secondary Education (C.B.S.E.)",
    number: "531041",
    since: "April, 2012",
    extensionUpto: "March, 2020", 
    nocNumber: "9/59-07PS(1)",
    nocDate: "10/06/2010",
    trust: "Shaheed Bhagat Singh Education Society"
  },

  schoolType: {
    title: "School Type",
    description: "English medium schools affiliated to C.B.S.E., New Delhi. Adarsh school follow C.B.S.E. curriculum & NCERT pattern as per National Curriculum Framework."
  },
  curriculum: {
    title: "Curriculum",
    description: "The school follows C.B.S.E. curriculum."
  }
};

/* ---------- SMART DATA ROW COMPONENT ---------- */
const DataRow = ({ label, value, name, fullWidth = false, isEditing, onChange }) => (
  <div className={`py-2 ${fullWidth ? 'col-span-full' : ''}`}>
    <dt className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">{label}</dt>
    <dd className="text-slate-800 text-xs md:text-sm font-medium leading-relaxed">
      {isEditing ? (
        <input 
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-slate-100 border-b border-blue-400 px-1 py-0.5 outline-none focus:bg-white transition-colors"
        />
      ) : (
        value
      )}
    </dd>
  </div>
);

/* ---------- MAIN COMPONENT ---------- */
const Affiliation = () => {
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
      const data = await getAffiliationData();
      setServerData(data);
    } catch (error) {
      console.error("Error fetching affiliation data:", error);
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
      affiliation: { 
        ...DEFAULTS.affiliation, 
        ...(serverData?.affiliation || {}) 
      },
      schoolType: {
        ...DEFAULTS.schoolType,
        ...(serverData?.schoolType || {})
      },
      curriculum: {
        ...DEFAULTS.curriculum,
        ...(serverData?.curriculum || {})
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
  
  // 1. Top Level Fields (Title)
  const handleBasicChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Affiliation Nested Object
  const handleAffiliationChange = (e) => {
    setFormData({
      ...formData,
      affiliation: { ...formData.affiliation, [e.target.name]: e.target.value }
    });
  };

  // 3. School Type Nested Object
  const handleSchoolTypeChange = (e) => {
    setFormData({
      ...formData,
      schoolType: { ...formData.schoolType, [e.target.name]: e.target.value }
    });
  };

  // 4. Curriculum Nested Object
  const handleCurriculumChange = (e) => {
    setFormData({
      ...formData,
      curriculum: { ...formData.curriculum, [e.target.name]: e.target.value }
    });
  };

  // 5. Image Upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const url = await uploadFile(file, "affiliation_assets");
      setFormData(prev => ({ ...prev, image: url }));
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateAffiliationData(formData);
      await fetchData(); // Refresh data
      setIsEditing(false);
      alert("Affiliation details updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to save.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-white py-12 px-4 md:px-8 relative group">
      
      {/* ADMIN EDIT BUTTON */}
      {isAdmin && !isEditing && (
        <button 
          onClick={startEdit}
          className="absolute top-4 right-4 z-10 bg-white text-slate-600 p-2 rounded-full shadow-md border border-slate-200 hover:text-blue-600 transition"
          title="Edit Details"
        >
          <Edit size={18} />
        </button>
      )}

      {/* SAVE CONTROLS */}
      {isEditing && (
        <div className="fixed bottom-10 right-10 z-[100] flex gap-2 animate-bounce-in">
          <button 
            onClick={cancelEdit} 
            className="bg-white text-slate-700 border border-slate-300 px-4 py-2 rounded-full shadow-xl flex items-center gap-2 font-bold hover:bg-slate-50"
          >
            <X size={18} /> Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={loading} 
            className="bg-blue-900 text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 font-bold hover:bg-blue-800 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save
          </button>
        </div>
      )}

      <div className={`max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start transition-all duration-300 ${isEditing ? 'p-4 rounded-xl border-2 border-dashed border-blue-200' : ''}`}>
        
        {/* --- Left Column: Image --- */}
        <div className="relative h-[350px] lg:h-[450px] w-full rounded-lg overflow-hidden shadow-md bg-slate-100 group/image">
           <img 
             src={content.image} 
             alt="School Building" 
             className="w-full h-full object-cover transition duration-700 group-hover/image:scale-105"
           />
           
           {/* Image Upload Overlay */}
           {isEditing && (
             <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover/image:opacity-100 transition-opacity">
               <Upload className="text-white mb-2" size={32} />
               <span className="text-white text-xs font-bold uppercase">Change Image</span>
               <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
             </label>
           )}

           {/* Minimal Overlay Badge */}
           <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-2 rounded shadow-sm border border-white/50 pointer-events-none">
             <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Affiliation No.</span>
             <span className="block text-lg font-bold text-blue-900 leading-tight">{content.affiliation.number}</span>
           </div>
        </div>

        {/* --- Right Column: Content --- */}
        <div className="flex flex-col justify-center space-y-6">
          
          {/* Header */}
          <div className="border-l-4 border-red-700 pl-4">
            {isEditing ? (
              <input 
                name="sectionTitle"
                value={formData.sectionTitle}
                onChange={handleBasicChange}
                className="text-xl font-light text-slate-800 w-full border-b border-gray-300 outline-none"
              />
            ) : (
              <h2 className="text-xl font-light text-slate-800">
                {content.sectionTitle}
              </h2>
            )}
          </div>

          {/* Affiliation Details - Compact Grid */}
          <div className="bg-slate-50/50 rounded-lg p-5 border border-slate-100 relative">
            {isEditing && <span className="absolute top-2 right-2 text-[10px] text-blue-400 font-mono">EDITING INFO</span>}
            
            <div className="flex items-center gap-2 mb-4">
                <FileBadge className="text-red-700 w-4 h-4 opacity-80" />
                <h3 className="text-base font-semibold text-blue-900">Official Status</h3>
            </div>
            
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 divide-y md:divide-y-0 divide-slate-200">
                <DataRow label="Affiliated Board" name="board" value={content.affiliation.board} isEditing={isEditing} onChange={handleAffiliationChange} fullWidth />
                
                <div className="col-span-full h-px bg-slate-200 my-1 hidden md:block"></div>
                
                <DataRow label="Since" name="since" value={content.affiliation.since} isEditing={isEditing} onChange={handleAffiliationChange} />
                <DataRow label="Extension Upto" name="extensionUpto" value={content.affiliation.extensionUpto} isEditing={isEditing} onChange={handleAffiliationChange} />
                
                <div className="col-span-full h-px bg-slate-200 my-1 hidden md:block"></div>

                <DataRow label="NOC No." name="nocNumber" value={content.affiliation.nocNumber} isEditing={isEditing} onChange={handleAffiliationChange} />
                <DataRow label="NOC Date" name="nocDate" value={content.affiliation.nocDate} isEditing={isEditing} onChange={handleAffiliationChange} />
                
                <div className="col-span-full h-px bg-slate-200 my-1 hidden md:block"></div>

                <DataRow label="Managed By Trust" name="trust" value={content.affiliation.trust} isEditing={isEditing} onChange={handleAffiliationChange} fullWidth />
                <DataRow label="Affiliation No." name="number" value={content.affiliation.number} isEditing={isEditing} onChange={handleAffiliationChange} />
            </dl>
          </div>

          {/* Descriptive Sections */}
          <div className="space-y-4">
            
            {/* School Type */}
            <div className="flex gap-3">
                <div className="mt-0.5 shrink-0">
                    <Building2 className="w-4 h-4 text-slate-400" />
                </div>
                <div className="w-full">
                    {isEditing ? (
                      <input 
                        name="title"
                        value={formData.schoolType.title}
                        onChange={handleSchoolTypeChange}
                        className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-0.5 w-full bg-slate-50"
                      />
                    ) : (
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-0.5">{content.schoolType.title}</h4>
                    )}
                    
                    {isEditing ? (
                      <textarea 
                        name="description"
                        value={formData.schoolType.description}
                        onChange={handleSchoolTypeChange}
                        rows={3}
                        className="w-full text-xs p-2 border border-slate-300 rounded"
                      />
                    ) : (
                      <p className="text-slate-600 text-xs md:text-sm leading-relaxed text-justify">
                          {content.schoolType.description}
                      </p>
                    )}
                </div>
            </div>

            {/* Curriculum */}
            <div className="flex gap-3">
                  <div className="mt-0.5 shrink-0">
                    <BookOpen className="w-4 h-4 text-slate-400" />
                </div>
                <div className="w-full">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-0.5">{content.curriculum.title}</h4>
                    {isEditing ? (
                      <textarea 
                        name="description"
                        value={formData.curriculum.description}
                        onChange={handleCurriculumChange}
                        rows={2}
                        className="w-full text-xs p-2 border border-slate-300 rounded"
                      />
                    ) : (
                      <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                          {content.curriculum.description}
                      </p>
                    )}
                </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Affiliation;