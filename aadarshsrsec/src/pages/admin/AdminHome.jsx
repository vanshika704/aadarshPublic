// import React, { useState, useEffect } from 'react';
// import { getPageData, updatePageData, uploadImage } from '../../services/content.service';
// import { useApi } from '../../hooks/useApi';
// import { Save, Pencil, Upload, Trash2, X, Plus, Image as ImageIcon, Loader2 } from 'lucide-react';

// // --- INITIAL STATE STRUCTURE ---
// // This ensures the UI doesn't crash if Firebase is empty initially
// const INITIAL_DATA = {
//   banners: [], // For HeroCarousel
//   schoolSection: {
//     aboutText: "Since 1995 Adarsh Senior Secondary School has offered a safe pleasant...",
//     principalMsg: "Dear Parents and Students, It is with great pleasure...",
//     activitiesText: "Teaching does not need to be limited to textbooks...",
//     noticeText: "Admission Open - Session 2023–24\nNursery to Class 10+1"
//   },
//   leadership: [
//     { id: 1, role: "Chairman", name: "Dr. T.P.Singh", message: "Education is the passport...", image: "" },
//     { id: 2, role: "Managing Director", name: "Ms. Renu Singh", message: "No kid is unsmart...", image: "" },
//     { id: 3, role: "Principal", name: "Mr. Rajesh Gohri", message: "We understand that...", image: "" }
//   ],
//   gridSection: {
//     toppersImage: "",
//     assembly1: "",
//     assembly2: "",
//     admissionPoster: ""
//   },
//   annualFunction: {
//     title: "ANNUAL FUNCTION",
//     text: "The much awaited Annual Function was organized...",
//     image: ""
//   }
// };

// const AdminHome = () => {
//   // --- Hooks ---
//   const { request: fetchHome, loading: fetchLoading } = useApi(getPageData);
//   const { request: saveHome, loading: saveLoading } = useApi(updatePageData);
  
//   // --- State ---
//   const [homeData, setHomeData] = useState(INITIAL_DATA);
//   const [uploading, setUploading] = useState(false);
  
//   // Modal State for Text Editing
//   const [editModal, setEditModal] = useState({ 
//     isOpen: false, 
//     section: '', 
//     field: '', 
//     value: '', 
//     index: null 
//   });

//   // --- Load Data on Mount ---
//   useEffect(() => {
//     const loadData = async () => {
//       const result = await fetchHome('home');
//       if (result && result.data) {
//         // Merge fetched data with initial structure to ensure all keys exist
//         setHomeData(prev => ({ ...prev, ...result.data }));
//       }
//     };
//     loadData();
//   }, [fetchHome]);

//   // --- Handlers ---

//   const handleSaveAll = async () => {
//     const result = await saveHome('home', homeData);
//     if(result) alert("Home page updated successfully!");
//   };

//   // Generic Image Upload Handler
//   const handleImageUpload = async (e, section, field = null, index = null) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setUploading(true);
//     // Path: home/banners/file.jpg or home/leadership/file.jpg
//     const { url, error } = await uploadImage(file, `home/${section}`);
//     setUploading(false);

//     if (error) {
//       alert("Upload failed: " + error);
//       return;
//     }

//     const newData = { ...homeData };

//     if (section === 'banners') {
//       // Banners is an array of strings
//       newData.banners.push(url);
//     } else if (index !== null && Array.isArray(newData[section])) {
//       // Array of objects (Leadership)
//       newData[section][index][field] = url;
//     } else if (field) {
//       // Nested object (schoolSection, gridSection, annualFunction)
//       newData[section][field] = url;
//     }

//     setHomeData(newData);
//   };

//   const handleDeleteBanner = (index) => {
//     if(!window.confirm("Delete this banner?")) return;
//     const newBanners = homeData.banners.filter((_, i) => i !== index);
//     setHomeData({ ...homeData, banners: newBanners });
//   };

//   // Text Edit Logic
//   const openEdit = (section, field, value, index = null) => {
//     setEditModal({ isOpen: true, section, field, value, index });
//   };

//   const saveEdit = () => {
//     const { section, field, value, index } = editModal;
//     const newData = { ...homeData };

//     if (index !== null) {
//       newData[section][index][field] = value;
//     } else {
//       newData[section][field] = value;
//     }
    
//     setHomeData(newData);
//     setEditModal({ ...editModal, isOpen: false });
//   };

//   if (fetchLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin mr-2"/> Loading Admin Panel...</div>;

//   return (
//     <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      
//       {/* --- ADMIN HEADER --- */}
//       <div className="bg-white border-b border-slate-200 sticky top-0 z-40 px-6 py-4 flex justify-between items-center shadow-sm">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-800">Home Page Admin</h1>
//           <p className="text-xs text-slate-500">Public Website Content Management</p>
//         </div>
//         <button 
//           onClick={handleSaveAll}
//           disabled={saveLoading || uploading}
//           className="bg-blue-700 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-800 disabled:opacity-50 flex items-center gap-2 transition-all"
//         >
//           {saveLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
//           {saveLoading ? "Saving..." : "Save Changes"}
//         </button>
//       </div>

