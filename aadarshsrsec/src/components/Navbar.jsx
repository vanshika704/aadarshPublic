import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Edit, Plus, Trash2, X, Save, Loader2 } from 'lucide-react'; // Changed Loader to Loader2
import toast from 'react-hot-toast'; // 1. IMPORT TOAST

import Logo from '../assets/logo.jpg';
import { useAuth } from '../context/AuthContext';

// --- IMPORT THE BACKEND SERVICE ---
import { updateActivitiesData, getActivitiesData } from '../services/content.service';

// --- Configuration ---
const BRAND_COLOR = "bg-red-700"; 
const ACCENT_COLOR = "text-red-700";

// Initial Static Data
const INITIAL_MENU_DATA = [
  {
    title: "Prologue",
    path: "/prologue",
    items: [
      { name: "About Adarsh", path: "/about-adarsh" },
      { name: "Meet Our Principal", path: "/principal" },
      { name: "Mission & Vision", path: "/mission-vision" },
      { name: "Affiliation", path: "/affiliation-info" },
    ]
  },
  { title: "Facilities", path: "/facilities", items: null },
  { title: "News & Events", path: "/news-events", items: null },
  {
    title: "Activities",
    path: "/activities",
    id: "activities-section",
    items: [
      { name: "Diwali Celebrations", path: "/activities/diwali" },
      { name: "Rakhi Celebrations", path: "/activities/rakhi" },
      { name: "Annual Sports Meet", path: "/activities/sports" },
      { name: "Annual Day", path: "/activities/annual-day" },
      { name: "Clean India Campaign", path: "/activities/clean-india" },
      { name: "Janmashtami", path: "/activities/janmashtami" },
      { name: "Dental Camp", path: "/activities/dental" },
      { name: "Excursions", path: "/activities/excursions" },
      { name: "Lab Activities", path: "/activities/lab" },
    ]
  },
  { title: "Rules", path: "/rules-regulations", items: null },
  {
    title: "Dossier",
    path: "/dossier",
    items: [
      { name: "Affiliation", path: "/Affiliation-Copy.pdf" },
      { name: "Society", path: "/Society.pdf" },
      { name: "Water & Health Certificate", path: "/Water-and-Health-Sanitation-certificate.pdf" },
      { name: "Fire Safety Certificate", path: "/Fire-Safety-Certificate.pdf" },
      { name: "Building Safety", path: "/Building-Safety.pdf" },
      { name: "NOC", path: "/NOC.pdf" },
      { name: "PTA Members List", path: "/PTA-members-list.pdf" },
      { name: "Recognition Certificate", path: "/Recognition-Certificate.pdf" },
      { name: "SMC", path: "/SMC.pdf" },
      { name: "Self Certification", path: "/Self-Certification.pdf" },
      { name: "Academic Calendar", path: "/Academic-calender.pdf" },
      { name: "Three Year Result", path: "/Three-year-result.pdf" },
    ]
  }
];

