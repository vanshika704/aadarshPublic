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
  Mail 
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

  const footerBg = "bg-[#991414FF]"; 

  return (
    <footer className={`${footerBg} text-white font-sans pt-12 pb-6 relative group border-t-4 border-yellow-500`}>
      
      {/* --- ADMIN EDIT BUTTON --- */}
      {isAdmin && !isEditing && (
        <button 
          onClick={() => setIsEditing(true)}
          className="absolute top-4 right-4 bg-white text-red-900 p-2 rounded-full shadow-lg hover:bg-gray-100 transition z-50 transform hover:scale-110"
          title="Edit Footer"
        >
          <Edit size={18} />
        </button>
      )}

      {/* --- SAVE/CANCEL CONTROLS --- */}
      {isEditing && (
        <div className="fixed bottom-10 right-10 z-50 flex gap-2 animate-bounce-in">
          <button 
            onClick={() => setIsEditing(false)} 
            className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-full shadow-xl flex items-center gap-2 hover:bg-gray-50 font-bold"
          >
            <X size={18} /> Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={loading} 
            className="bg-green-600 text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 hover:bg-green-700 font-bold disabled:opacity-70"
          >
            {loading ? "Saving..." : <><Save size={18} /> Save Changes</>}
          </button>
        </div>
      )}

      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${isEditing ? "ring-2 ring-yellow-400 rounded-xl p-6 bg-red-900/50" : ""}`}>
        
        {/* --- Main Grid Content --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 mb-10">
          
          {/* Column 1: School Info */}
          <div className="space-y-6">
            <div className="bg-white p-3 inline-block rounded-md shadow-sm max-w-[280px]">
              <img src={Logo} alt="Logo" className="h-16 w-auto object-contain" />
            </div>
            
            <p className="text-[10px] font-bold uppercase tracking-widest text-red-200">
              (Managed by Shaheed Bhagat Singh Education Society)
            </p>

            {/* Editable Description */}
            {isEditing ? (
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="w-full p-3 text-gray-900 rounded-md text-sm border-2 border-yellow-500 focus:outline-none"
              />
            ) : (
              <p className="text-sm leading-relaxed text-gray-100 text-justify">
                {formData.description}
              </p>
            )}

            {/* Social Icons */}
            <div className="flex gap-4 pt-2">
               <a href="#" className="hover:text-yellow-400 transition-colors"><Facebook size={20} /></a>
               <a href="#" className="hover:text-yellow-400 transition-colors"><Instagram size={20} /></a>
               <a href="#" className="hover:text-yellow-400 transition-colors"><Twitter size={20} /></a>
               <a href="#" className="hover:text-yellow-400 transition-colors"><Youtube size={20} /></a>
            </div>
          </div>

          {/* Column 2: Featured Links */}
          <div className="md:pl-10">
            <h3 className="text-lg font-bold mb-6 border-b-2 border-yellow-500 pb-2 inline-block pr-12 tracking-wide">
              QUICK LINKS
            </h3>
            <ul className="space-y-3 text-sm font-medium text-gray-200">
              <li><Link to="/about-adarsh" className="hover:translate-x-2 hover:text-yellow-400 transition-all inline-block">About Us</Link></li>
              <li><Link to="/mission-vision" className="hover:translate-x-2 hover:text-yellow-400 transition-all inline-block">Mission & Vision</Link></li>
              <li><Link to="/activities" className="hover:translate-x-2 hover:text-yellow-400 transition-all inline-block">News & Events</Link></li>
              <li><Link to="/leadership" className="hover:translate-x-2 hover:text-yellow-400 transition-all inline-block">Principal's Message</Link></li>
              <li><Link to="/infrastructure" className="hover:translate-x-2 hover:text-yellow-400 transition-all inline-block">Infrastructure</Link></li>
              <li><Link to="/dossier/society" className="hover:translate-x-2 hover:text-yellow-400 transition-all inline-block">School Policies</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact Info (Editable) */}
          <div>
            <h3 className="text-lg font-bold mb-2 tracking-wide">ADARSH SEN. SEC. SCHOOL</h3>
            <p className="text-xs text-yellow-400 font-semibold mb-8 tracking-widest uppercase">
              Affiliated to CBSE, New Delhi
            </p>
            
            <div className="space-y-5 text-sm">
              {/* Address */}
              <div className="flex items-start gap-4 group/item">
                <MapPin className="shrink-0 text-yellow-500 mt-0.5 group-hover/item:animate-bounce" size={18} />
                <div className="w-full">
                  {isEditing ? (
                    <div className="space-y-2">
                      <input name="addressLine1" value={formData.addressLine1} onChange={handleChange} className="w-full p-2 text-black rounded text-xs" placeholder="Address Line 1" />
                      <input name="addressLine2" value={formData.addressLine2} onChange={handleChange} className="w-full p-2 text-black rounded text-xs" placeholder="Address Line 2" />
                    </div>
                  ) : (
                    <span className="text-gray-100 leading-relaxed block">
                      {formData.addressLine1}{formData.addressLine2}
                    </span>
                  )}
                </div>
              </div>

              {/* Phones */}
              <div className="flex items-start gap-4">
                <Phone className="shrink-0 text-yellow-500 mt-0.5" size={18} />
                <div className="w-full">
                   {isEditing ? (
                    <div className="grid grid-cols-2 gap-2">
                       <input name="phone1" value={formData.phone1} onChange={handleChange} className="w-full p-2 text-black rounded text-xs" />
                       <input name="phone2" value={formData.phone2} onChange={handleChange} className="w-full p-2 text-black rounded text-xs" />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <a href={`tel:${formData.phone1}`} className="hover:text-yellow-400 transition">{formData.phone1}</a>
                      <a href={`tel:${formData.phone2}`} className="hover:text-yellow-400 transition">{formData.phone2}</a>
                    </div>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <Mail className="shrink-0 text-yellow-500 mt-0.5" size={18} />
                 {isEditing ? (
                    <input name="email" value={formData.email} onChange={handleChange} className="w-full p-2 text-black rounded text-xs" />
                  ) : (
                    <a href={`mailto:${formData.email}`} className="hover:text-yellow-400 transition text-gray-100 break-all">
                      {formData.email}
                    </a>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Bottom Copyright Bar --- */}
      <div className="border-t border-white/10 pt-6 mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-300">
          <div>
            © {new Date().getFullYear()} Adarsh Senior Secondary Public School. All Rights Reserved.
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden md:inline">Proudly Indian</span>
            <img src={img1} alt="Flag" className="w-6 h-auto drop-shadow-lg wave-flag" />
            <style>{`.wave-flag { animation: wave 3s ease-in-out infinite; transform-origin: bottom left; } @keyframes wave { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(10deg); } 75% { transform: rotate(-5deg); } }`}</style>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;