//       <div className="max-w-6xl mx-auto p-6 space-y-10">

//         {/* --- 1. HERO CAROUSEL --- */}
//         <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
//           <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
//             <ImageIcon size={20} className="text-blue-600"/> Hero Banner Images
//           </h2>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {homeData.banners && homeData.banners.map((url, idx) => (
//               <div key={idx} className="relative aspect-video group rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
//                 <img src={url} alt="Banner" className="w-full h-full object-cover" />
//                 <button 
//                   onClick={() => handleDeleteBanner(idx)}
//                   className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
//                 >
//                   <Trash2 size={14} />
//                 </button>
//               </div>
//             ))}
            
//             {/* Add New Banner Button */}
//             <label className="border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors h-32 md:h-auto">
//               {uploading ? <Loader2 className="animate-spin text-blue-600" /> : <Plus className="text-blue-500 mb-1" />}
//               <span className="text-xs font-semibold text-blue-600">Add Slide</span>
//               <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'banners')} />
//             </label>
//           </div>
//         </section>

//         {/* --- 2. SCHOOL INFO SECTION --- */}
//         <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
//           <h2 className="text-lg font-bold text-slate-800 mb-6 border-b pb-2">School Information Text</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
//             {/* Helper Component for Text Fields */}
//             {['aboutText', 'principalMsg', 'activitiesText'].map((field) => (
//               <div key={field} className="p-4 border rounded-lg hover:border-blue-400 transition-colors relative group">
//                 <div className="flex justify-between items-center mb-2">
//                   <h3 className="font-bold text-slate-700 uppercase text-xs tracking-wider">{field.replace(/([A-Z])/g, ' $1')}</h3>
//                   <button onClick={() => openEdit('schoolSection', field, homeData.schoolSection[field])} className="text-blue-600 p-1 hover:bg-blue-50 rounded"><Pencil size={16}/></button>
//                 </div>
//                 <p className="text-sm text-slate-600 line-clamp-3">{homeData.schoolSection[field]}</p>
//               </div>
//             ))}

//             {/* Notice Board Special Styling */}
//             <div className="p-4 border border-red-200 bg-red-50 rounded-lg relative">
//                <div className="flex justify-between items-center mb-2">
//                  <h3 className="font-bold text-red-900 uppercase text-xs tracking-wider">Notice Board</h3>
//                  <button onClick={() => openEdit('schoolSection', 'noticeText', homeData.schoolSection.noticeText)} className="text-red-700 p-1 hover:bg-red-100 rounded"><Pencil size={16}/></button>
//                </div>
//                <p className="text-sm text-red-800 whitespace-pre-line font-medium line-clamp-3">{homeData.schoolSection.noticeText}</p>
//             </div>

//           </div>
//         </section>

//         {/* --- 3. LEADERSHIP SECTION --- */}
//         <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
//           <h2 className="text-lg font-bold text-slate-800 mb-6 border-b pb-2">Leadership Team</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {homeData.leadership.map((item, index) => (
//               <div key={item.id} className="border rounded-lg overflow-hidden flex flex-col bg-slate-50">
//                 {/* Image Upload Area */}
//                 <div className="h-48 bg-slate-200 relative group">
//                   {item.image ? (
//                     <img src={item.image} alt={item.role} className="w-full h-full object-cover object-top" />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center text-slate-400"><ImageIcon size={30}/></div>
//                   )}
//                   <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-white">
//                     <Upload size={20} className="mb-1"/>
//                     <span className="text-xs font-bold">Change Photo</span>
//                     <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'leadership', 'image', index)} />
//                   </label>
//                 </div>
                
