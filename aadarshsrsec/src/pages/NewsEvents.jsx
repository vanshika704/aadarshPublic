// import React from 'react';
// import { Calendar, ArrowRight, Image as ImageIcon } from 'lucide-react';
// import img1 from "../assets/sm1.jpg";
// import img2 from "../assets/sm2.jpg";
// import img3 from "../assets/sm3.jpg";
// import img4 from "../assets/sm4.jpg";
// import img5 from "../assets/sm5.jpg";
// import img6 from "../assets/sm6.jpg";
// const NewsGallery = ({ data }) => {
//   // 1. Fallback Data
//   const defaultContent = {
//     sectionTitle: "Latest Events & News",
//     subtitle: "Glimpses of activities and achievements at Adarsh School.",
    
//     events: [
//       {
//         id: 1,
//         image: img1,
//         date: "Dec 02, 2025",
//         title: "Annual Sports Day 2025",
//         description: "A display of strength, stamina, and sportsmanship. Students participated in track and field events with great enthusiasm."
//       },
//       {
//         id: 2,
//         image: img2,
//         date: "Nov 28, 2025",
//         title: "Science Exhibition Winners",
//         description: "Our students secured 1st place at the State Level Science Exhibition with their innovative model on renewable energy."
//       },
//       {
//         id: 3,
//         image: img3,
//         date: "Nov 14, 2025",
//         title: "Children's Day Celebration",
//         description: "A fun-filled day dedicated to our students, featuring cultural performances, magic shows, and games."
//       },
//       {
//         id: 4,
//         image: img4,
//         date: "Oct 25, 2025",
//         title: "Diwali Rangoli Competition",
//         description: "Students showcased their artistic skills by creating vibrant and colorful rangolis across the school campus."
//       },
//       {
//         id: 5,
//         image: img5,
//         date: "Oct 15, 2025",
//         title: "Inter-School Debate",
//         description: "Adarsh School hosted the district-level debate competition. Engaging arguments were presented by young minds."
//       },
//       {
//         id: 6,
//         image: img6,
//         date: "Sep 05, 2025",
//         title: "Teachers' Day Tribute",
//         description: "A heartfelt tribute to the mentors who shape the future. Students organized a special assembly for the staff."
//       }
//     ]
//   };

//   const content = data || defaultContent;

//   return (
//     <section className="w-full bg-slate-50 py-12 px-4 md:px-8">
//       <div className="max-w-6xl mx-auto space-y-10">
        
//         {/* --- Section Header --- */}
//         <div className="text-center">
//           <h2 className="text-3xl font-bold text-blue-900 flex items-center justify-center gap-3">
//             <ImageIcon className="w-6 h-6 text-red-700" />
//             {content.sectionTitle}
//           </h2>
//           <p className="text-slate-500 text-sm mt-2">{content.subtitle}</p>
//           <div className="h-1 w-16 bg-red-700 mx-auto mt-4 rounded-full"></div>
//         </div>

//         {/* --- Event Gallery Grid --- */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {content.events.map((event) => (
//             <div 
//               key={event.id} 
//               className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 group hover:shadow-lg transition-all duration-300"
//             >
//               {/* Image Container */}
//               <div className="relative h-48 overflow-hidden">
//                 <img 
//                   src={event.image} 
//                   alt={event.title} 
//                   className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
//                 />
//                 {/* Date Badge Overlay */}
//                 <div className="absolute top-3 left-3 bg-white/95 backdrop-blur px-3 py-1 rounded shadow text-xs font-bold text-blue-900 flex items-center gap-1.5">
//                   <Calendar className="w-3 h-3 text-red-700" />
//                   {event.date}
//                 </div>
//               </div>

//               {/* Content Container */}
//               <div className="p-5 space-y-3">
//                 <h3 className="text-lg font-bold text-blue-900 leading-tight group-hover:text-red-700 transition-colors">
//                   {event.title}
//                 </h3>
//                 <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
//                   {event.description}
//                 </p>
                
//                 {/* Read More Link */}
//                 <div className="pt-2">
//                   <button className="text-red-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all">
//                     View Details <ArrowRight className="w-3 h-3" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* --- View All Button --- */}
//         <div className="text-center pt-4">
//             <button className="px-6 py-2 border-2 border-blue-900 text-blue-900 font-bold rounded-full hover:bg-blue-900 hover:text-white transition duration-300 text-sm">
//                 View All Events
//             </button>
//         </div>

//       </div>
//     </section>
//   );
// };

// export default NewsGallery;


import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight, Image as ImageIcon, Edit, Save, X, Trash2, Plus, Upload, Loader2 } from 'lucide-react';
// 1. Auth & Service
import { useAuth } from '../context/AuthContext';
// FIX: Import getNewsData to fetch data directly
import { getNewsData, updateNewsData, uploadFile } from '../services/content.service';

