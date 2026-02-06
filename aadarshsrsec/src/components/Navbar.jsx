import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Edit, Plus, Trash2, X, Save, Loader2, FileUp } from 'lucide-react';
import toast from 'react-hot-toast';

import Logo from '../assets/logo.jpg';
import { useAuth } from '../context/AuthContext';

// --- IMPORT THE BACKEND SERVICE ---
import { 
  updateActivitiesData, 
  getActivitiesData, 
  getDossierData, 
  updateDossierData, 
  uploadFile 
} from '../services/content.service';

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
  const [items, setItems] = useState(currentActivities || []);
  const [loading, setLoading] = useState(false);

  const handleChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSaveClick = async () => {
    setLoading(true);
    await onSave(items);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        <div className="bg-red-700 p-4 flex justify-between items-center text-white">
          <h3 className="font-bold text-lg flex items-center gap-2"><Edit size={18} /> Edit Activities Menu</h3>
          <button onClick={onClose} className="hover:bg-red-800 p-1 rounded transition"><X size={20} /></button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex gap-3 items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
              <input 
                type="text" 
                placeholder="Name"
                value={item.name}
                onChange={(e) => handleChange(index, 'name', e.target.value)}
                className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm"
              />
              <input 
                type="text" 
                placeholder="Path"
                value={item.path}
                onChange={(e) => handleChange(index, 'path', e.target.value)}
                className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm"
              />
              <button onClick={() => setItems(items.filter((_, i) => i !== index))} className="text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
            </div>
          ))}
          <button onClick={() => setItems([...items, { name: "", path: "" }])} className="w-full border-2 border-dashed py-2 text-red-700 font-semibold">+ Add Activity</button>
        </div>
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm">Cancel</button>
          <button onClick={handleSaveClick} disabled={loading} className="px-6 py-2 bg-red-700 text-white rounded-lg flex items-center gap-2">
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Sub-Component: Dossier Editor Modal ---
const DossierEditor = ({ onClose, currentItems, onSave }) => {
  const [items, setItems] = useState(currentItems || []);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (index, file) => {
    if (!file) return;
    const toastId = toast.loading(`Uploading ${file.name}...`);
    try {
      const url = await uploadFile(file, "dossier_docs");
      const newItems = [...items];
      newItems[index] = { ...newItems[index], path: url };
      setItems(newItems);
      toast.success("File uploaded!", { id: toastId });
    } catch (error) {
      toast.error("Upload failed", { id: toastId },error);
    }
  };

  const handleChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
        <div className="bg-red-700 p-4 flex justify-between items-center text-white">
          <h3 className="font-bold text-lg flex items-center gap-2"><FileUp size={18} /> Manage Dossier (Documents)</h3>
          <button onClick={onClose} className="hover:bg-red-800 p-1 rounded transition"><X size={20} /></button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <input 
                className="flex-1 border rounded px-3 py-1.5 text-sm"
                value={item.name}
                onChange={(e) => handleChange(index, 'name', e.target.value)}
                placeholder="Document Label (e.g. Fire Safety Certificate)"
              />
              <div className="flex-1 flex gap-2 items-center">
                <input 
                  className="flex-1 border rounded px-3 py-1.5 text-xs bg-white text-gray-400 overflow-hidden text-ellipsis"
                  value={item.path}
                  readOnly
                  placeholder="No file uploaded"
                />
                <label className="cursor-pointer bg-red-50 text-red-700 hover:bg-red-100 px-3 py-1.5 rounded text-xs font-bold transition">
                  {item.path ? 'REPLACE' : 'UPLOAD'}
                  <input type="file" className="hidden" accept=".pdf" onChange={(e) => handleFileChange(index, e.target.files[0])} />
                </label>
              </div>
              <button onClick={() => setItems(items.filter((_, i) => i !== index))} className="text-red-500 p-2"><Trash2 size={16} /></button>
            </div>
          ))}
          <button onClick={() => setItems([...items, { name: "", path: "" }])} className="w-full border-2 border-dashed border-red-200 py-3 text-red-700 font-bold hover:bg-red-50 rounded-lg transition-all">+ Add New Document Row</button>
        </div>
        <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
          <button 
            onClick={async () => { setLoading(true); await onSave(items); setLoading(false); onClose(); }}
            disabled={loading}
            className="px-6 py-2 bg-red-700 text-white rounded-lg text-sm font-bold flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save Dossier
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Navbar ---
function Navbar({ admissionYear = "2025-2026" }) {
  const { currentUser, userRole } = useAuth();
  const isAdmin = currentUser && userRole === 'admin';

  const [menuItems, setMenuItems] = useState(INITIAL_MENU_DATA);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const [isEditingActivities, setIsEditingActivities] = useState(false);
  const [isEditingDossier, setIsEditingDossier] = useState(false);
  
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Load Data from DB ---
  useEffect(() => {
    const fetchNavData = async () => {
      try {
        const [dbActivities, dbDossier] = await Promise.all([
          getActivitiesData(),
          getDossierData()
        ]);
        
        setMenuItems(prevMenu => {
          return prevMenu.map(item => {
            if (item.title === "Activities" && dbActivities) {
              return { ...item, items: dbActivities };
            }
            if (item.title === "Dossier" && dbDossier) {
              return { ...item, items: dbDossier };
            }
            return item;
          });
        });
      } catch (error) {
        console.error("Failed to load navigation data", error);
      }
    };
    fetchNavData();
  }, []);

  const handleSaveActivities = async (newActivitiesList) => {
    const toastId = toast.loading("Updating Activities...");
    try {
        await updateActivitiesData(newActivitiesList); 
        setMenuItems(prev => prev.map(m => m.title === "Activities" ? { ...m, items: newActivitiesList } : m));
        toast.success("Activities updated!", { id: toastId });
    } catch (error) {
        toast.error("Failed to save.", { id: toastId },error);
    }
  };

  const handleSaveDossier = async (newList) => {
    const toastId = toast.loading("Updating Dossier...");
    try {
      await updateDossierData(newList);
      setMenuItems(prev => prev.map(m => m.title === "Dossier" ? { ...m, items: newList } : m));
      toast.success("Dossier updated successfully!", { id: toastId });
    } catch (err) {
      toast.error("Failed to update Dossier.", { id: toastId },err);
    }
  };

  const isActive = (path) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  return (
    <div className="font-sans relative">
      <TopBar year={admissionYear} />
      
      {isEditingActivities && (
        <ActivitiesEditor 
          onClose={() => setIsEditingActivities(false)}
          currentActivities={menuItems.find(m => m.title === "Activities")?.items}
          onSave={handleSaveActivities}
        />
      )}

      {isEditingDossier && (
        <DossierEditor 
          onClose={() => setIsEditingDossier(false)}
          currentItems={menuItems.find(m => m.title === "Dossier")?.items}
          onSave={handleSaveDossier}
        />
      )}

      <nav className={`sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 transition-all ${scrolled ? 'shadow-md' : 'py-1'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            
            <Link to="/" className="flex items-center gap-3"><img src={Logo} alt="Logo" className="h-10 w-auto object-contain"/></Link>

            <div className="hidden md:flex gap-1 lg:gap-2 items-center h-full">
              <Link to="/" className={`px-3 py-1 text-sm font-semibold rounded-md ${isActive('/') ? `bg-red-50 ${ACCENT_COLOR}` : 'text-gray-600 hover:text-red-700'}`}>Home</Link>

              {menuItems.map((menu, index) => {
                if (!menu.items) {
                  return <Link key={index} to={menu.path} className={`px-3 py-1 text-sm font-semibold rounded-md ${isActive(menu.path) ? `bg-red-50 ${ACCENT_COLOR}` : 'text-gray-600 hover:text-red-700'}`}>{menu.title}</Link>;
                }

                return (
                  <div key={index} className="group relative h-full flex items-center">
                    <button className={`flex items-center gap-1 px-3 py-1 text-sm font-semibold rounded-md ${location.pathname.startsWith(menu.path) ? ACCENT_COLOR : 'text-gray-600 hover:text-red-700'}`}>
                      {menu.title}
                      <svg className="w-3 h-3 group-hover:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                    </button>

                    {isAdmin && (menu.title === "Activities" || menu.title === "Dossier") && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); menu.title === "Activities" ? setIsEditingActivities(true) : setIsEditingDossier(true); }}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit size={12} />
                        </button>
                    )}

                    <div className="absolute left-0 top-full w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 z-50">
                      <div className="bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden mt-1">
                        <div className={`h-1 w-full ${BRAND_COLOR}`}></div>
                        <div className="py-1">
                          {menu.items.map((item, idx) => {
                            const isPdf = item.path.toLowerCase().endsWith('.pdf') || item.path.includes('firebasestorage');
                            return isPdf ? (
                              <a key={idx} href={item.path} target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-700">{item.name}</a>
                            ) : (
                              <Link key={idx} to={item.path} className="block px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-700">{item.name}</Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <Link to="/contacts" className="px-3 py-1 text-sm font-semibold text-gray-600 hover:text-red-700">Contact</Link>
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600">{isMobileMenuOpen ? <X size={24}/> : <Edit size={24}/>}</button>
            </div>
          </div>
        </div>

        {/* --- Mobile Menu --- */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 bg-white ${isMobileMenuOpen ? 'max-h-[85vh] shadow-xl border-t' : 'max-h-0'}`}>
          <div className="px-4 py-4 space-y-4">
            {menuItems.map((menu, index) => (
              <div key={index} className="space-y-1">
                <div className={`text-xs font-bold ${ACCENT_COLOR} uppercase px-4`}>{menu.title}</div>
                <div className="pl-6 border-l-2 border-red-50 space-y-1">
                  {menu.items?.map((item, idx) => (
                    <Link key={idx} to={item.path} onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm text-gray-600">{item.name}</Link>
                  ))}
                  {!menu.items && <Link to={menu.path} onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm text-gray-800 font-bold">{menu.title}</Link>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;