// --- Sub-Component: Top Utility Bar ---
const TopBar = ({ year }) => (
  <div className={`${BRAND_COLOR} text-white text-[10px] md:text-[11px] font-medium py-1 px-4 overflow-hidden relative`}>
    <style>{`
      @keyframes marquee {
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
      }
      .animate-marquee-text {
        animation: marquee 15s linear infinite;
        white-space: nowrap;
        display: inline-block;
      }
      .animate-marquee-text:hover {
        animation-play-state: paused;
      }
    `}</style>

    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-1 md:gap-0">
      <div className="flex gap-3 tracking-wide uppercase z-10 bg-red-700 md:bg-transparent pr-2">
        <a 
          href="/mandatory-public-disclosure_compressed.pdf"
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:underline hover:text-red-100 cursor-pointer flex items-center gap-1"
        >
          <span>Mandatory Disclosure</span>
          <svg className="w-3 h-3 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
        <span className="hidden md:inline text-white/50">|</span>
        <span className="hidden md:inline">Co-Ed English Medium</span>
      </div>

      <div className="flex items-center justify-end gap-3 w-full md:w-auto">
        <div className="relative overflow-hidden w-40 md:w-56 bg-red-800/30 rounded px-2 h-5 flex items-center">
           <div className="animate-marquee-text text-yellow-100 font-semibold tracking-wider">
             Admissions Open {year}
           </div>
        </div>

        <div className="flex items-center gap-2 z-10 bg-red-700 pl-2">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M20 10.999h2C22 5.869 18.127 2 12.99 2v2C17.052 4 20 6.943 20 10.999z"/><path d="M13 8c2.103 0 3 .897 3 3h2c0-3.225-1.775-5-5-5v2zm3.422 5.586a6.95 6.95 0 0 1-9.761-9.761L8.7 5.865a4.956 4.956 0 0 0 6.683 6.683l1.039 2.038zM2.004 9.497l2.253-2.152a1.002 1.002 0 0 1 1.436.061l2.425 2.81a1.002 1.002 0 0 1-.161 1.456l-1.306.94a12.183 12.183 0 0 0 5.688 5.688l.94-1.306a1.002 1.002 0 0 1 1.455-.16l2.81 2.425a1.002 1.002 0 0 1 .06 1.435l-2.151 2.253C14.787 23.473 1.547 10.217 2.004 9.497z"/></svg>
          <a href="tel:7988212029" className="whitespace-nowrap hover:text-red-200 transition-colors">
            79882-12029
          </a>
        </div>
      </div>
    </div>
  </div>
);

