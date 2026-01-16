import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Edit, 
  Save, 
  X, 
  Facebook, 
  Instagram, 
  Youtube, 
  Twitter, 
  MapPin, 
  Phone, 
  Mail,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
// 1. Import Auth Context
import { useAuth } from '../context/AuthContext';
// 2. Import Service Functions
import { getFooterData, updateFooterData } from '../services/content.service';

// Ensure these paths match your project
import Logo from '../assets/logo.jpg'; 
import img1 from "../assets/20-03-41-348_512.webp";

/* ---------------- DEFAULT DATA ---------------- */
const DEFAULTS = {
  description: "The school is co-educational, English-medium for classes Nursery to XII and is affiliated with C.B.S.E., New Delhi. Adarsh Senior Secondary Public School- Nahra in its true sense is a ray of hope for this rural belt of Haryana.",
  addressLine1: "Village - Nahra",
  addressLine2: ", Barara District Ambala(Hr)",
  phone1: "79882-12029",
  phone2: "9996985239",
  email: "info.adarshschool@gmail.com"
};

const Footer = () => {
  // 3. Strict Admin Check
  const { currentUser, userRole } = useAuth();
  const isAdmin = currentUser && userRole === 'admin';

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(DEFAULTS);

  // 4. Fetch Data on Mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFooterData();
        if (data) {
          setFormData(prev => ({ ...prev, ...data }));
        }
      } catch (error) {
        console.error("Error fetching footer:", error);
      }
    };
    fetchData();
  }, []);

  // Handle Text Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save Changes
  const handleSave = async () => {
    setLoading(true);
    try {
      await updateFooterData(formData);
      setIsEditing(false);
      alert("Footer updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update footer.");
    }
    setLoading(false);
  };

  return (
    <footer className="bg-[#991414] text-white font-sans pt-16 pb-8 relative group border-t-4 border-yellow-500 overflow-hidden">
      
      {/* Background Decor (Subtle Gradient) */}
      <div className="absolute inset-0 bg-linear-to-br from-black/20 to-transparent pointer-events-none"></div>

      {/* --- ADMIN EDIT BUTTON --- */}
      {isAdmin && !isEditing && (
        <button 
          onClick={() => setIsEditing(true)}
          className="absolute top-6 right-6 bg-white text-red-900 p-2.5 rounded-full shadow-lg hover:bg-gray-100 transition z-50 transform hover:scale-110"
          title="Edit Footer"
        >
          <Edit size={18} />
        </button>
      )}

      {/* --- SAVE/CANCEL CONTROLS --- */}
      {isEditing && (
        <div className="fixed bottom-10 right-10 z-50 flex gap-3 animate-bounce-in">
          <button 
            onClick={() => setIsEditing(false)} 
            className="bg-white text-gray-800 border border-gray-300 px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2 hover:bg-gray-100 font-bold transition-transform hover:scale-105"
          >
            <X size={18} /> Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={loading} 
            className="bg-green-600 text-white px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2 hover:bg-green-700 font-bold disabled:opacity-70 transition-transform hover:scale-105"
          >
            {loading ? "Saving..." : <><Save size={18} /> Save Changes</>}
          </button>
        </div>
      )}

      <div className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${isEditing ? "ring-4 ring-yellow-400/50 rounded-2xl p-8 bg-black/20 backdrop-blur-sm" : ""}`}>
        
        {/* --- Main Grid Content --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
          
          {/* Column 1: School Info (Span 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-4">
                <div className="bg-white p-2 rounded-lg shadow-md inline-block">
                <img src={Logo} alt="Logo" className="h-16 w-auto object-contain" />
                </div>
                <div>
                    <h2 className="font-bold text-xl tracking-tight leading-tight">ADARSH SENIOR SECONDARY<br/>PUBLIC SCHOOL</h2>
                    <p className="text-[10px] text-yellow-300 font-bold uppercase tracking-wider mt-1">Managed by Shaheed Bhagat Singh Education Society</p>
                </div>
            </div>

            {/* Editable Description */}
            {isEditing ? (
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="w-full p-4 text-gray-900 rounded-lg text-sm border-2 border-yellow-500 focus:outline-none shadow-inner"
              />
            ) : (
              <p className="text-sm leading-7 text-gray-200 text-justify pr-0 lg:pr-8">
                {formData.description}
              </p>
            )}

            {/* Social Icons */}
            <div className="flex gap-3 pt-2">
               {[Facebook, Instagram, Twitter, Youtube].map((Icon, idx) => (
                   <a key={idx} href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-yellow-500 hover:text-red-900 transition-all duration-300 transform hover:-translate-y-1">
                       <Icon size={18} />
                   </a>
               ))}
            </div>
          </div>

          {/* Column 2: Featured Links (Span 3) */}
          <div className="lg:col-span-3 lg:pl-8 border-l border-white/10">
            <h3 className="text-lg font-bold mb-6 text-yellow-400 tracking-wider flex items-center gap-2">
              QUICK LINKS
            </h3>
            <ul className="space-y-3">
               {[
                   { name: "About Adarsh", path: "/about-adarsh" },
                   { name: "Principal's Message", path: "/principal" },
                   { name: "School Activities", path: "/activities" },
                   { name: "Infrastructure", path: "/facilities" }, // Updated path
                   { name: "Admission Info", path: "/rules-regulations" },    // Updated path
                   { name: "Contact Us", path: "/contacts" },       // Updated path
               ].map((link, i) => (
                   <li key={i}>
                       <Link 
                         to={link.path} 
                         className="group flex items-center text-sm font-medium text-gray-200 hover:text-yellow-400 transition-colors"
                       >
                         <ChevronRight size={14} className="mr-2 text-yellow-500/50 group-hover:text-yellow-400 group-hover:translate-x-1 transition-transform" />
                         {link.name}
                       </Link>
                   </li>
               ))}
            </ul>
          </div>

          {/* Column 3: Contact Info (Span 4) */}
          <div className="lg:col-span-4 bg-black/20 rounded-xl p-6 border border-white/5">
            <h3 className="text-lg font-bold mb-2 tracking-wide text-white">GET IN TOUCH</h3>
            <p className="text-xs text-yellow-400/80 font-bold mb-6 uppercase tracking-widest flex items-center gap-1">
               <ExternalLink size={10} /> Affiliated to CBSE, New Delhi
            </p>
            
            <div className="space-y-5 text-sm">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0 text-yellow-400">
                    <MapPin size={16} />
                </div>
                <div className="w-full">
                  {isEditing ? (
                    <div className="space-y-2">
                      <input name="addressLine1" value={formData.addressLine1} onChange={handleChange} className="w-full p-2 text-black rounded text-xs" placeholder="Address Line 1" />
                      <input name="addressLine2" value={formData.addressLine2} onChange={handleChange} className="w-full p-2 text-black rounded text-xs" placeholder="Address Line 2" />
                    </div>
                  ) : (
                    <span className="text-gray-200 leading-relaxed block">
                      {formData.addressLine1}{formData.addressLine2}
                    </span>
                  )}
                </div>
              </div>

              {/* Phones */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0 text-yellow-400">
                    <Phone size={16} />
                </div>
                <div className="w-full">
                   {isEditing ? (
                    <div className="grid grid-cols-2 gap-2">
                       <input name="phone1" value={formData.phone1} onChange={handleChange} className="w-full p-2 text-black rounded text-xs" />
                       <input name="phone2" value={formData.phone2} onChange={handleChange} className="w-full p-2 text-black rounded text-xs" />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1 text-gray-200">
                      <a href={`tel:${formData.phone1}`} className="hover:text-yellow-400 transition">{formData.phone1}</a>
                      <a href={`tel:${formData.phone2}`} className="hover:text-yellow-400 transition">{formData.phone2}</a>
                    </div>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0 text-yellow-400">
                    <Mail size={16} />
                </div>
                 {isEditing ? (
                    <input name="email" value={formData.email} onChange={handleChange} className="w-full p-2 text-black rounded text-xs" />
                  ) : (
                    <a href={`mailto:${formData.email}`} className="text-gray-200 hover:text-yellow-400 transition break-all pt-1.5">
                      {formData.email}
                    </a>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Bottom Copyright Bar --- */}
      <div className="border-t border-white/10 pt-4 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <div>
            © {new Date().getFullYear()} Adarsh Senior Secondary Public School. All Rights Reserved.
          </div>
          <div className="flex items-center gap-2">
          
            <img src={img1} alt="Flag" className="w-6 h-auto drop-shadow-lg wave-flag" />
            <style>{`.wave-flag { animation: wave 3s ease-in-out infinite; transform-origin: bottom left; } @keyframes wave { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(10deg); } 75% { transform: rotate(-5deg); } }`}</style>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;