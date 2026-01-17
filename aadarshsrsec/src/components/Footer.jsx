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
  ExternalLink,
  Loader2 // Ensure Loader2 is imported
} from 'lucide-react';
// 1. IMPORT TOAST
import toast from 'react-hot-toast';

import { useAuth } from '../context/AuthContext';
import { getFooterData, updateFooterData } from '../services/content.service';

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
  const { currentUser, userRole } = useAuth();
  const isAdmin = currentUser && userRole === 'admin';

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(DEFAULTS);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFooterData();
        if (data) {
          setFormData(prev => ({ ...prev, ...data }));
        }
      } catch (error) {
        console.error("Error fetching footer:", error);
        // Silent fail for footer fetch is usually fine, or use toast.error if preferred
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    // TOAST: Loading
    const toastId = toast.loading("Saving footer...");
    
    try {
      await updateFooterData(formData);
      setIsEditing(false);
      // TOAST: Success
      toast.success("Footer updated successfully!", { id: toastId });
    } catch (error) {
      console.error(error);
      // TOAST: Error
      toast.error("Failed to update footer.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // Reusable Input Style for Dark Mode
  const inputClass = "w-full bg-slate-800 border border-slate-600 text-white rounded px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-slate-500";

  return (
    <footer className="bg-[#0f172a] text-slate-300 font-sans pt-16 pb-8 relative group border-t-4 border-blue-600 overflow-hidden">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

      {/* --- ADMIN EDIT BUTTON --- */}
      {isAdmin && !isEditing && (
        <button 
          onClick={() => setIsEditing(true)}
          className="absolute top-6 right-6 bg-blue-600 text-white p-2.5 rounded-full shadow-lg hover:bg-blue-500 transition z-50 transform hover:scale-110"
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
            className="bg-white text-slate-800 border border-slate-300 px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2 hover:bg-slate-50 font-bold transition-transform hover:scale-105"
          >
            <X size={18} /> Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={loading} 
            className="bg-green-600 text-white px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2 hover:bg-green-700 font-bold disabled:opacity-70 transition-transform hover:scale-105"
          >
            {loading ? <Loader2 className="animate-spin" size={18}/> : <Save size={18} />} 
            Save Changes
          </button>
        </div>
      )}

      <div className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${isEditing ? "ring-2 ring-blue-500/50 rounded-2xl p-8 bg-slate-800/50 backdrop-blur-sm" : ""}`}>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
          
          {/* COLUMN 1: BRAND & INFO (Span 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-4">
                <div className="bg-white p-2 rounded-lg shadow-md inline-block">
                   <img src={Logo} alt="Logo" className="h-14 w-auto object-contain" />
                </div>
                <div>
                    <h2 className="font-bold text-white text-lg tracking-tight leading-tight">ADARSH SENIOR SECONDARY<br/>PUBLIC SCHOOL</h2>
                    <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mt-1">Est. 1996 • Excellence in Education</p>
                </div>
            </div>

            {/* Editable Description */}
            {isEditing ? (
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className={inputClass}
              />
            ) : (
              <p className="text-sm leading-7 text-slate-400 text-justify pr-0 lg:pr-8 border-l-2 border-slate-700 pl-4">
                {formData.description}
              </p>
            )}

            {/* Social Icons */}
            <div className="flex gap-3 pt-2">
               {[Facebook, Instagram, Twitter, Youtube].map((Icon, idx) => (
                   <a key={idx} href="#" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 text-slate-400 transform hover:-translate-y-1">
                       <Icon size={16} />
                   </a>
               ))}
            </div>
          </div>

          {/* COLUMN 2: QUICK LINKS (Span 3) */}
          <div className="lg:col-span-3 lg:pl-8">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 border-b border-slate-700 pb-2 inline-block">
              Quick Links
            </h3>
            <ul className="space-y-3">
               {[
                   { name: "About Adarsh", path: "/about-adarsh" },
                   { name: "Principal's Desk", path: "/principal" },
                   { name: "School Activities", path: "/activities" },
                   { name: "Infrastructure", path: "/facilities" },
                   { name: "Admission Info", path: "/rules-regulations" },
                   { name: "Contact Us", path: "/contacts" },
               ].map((link, i) => (
                   <li key={i}>
                       <Link 
                         to={link.path} 
                         className="group flex items-center text-sm font-medium text-slate-400 hover:text-blue-400 transition-colors"
                       >
                         <ChevronRight size={14} className="mr-2 text-slate-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-transform" />
                         {link.name}
                       </Link>
                   </li>
               ))}
            </ul>
          </div>

          {/* COLUMN 3: CONTACT INFO (Span 4) */}
          <div className="lg:col-span-4 bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">Get In Touch</h3>
            <p className="text-[10px] text-green-400 font-bold mb-6 uppercase tracking-widest flex items-center gap-1">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Open • Mon-Sat (8:00 AM - 2:00 PM)
            </p>
            
            <div className="space-y-5 text-sm">
              {/* Address */}
              <div className="flex items-start gap-4">
                <MapPin className="shrink-0 text-blue-500 mt-1" size={18} />
                <div className="w-full">
                  {isEditing ? (
                    <div className="space-y-2">
                      <input name="addressLine1" value={formData.addressLine1} onChange={handleChange} className={inputClass} placeholder="Line 1" />
                      <input name="addressLine2" value={formData.addressLine2} onChange={handleChange} className={inputClass} placeholder="Line 2" />
                    </div>
                  ) : (
                    <span className="text-slate-300 leading-relaxed block">
                      {formData.addressLine1}{formData.addressLine2}
                    </span>
                  )}
                </div>
              </div>

              {/* Phones */}
              <div className="flex items-start gap-4">
                <Phone className="shrink-0 text-blue-500 mt-1" size={18} />
                <div className="w-full">
                   {isEditing ? (
                    <div className="grid grid-cols-2 gap-2">
                       <input name="phone1" value={formData.phone1} onChange={handleChange} className={inputClass} />
                       <input name="phone2" value={formData.phone2} onChange={handleChange} className={inputClass} />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1 text-slate-300">
                      <a href={`tel:${formData.phone1}`} className="hover:text-blue-400 transition">{formData.phone1}</a>
                      <a href={`tel:${formData.phone2}`} className="hover:text-blue-400 transition">{formData.phone2}</a>
                    </div>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <Mail className="shrink-0 text-blue-500 mt-1" size={18} />
                 {isEditing ? (
                    <input name="email" value={formData.email} onChange={handleChange} className={inputClass} />
                  ) : (
                    <a href={`mailto:${formData.email}`} className="text-slate-300 hover:text-blue-400 transition break-all">
                      {formData.email}
                    </a>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- BOTTOM BAR --- */}
      <div className="border-t border-slate-800  pt-4 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Adarsh Senior Secondary Public School. All Rights Reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link to="/rules-regulations" className="hover:text-slate-300 transition-colors">School Policies</Link>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-2">
                <span>Made in India</span>
                <img src={img1} alt="Flag" className="w-5 h-auto drop-shadow-lg wave-flag" />
                <style>{`.wave-flag { animation: wave 3s ease-in-out infinite; transform-origin: bottom left; } @keyframes wave { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(10deg); } 75% { transform: rotate(-5deg); } }`}</style>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;