// --- Sub-Component: Activities Editor Modal ---
const ActivitiesEditor = ({ onClose, currentActivities, onSave }) => {
  // Initialize state directly from props (no useEffect needed here as we mount freshly)
  const [items, setItems] = useState(currentActivities || []);
  const [loading, setLoading] = useState(false);

  const handleChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleAdd = () => {
    setItems([...items, { name: "", path: "/activities/new-activity" }]);
  };

  const handleDelete = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleSaveClick = async () => {
    setLoading(true);
    await onSave(items);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-100 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="bg-red-700 p-4 flex justify-between items-center text-white">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Edit size={18} /> Edit Activities Menu
          </h3>
          <button onClick={onClose} className="hover:bg-red-800 p-1 rounded transition">
            <X size={20} />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex gap-3 items-center bg-gray-50 p-3 rounded-lg border border-gray-200 group">
                <span className="text-gray-400 font-mono text-xs w-6">{index + 1}</span>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input 
                    type="text" 
                    placeholder="Activity Name"
                    value={item.name}
                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-red-500"
                  />
                  <input 
                    type="text" 
                    placeholder="Link Path (e.g., /activities/xyz)"
                    value={item.path}
                    onChange={(e) => handleChange(index, 'path', e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:border-red-500"
                  />
                </div>
                <button 
                  onClick={() => handleDelete(index)}
                  className="text-gray-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors"
                  title="Remove Item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          
          <button 
            onClick={handleAdd}
            className="mt-4 flex items-center gap-2 text-sm font-semibold text-red-700 hover:text-red-900 hover:bg-red-50 px-4 py-2 rounded-lg border border-dashed border-red-300 w-full justify-center transition-all"
          >
            <Plus size={16} /> Add New Activity
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSaveClick}
            disabled={loading}
            className="px-6 py-2 text-sm font-medium text-white bg-red-700 hover:bg-red-800 rounded-lg shadow-md flex items-center gap-2 disabled:opacity-70 transition-all"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Navbar ---
function Navbar({ admissionYear = "2025-2026" }) {
  // 1. Auth & State
  const { currentUser, userRole } = useAuth();
  const isAdmin = currentUser && userRole === 'admin';

  const [menuItems, setMenuItems] = useState(INITIAL_MENU_DATA);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Edit Mode States
  const [isEditingActivities, setIsEditingActivities] = useState(false);
  
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- EFFECT: Load Activities from DB on mount ---
  useEffect(() => {
    const fetchNavData = async () => {
      try {
        const dbActivities = await getActivitiesData();
        
        if (dbActivities && Array.isArray(dbActivities)) {
          setMenuItems(prevMenu => {
            return prevMenu.map(item => {
              if (item.title === "Activities") {
                return { ...item, items: dbActivities };
              }
              return item;
            });
          });
        }
      } catch (error) {
          console.error("Failed to load navigation data", error);
      }
    };

    fetchNavData();
  }, []);

  // --- HANDLER: Save Updated Activities ---
  const handleSaveActivities = async (newActivitiesList) => {
    // TOAST: Loading
    const toastId = toast.loading("Updating Menu...");
    try {
        // 1. Update Backend
        await updateActivitiesData(newActivitiesList); 
        
        // 2. Update Local State
        const updatedMenu = menuItems.map(menu => {
            if (menu.title === "Activities") {
                return { ...menu, items: newActivitiesList };
            }
            return menu;
        });
        setMenuItems(updatedMenu);
        
        // TOAST: Success
        toast.success("Menu updated successfully!", { id: toastId });
    } catch (error) {
        console.error("Failed to update menu", error);
        // TOAST: Error
        toast.error("Failed to save changes.", { id: toastId });
    }
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="font-sans relative">
      <TopBar year={admissionYear} />
      
      {/* --- EDIT MODAL (Conditionally Rendered) --- */}
      {isEditingActivities && (
        <ActivitiesEditor 
          onClose={() => setIsEditingActivities(false)}
          currentActivities={menuItems.find(m => m.title === "Activities")?.items}
          onSave={handleSaveActivities}
        />
      )}

      <nav 
        className={`sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 transition-all duration-300 ${
          scrolled ? 'shadow-md py-0' : 'py-0.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12 md:h-14">
            
            {/* --- Logo Section --- */}
            <Link to="/" className="flex items-center gap-3 h-full py-1">
               <img 
                 src={Logo}
                 alt="School Logo" 
                 className="h-9 md:h-11 w-auto object-contain"
               />
            </Link>

            {/* --- Desktop Menu --- */}
            <div className="hidden md:flex gap-1 lg:gap-2 items-center h-full">
              <Link 
                to="/" 
                className={`px-2 lg:px-3 py-1 text-[13px] lg:text-sm font-semibold rounded-md transition-all duration-200 ${
                  isActive('/') ? `bg-red-50 ${ACCENT_COLOR}` : 'text-gray-600 hover:text-red-700 hover:bg-gray-50'
                }`}
              >
                Home
              </Link>

              {menuItems.map((menu, index) => {
                // RENDER SIMPLE LINKS
                if (!menu.items) {
                  return (
                    <Link
                      key={index}
                      to={menu.path}
                      className={`px-2 lg:px-3 py-1 text-[13px] lg:text-sm font-semibold rounded-md transition-all duration-200 whitespace-nowrap ${
                        isActive(menu.path) ? `bg-red-50 ${ACCENT_COLOR}` : 'text-gray-600 hover:text-red-700 hover:bg-gray-50'
                      }`}
                    >
                      {menu.title}
                    </Link>
                  );
                }

                // RENDER DROPDOWNS
                return (
                  <div key={index} className="group relative h-full flex items-center">
                    <button 
                      className={`flex items-center gap-0.5 px-2 lg:px-3 py-1 text-[13px] lg:text-sm font-semibold rounded-md transition-all duration-200 whitespace-nowrap
                        ${location.pathname.startsWith(menu.path) ? ACCENT_COLOR : 'text-gray-600 hover:text-red-700 hover:bg-gray-50'}`}
                    >
                      {menu.title}
                      <svg 
                        className="w-3 h-3 transition-transform duration-300 group-hover:-rotate-180 opacity-70" 
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* ADMIN EDIT TRIGGER */}
                    {isAdmin && menu.title === "Activities" && (
                        <button 
                            onClick={(e) => {
                                e.stopPropagation(); 
                                setIsEditingActivities(true);
                            }}
                            className="ml-1 p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="Edit Activities List"
                        >
                            <Edit size={12} />
                        </button>
                    )}

                    {/* Dropdown Menu */}
                    <div className="absolute left-0 top-full pt-0 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out transform translate-y-2 group-hover:translate-y-0 z-50">
                      <div className="bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden mt-1">
                        <div className={`h-1 w-full ${BRAND_COLOR}`}></div>
                        <div className="py-1">
                          {menu.items.map((item, idx) => {
                            const isPdf = item.path.endsWith('.pdf');
                            const itemClasses = `block px-4 py-2 text-sm transition-colors duration-200 border-l-2 border-transparent ${
                              isActive(item.path) 
                                ? `bg-red-50 ${ACCENT_COLOR} border-red-700 font-medium` 
                                : 'text-gray-600 hover:bg-gray-50 hover:text-red-700 hover:border-gray-200'
                            }`;

                            return isPdf ? (
                                <a key={idx} href={item.path} target="_blank" rel="noopener noreferrer" className={itemClasses}>
                                    {item.name}
                                </a>
                            ) : (
                                <Link key={idx} to={item.path} className={itemClasses}>
                                    {item.name}
                                </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              <Link 
                to="/contacts" 
                className={`px-2 lg:px-3 py-1 text-[13px] lg:text-sm font-semibold rounded-md transition-all duration-200 ${
                  isActive('/contacts') ? `bg-red-50 ${ACCENT_COLOR}` : 'text-gray-600 hover:text-red-700 hover:bg-gray-50'
                }`}
              >
                Contact
              </Link>
            </div>

            {/* --- Mobile Menu Button --- */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5 rounded-md text-gray-600 hover:text-red-700 hover:bg-red-50 transition-colors focus:outline-none"
              >
                {isMobileMenuOpen ? (
                   <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* --- Mobile Menu --- */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-t border-gray-100 ${
            isMobileMenuOpen ? 'max-h-[85vh] opacity-100 shadow-xl' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-4 py-4 space-y-4 overflow-y-auto h-full pb-20">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-sm font-semibold text-gray-800 hover:text-red-700 bg-gray-50 rounded-lg">
              Home
            </Link>
            
            {menuItems.map((menu, index) => {
                if (!menu.items) {
                   return (
                     <Link 
                       key={index} 
                       to={menu.path} 
                       onClick={() => setIsMobileMenuOpen(false)}
                       className={`block px-4 py-2 text-sm font-semibold text-gray-800 hover:text-red-700 bg-gray-50 rounded-lg ${isActive(menu.path) ? 'text-red-700' : ''}`}
                     >
                       {menu.title}
                     </Link>
                   );
                }

                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between px-4">
                        <div className={`text-xs font-bold ${ACCENT_COLOR} uppercase tracking-wider`}>
                          {menu.title}
                        </div>
                    </div>
                    
                    <div className="pl-4 space-y-1 border-l-2 border-red-100 ml-4">
                      {menu.items.map((item, idx) => {
                          const isPdf = item.path.endsWith('.pdf');
                          const mobileItemClasses = "block px-4 py-2 text-sm text-gray-600 hover:text-red-700 hover:bg-gray-50 rounded-r-md transition-colors";

                          return isPdf ? (
                             <a key={idx} href={item.path} target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)} className={mobileItemClasses}>
                                 {item.name}
                             </a>
                          ) : (
                             <Link key={idx} to={item.path} onClick={() => setIsMobileMenuOpen(false)} className={mobileItemClasses}>
                                 {item.name}
                             </Link>
                          );
                      })}
                    </div>
                  </div>
                );
            })}
            
             <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-sm font-semibold text-gray-800 hover:text-red-700 bg-gray-50 rounded-lg">
              Contact Us
            </Link>

            <button className={`w-full ${BRAND_COLOR} text-white py-2.5 rounded-lg text-sm font-semibold shadow-md`}>
              Enquire For Admission
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;