//                 {/* Editable Inputs */}
//                 <div className="p-4 flex-1">
//                   <div className="mb-2">
//                     <input 
//                       className="font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none w-full transition-colors"
//                       value={item.name}
//                       onChange={(e) => {
//                         const newData = {...homeData};
//                         newData.leadership[index].name = e.target.value;
//                         setHomeData(newData);
//                       }}
//                     />
//                     <p className="text-xs text-red-700 font-bold uppercase mt-1">{item.role}</p>
//                   </div>
//                   <div className="mt-3 relative group">
//                       <p className="text-xs text-slate-600 line-clamp-4 bg-white p-2 border border-slate-100 rounded">{item.message}</p>
//                       <button 
//                         onClick={() => openEdit('leadership', 'message', item.message, index)}
//                         className="absolute top-2 right-2 text-blue-600 bg-blue-50 p-1 rounded hover:bg-blue-100"
//                       >
//                          <Pencil size={12} />
//                       </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* --- 4. GRID / HIGHLIGHTS SECTION --- */}
//         <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
//            <h2 className="text-lg font-bold text-slate-800 mb-6 border-b pb-2">Highlights & Posters (Grid)</h2>
//            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             
//              {/* Helper for Grid Images */}
//              {[
//                { key: 'toppersImage', label: 'Toppers / Result' },
//                { key: 'admissionPoster', label: 'Admission Poster' },
//                { key: 'assembly1', label: 'Assembly Photo 1' },
//                { key: 'assembly2', label: 'Assembly Photo 2' }
//              ].map((gridItem) => (
//                <div key={gridItem.key} className="flex flex-col gap-2">
//                   <span className="text-xs font-bold text-slate-500 uppercase">{gridItem.label}</span>
//                   <div className="aspect-3/4 bg-slate-100 rounded border relative group overflow-hidden">
//                     {homeData.gridSection[gridItem.key] ? (
//                         <img src={homeData.gridSection[gridItem.key]} className="w-full h-full object-cover"/>
//                     ) : (
//                         <div className="flex items-center justify-center h-full text-xs text-slate-400">No Image</div>
//                     )}
//                     <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer text-white transition-opacity">
//                         <Upload size={16} className="mr-1"/> <span className="text-xs">Upload</span>
//                         <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'gridSection', gridItem.key)} />
//                     </label>
//                   </div>
//                </div>
//              ))}

//            </div>
//         </section>

//         {/* --- 5. ANNUAL FUNCTION --- */}
//         <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
//            <h2 className="text-lg font-bold text-slate-800 mb-6 border-b pb-2">Annual Function</h2>
//            <div className="flex flex-col md:flex-row gap-6">
             
//              {/* Image */}
//              <div className="w-full md:w-1/3">
//                  <div className="aspect-video bg-slate-100 border rounded relative group overflow-hidden">
//                    {homeData.annualFunction.image ? (
//                        <img src={homeData.annualFunction.image} className="w-full h-full object-cover" />
//                    ) : (
//                        <div className="flex items-center justify-center h-full text-slate-400">No Image</div>
//                    )}
//                    <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer text-white transition-opacity">
//                         <Upload size={16} className="mr-1"/> <span className="text-xs">Change</span>
//                         <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'annualFunction', 'image')} />
//                    </label>
//                  </div>
//              </div>

//              {/* Text Content */}
//              <div className="w-full md:w-2/3 space-y-4">
//                  <div>
//                    <label className="text-xs font-bold text-slate-500 uppercase">Section Title</label>
//                    <input 
//                        className="w-full font-bold text-xl border-b border-slate-300 focus:border-blue-600 outline-none py-1 bg-transparent"
//                        value={homeData.annualFunction.title}
//                        onChange={(e) => {
//                              const newData = {...homeData};
//                              newData.annualFunction.title = e.target.value;
//                              setHomeData(newData);
//                        }}
//                    />
//                  </div>
//                  <div className="relative group">
//                      <p className="text-sm text-slate-600 leading-relaxed border p-3 rounded bg-slate-50 min-h-[100px]">{homeData.annualFunction.text}</p>
//                      <button 
//                        onClick={() => openEdit('annualFunction', 'text', homeData.annualFunction.text)}
//                        className="absolute top-2 right-2 text-blue-600 hover:bg-blue-100 p-1.5 rounded-full"
//                      >
//                        <Pencil size={16} />
//                      </button>
//                  </div>
//              </div>

//            </div>
//         </section>

//       </div>

//       {/* --- EDIT TEXT MODAL --- */}
//       {editModal.isOpen && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-100 p-4">
//             <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
//                 <div className="bg-slate-50 px-6 py-4 border-b flex justify-between items-center">
//                     <h3 className="font-bold text-slate-800">Edit Content</h3>
//                     <button onClick={() => setEditModal({...editModal, isOpen: false})} className="text-slate-400 hover:text-red-600 transition-colors">
//                         <X size={20}/>
//                     </button>
//                 </div>
                
//                 <div className="p-6">
//                     <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
//                         {editModal.field.replace(/([A-Z])/g, ' $1').trim()}
//                     </label>
//                     <textarea 
//                         className="w-full h-48 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-sm leading-relaxed"
//                         value={editModal.value}
//                         onChange={(e) => setEditModal({...editModal, value: e.target.value})}
//                         autoFocus
//                     ></textarea>
//                 </div>

//                 <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t">
//                     <button 
//                         onClick={() => setEditModal({...editModal, isOpen: false})}
//                         className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded font-medium text-sm transition-colors"
//                     >
//                         Cancel
//                     </button>
//                     <button 
//                         onClick={saveEdit}
//                         className="px-6 py-2 bg-blue-700 text-white rounded font-medium text-sm hover:bg-blue-800 shadow-sm transition-colors"
//                     >
//                         Save Changes
//                     </button>
//                 </div>
//             </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default AdminHome;