// Default Assets
import img1 from "../assets/sm1.jpg";
import img2 from "../assets/sm2.jpg";
import img3 from "../assets/sm3.jpg";
import img4 from "../assets/sm4.jpg";
import img5 from "../assets/sm5.jpg";
import img6 from "../assets/sm6.jpg";

/* ---------- DEFAULT DATA ---------- */
const DEFAULTS = {
  sectionTitle: "Latest Events & News",
  subtitle: "Glimpses of activities and achievements at Adarsh School.",
  
  events: [
    {
      id: 1,
      image: img1,
      date: "Dec 02, 2025",
      title: "Annual Sports Day 2025",
      description: "A display of strength, stamina, and sportsmanship. Students participated in track and field events with great enthusiasm."
    },
    {
      id: 2,
      image: img2,
      date: "Nov 28, 2025",
      title: "Science Exhibition Winners",
      description: "Our students secured 1st place at the State Level Science Exhibition with their innovative model on renewable energy."
    },
    {
      id: 3,
      image: img3,
      date: "Nov 14, 2025",
      title: "Children's Day Celebration",
      description: "A fun-filled day dedicated to our students, featuring cultural performances, magic shows, and games."
    },
    {
      id: 4,
      image: img4,
      date: "Oct 25, 2025",
      title: "Diwali Rangoli Competition",
      description: "Students showcased their artistic skills by creating vibrant and colorful rangolis across the school campus."
    },
    {
      id: 5,
      image: img5,
      date: "Oct 15, 2025",
      title: "Inter-School Debate",
      description: "Adarsh School hosted the district-level debate competition. Engaging arguments were presented by young minds."
    },
    {
      id: 6,
      image: img6,
      date: "Sep 05, 2025",
      title: "Teachers' Day Tribute",
      description: "A heartfelt tribute to the mentors who shape the future. Students organized a special assembly for the staff."
    }
  ]
};

/* ---------- UPLOAD OVERLAY ---------- */
const UploadOverlay = ({ onChange }) => (
  <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity">
    <label className="cursor-pointer bg-white text-blue-900 px-3 py-1.5 rounded shadow-lg flex gap-2 items-center hover:bg-gray-100 transform hover:scale-105 transition-all">
      <Upload size={14} /> <span className="text-xs font-bold uppercase">Change</span>
      <input type="file" hidden accept="image/*" onChange={onChange} />
    </label>
  </div>
);

/* ---------- MAIN COMPONENT ---------- */
const NewsGallery = () => {
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
      const data = await getNewsData();
      setServerData(data);
    } catch (error) {
      console.error("Error fetching news data:", error);
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
      // Ensure events array exists and is merged if needed (though usually we replace arrays)
      events: (serverData?.events && serverData.events.length > 0) ? serverData.events : DEFAULTS.events
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

  // 1. Header Changes
  const handleHeaderChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 2. Event Text Changes
  const handleEventChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      events: prev.events.map(ev => ev.id === id ? { ...ev, [field]: value } : ev)
    }));
  };

  // 3. Event Image Upload
  const handleEventImageUpload = async (e, id) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const url = await uploadFile(file, "news_assets");
      setFormData(prev => ({
        ...prev,
        events: prev.events.map(ev => ev.id === id ? { ...ev, image: url } : ev)
      }));
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // 4. Add New Event
  const handleAddEvent = () => {
    const newEvent = {
      id: Date.now(), // Temp ID
      image: "https://placehold.co/600x400?text=New+Event",
      date: new Date().toDateString(),
      title: "New Event Title",
      description: "Enter event description here..."
    };
    setFormData(prev => ({
      ...prev,
      events: [newEvent, ...prev.events] // Add to top
    }));
  };

  // 5. Delete Event
  const handleDeleteEvent = (id) => {
    if (!window.confirm("Delete this event?")) return;
    setFormData(prev => ({
      ...prev,
      events: prev.events.filter(ev => ev.id !== id)
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateNewsData(formData);
      await fetchData(); // Refresh data
      setIsEditing(false);
      alert("News section updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to save.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-slate-50 py-12 px-4 md:px-8 relative group/section">
      
      {/* ADMIN CONTROLS */}
      {isAdmin && !isEditing && (
        <button 
          onClick={startEdit}
          className="absolute top-4 right-4 z-10 bg-blue-900 text-white p-2 rounded-full shadow-lg hover:scale-110 transition border-2 border-white"
          title="Edit Section"
        >
          <Edit size={20} />
        </button>
      )}

      {isEditing && (
        <div className="fixed bottom-10 right-10 z-50 flex gap-2 animate-bounce-in">
          <button onClick={cancelEdit} className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-full shadow-xl flex items-center gap-2 font-bold">
            <X size={18} /> Cancel
          </button>
          <button onClick={handleSave} disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 font-bold disabled:opacity-70">
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save
          </button>
        </div>
      )}

      <div className={`max-w-6xl mx-auto space-y-10 ${isEditing ? 'p-4 border-2 border-dashed border-blue-300 rounded-xl' : ''}`}>
        
        {/* --- Section Header --- */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-blue-900 flex items-center justify-center gap-3">
            <ImageIcon className="w-6 h-6 text-red-700" />
            {isEditing ? (
              <input 
                name="sectionTitle"
                value={content.sectionTitle}
                onChange={handleHeaderChange}
                className="text-center bg-transparent border-b border-blue-300 outline-none min-w-[200px]"
              />
            ) : (
              content.sectionTitle
            )}
          </h2>
          
          <div className="mt-2">
            {isEditing ? (
              <input 
                name="subtitle"
                value={content.subtitle}
                onChange={handleHeaderChange}
                className="text-center bg-transparent border-b border-gray-300 outline-none text-sm text-slate-500 w-full max-w-md"
              />
            ) : (
              <p className="text-slate-500 text-sm">{content.subtitle}</p>
            )}
          </div>
          
          <div className="h-1 w-16 bg-red-700 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* --- Event Gallery Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Add New Card (Only in Edit Mode) */}
          {isEditing && (
            <div 
              onClick={handleAddEvent}
              className="bg-blue-50 border-2 border-dashed border-blue-300 rounded-xl flex flex-col items-center justify-center h-full min-h-[350px] cursor-pointer hover:bg-blue-100 transition text-blue-600"
            >
              <Plus size={48} />
              <span className="font-bold mt-2">Add New Event</span>
            </div>
          )}

          {content.events.map((event) => (
            <div 
              key={event.id} 
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 group hover:shadow-lg transition-all duration-300 flex flex-col h-full relative"
            >
              {/* Delete Button (Edit Mode) */}
              {isEditing && (
                <button 
                  onClick={() => handleDeleteEvent(event.id)}
                  className="absolute top-2 right-2 z-30 bg-red-600 text-white p-1.5 rounded-full shadow-md hover:bg-red-700"
                  title="Delete Event"
                >
                  <Trash2 size={16} />
                </button>
              )}

              {/* Image Container */}
              <div className="relative h-48 overflow-hidden shrink-0 bg-gray-100 group/image">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                />
                
                {isEditing && <UploadOverlay onChange={(e) => handleEventImageUpload(e, event.id)} />}

                {/* Date Badge */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur px-3 py-1 rounded shadow text-xs font-bold text-blue-900 flex items-center gap-1.5 z-10">
                  <Calendar className="w-3 h-3 text-red-700" />
                  {isEditing ? (
                    <input 
                      value={event.date}
                      onChange={(e) => handleEventChange(event.id, 'date', e.target.value)}
                      className="bg-transparent border-b border-gray-300 outline-none w-20 text-xs"
                    />
                  ) : (
                    event.date
                  )}
                </div>
              </div>

              {/* Content Container */}
              <div className="p-5 space-y-3 flex flex-col grow">
                <div className="grow">
                  {isEditing ? (
                    <input 
                      value={event.title}
                      onChange={(e) => handleEventChange(event.id, 'title', e.target.value)}
                      className="text-lg font-bold text-blue-900 w-full border-b border-blue-200 outline-none mb-2"
                      placeholder="Event Title"
                    />
                  ) : (
                    <h3 className="text-lg font-bold text-blue-900 leading-tight group-hover:text-red-700 transition-colors">
                      {event.title}
                    </h3>
                  )}

                  {isEditing ? (
                    <textarea 
                      value={event.description}
                      onChange={(e) => handleEventChange(event.id, 'description', e.target.value)}
                      rows={3}
                      className="text-slate-600 text-sm w-full border border-gray-300 rounded p-1"
                      placeholder="Description..."
                    />
                  ) : (
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                      {event.description}
                    </p>
                  )}
                </div>
                
                {/* Read More Link */}
                <div className="pt-2 mt-auto">
                  <button className="text-red-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all">
                    View Details <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- View All Button (Static link) --- */}
        <div className="text-center pt-4">
            <button className="px-6 py-2 border-2 border-blue-900 text-blue-900 font-bold rounded-full hover:bg-blue-900 hover:text-white transition duration-300 text-sm">
                View All Events
            </button>
        </div>

      </div>
    </section>
  );
};

export default NewsGallery;