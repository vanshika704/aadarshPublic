import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { 
  Calendar, 
  CheckCircle2, 
  LogOut, 
  Wallet, 
  Bus, 
  AlertTriangle,
  Clock,
  FileText,
  Loader2,
  Edit,
  Save,
  X
} from 'lucide-react';
// 1. Auth & Service
import { useAuth } from '../context/AuthContext';
import { getRulesData, updateRulesData } from '../services/content.service';

// --- Icon Mapping Helper ---
const iconMap = {
  Calendar: Calendar,
  CheckCircle2: CheckCircle2,
  LogOut: LogOut,
  Wallet: Wallet,
  Bus: Bus,
  AlertTriangle: AlertTriangle,
  Clock: Clock,
  FileText: FileText
};

// --- Updated Data based on your text ---
const FALLBACK_DATA = {
  hero: {
    title: "Admission Rules & Regulations",
    subtitle: "Guidelines for Admission, Withdrawal, and Administrative Procedures."
  },
  admission: {
    title: "Admission Schedule & Eligibility",
    schedule: [
      { id: 1, label: "Registration Starts", value: "1st February (Every Year)", highlight: false },
      { id: 2, label: "New Session Starts", value: "1st April (All Classes incl. IX & XI)", highlight: false }
    ],
    eligibility: [
      { id: 1, label: "Nursery Class", value: "Candidate should be 3+ years of age." },
      { id: 2, label: "Class I & Onwards", value: "Admission based on Entrance Tests & Interviews." }
    ],
    steps: [
      { id: 1, step: "01", title: "Registration", desc: "Eligible candidates must register for the Entrance Test as per the schedule." },
      { id: 2, step: "02", title: "Test & Interview", desc: "Appear for the Entrance Test followed by an Interview on the scheduled date." },
      { id: 3, step: "03", title: "Admission Offer", desc: "Based on performance and seat availability, admission will be offered." }
    ]
  },
  withdrawal: {
    title: "Withdrawal & Refund Rules",
    description: "Parents can withdraw their child by submitting an application 15 days in advance. The School Leaving Certificate will be issued 7 days after the date of submission.",
    refundTable: [
      { id: 1, period: "Within 1st Month", refund: "Full Refund (Building fund & Annual dues)", type: "success" },
      { id: 2, period: "Within 2 Months", refund: "50% Refund (Building fund & Annual dues)", type: "info" },
      { id: 3, period: "After 2 Months", refund: "No Refund (Except Security Deposit)", type: "danger" }
    ]
  },
  dues: {
    title: "Facility Discontinuance Dues",
    cards: [
      {
        id: 1,
        icon: "Wallet",
        title: "Boarding to Day Scholar",
        desc: "If a boarder wants to become a day scholar, he/she is required to pay full charges of a regular hostler for the remaining part of that session.",
        theme: "blue"
      },
      {
        id: 2,
        icon: "Bus",
        title: "Transport Withdrawal",
        desc: "Stopping conveyance mid-session requires payment of conveyance charges for the complete session.",
        theme: "blue"
      },
      {
        id: 3,
        icon: "AlertTriangle",
        title: "Disciplinary Action",
        desc: "Expulsion from hostel/vehicle due to indiscipline does not waive fees. The student must pay charges for the remaining period.",
        theme: "red"
      }
    ]
  },
  administrative: {
    title: "Administrative Notes",
    notes: [
      { id: 1, title: "Security Deposit Claim", desc: "Must be claimed within one year of leaving the school, otherwise it shall be adjusted to society funds." },
      { id: 2, title: "Document Attestation", desc: "Verified/attested documents will be delivered 3 days after the date of submission." },
      { id: 3, title: "Document Preparation", desc: "Any new document prepared by school authorities will be delivered 7 days after request." }
    ]
  }
};

const FadeIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
);

export default function RulesRegulations() {
  const { currentUser, userRole } = useAuth();
  const isAdmin = currentUser && userRole === 'admin';

  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Fetch Data
  const fetchData = async () => {
    try {
      const data = await getRulesData();
      
      // DEEP MERGE LOGIC to prevent undefined errors
      const mergedData = {
          hero: { ...FALLBACK_DATA.hero, ...(data?.hero || {}) },
          admission: { 
              ...FALLBACK_DATA.admission, 
              ...(data?.admission || {}),
              schedule: (data?.admission?.schedule?.length) ? data.admission.schedule : FALLBACK_DATA.admission.schedule,
              eligibility: (data?.admission?.eligibility?.length) ? data.admission.eligibility : FALLBACK_DATA.admission.eligibility,
              steps: (data?.admission?.steps?.length) ? data.admission.steps : FALLBACK_DATA.admission.steps,
          },
          withdrawal: { 
              ...FALLBACK_DATA.withdrawal, 
              ...(data?.withdrawal || {}),
              refundTable: (data?.withdrawal?.refundTable?.length) ? data.withdrawal.refundTable : FALLBACK_DATA.withdrawal.refundTable
          },
          dues: { 
              ...FALLBACK_DATA.dues, 
              ...(data?.dues || {}),
              cards: (data?.dues?.cards?.length) ? data.dues.cards : FALLBACK_DATA.dues.cards
          },
          administrative: { 
              ...FALLBACK_DATA.administrative, 
              ...(data?.administrative || {}),
              notes: (data?.administrative?.notes?.length) ? data.administrative.notes : FALLBACK_DATA.administrative.notes
          }
      };

      setPageData(mergedData);
    } catch (error) {
      console.error("Failed to fetch data", error);
      setPageData(FALLBACK_DATA);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* --- HANDLERS --- */

  // 1. Generic Array Update Helper
  const handleArrayChange = (section, arrayName, index, field, value) => {
    setPageData(prev => {
      const newState = { ...prev };
      const newArray = [...newState[section][arrayName]];
      newArray[index] = { ...newArray[index], [field]: value };
      newState[section] = { ...newState[section], [arrayName]: newArray };
      return newState;
    });
  };

  // 2. Generic Text Update
  const handleTextChange = (section, field, value) => {
    setPageData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      await updateRulesData(pageData);
      setIsEditing(false);
      alert("Rules page updated!");
    } catch (error) {
      console.error(error);
      alert("Failed to save.");
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-blue-900">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  if (!pageData) return null;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 relative group/page">
      
      {/* ADMIN CONTROLS */}
      {isAdmin && !isEditing && (
        <button 
          onClick={() => setIsEditing(true)}
          className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition hover:scale-110"
          title="Edit Page"
        >
          <Edit size={24} />
        </button>
      )}

      {isEditing && (
        <div className="fixed bottom-6 right-6 z-50 flex gap-2 animate-bounce-in">
          <button onClick={() => setIsEditing(false)} className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-full shadow-xl flex items-center gap-2 font-bold">
            <X size={18} /> Cancel
          </button>
          <button onClick={handleSave} disabled={saveLoading} className="bg-green-600 text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 font-bold disabled:opacity-70">
            {saveLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save
          </button>
        </div>
      )}

      {/* HEADER */}
      <div className="flex items-center justify-center text-center gap-3 mb-2 mt-8">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 px-4">
            {isEditing ? (
                <input 
                    value={pageData.hero.title}
                    onChange={(e) => handleTextChange('hero', 'title', e.target.value)}
                    className="text-center bg-transparent border-b-2 border-blue-200 outline-none w-full"
                />
            ) : (
                pageData.hero.title
            )}
          </h2>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">

        {/* --- Section 1: Admission --- */}
        <section>
          <FadeIn>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-1 bg-red-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-slate-900">{pageData.admission.title}</h2>
            </div>
          </FadeIn>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left: Text Content */}
            <div className="space-y-8">
              <FadeIn delay={0.1}>
                <h3 className="flex items-center gap-2 text-xl font-bold text-blue-900 mb-3">
                  <Calendar className="text-red-600" size={20}/> Schedule
                </h3>
                <div className="pl-7 border-l border-slate-200 space-y-2">
                  {pageData.admission.schedule.map((item, idx) => (
                    <p key={item.id} className="text-slate-600 flex gap-2">
                      {isEditing ? (
                        <>
                            <input value={item.label} onChange={(e) => handleArrayChange('admission', 'schedule', idx, 'label', e.target.value)} className="border-b w-1/2 text-sm font-bold" />
                            :
                            <input value={item.value} onChange={(e) => handleArrayChange('admission', 'schedule', idx, 'value', e.target.value)} className="border-b w-1/2 text-sm" />
                        </>
                      ) : (
                        <>
                            {item.label}: <strong className="text-slate-900">{item.value}</strong>
                        </>
                      )}
                    </p>
                  ))}
                </div>
              </FadeIn>

              <FadeIn delay={0.2}>
                <h3 className="flex items-center gap-2 text-xl font-bold text-blue-900 mb-3">
                  <CheckCircle2 className="text-red-600" size={20}/> Eligibility
                </h3>
                <div className="pl-7 border-l border-slate-200 space-y-2">
                  {pageData.admission.eligibility.map((item, idx) => (
                      <p key={item.id} className="text-slate-600 flex gap-2 flex-wrap">
                        {isEditing ? (
                            <>
                                <input value={item.label} onChange={(e) => handleArrayChange('admission', 'eligibility', idx, 'label', e.target.value)} className="border-b w-1/3 text-sm font-bold" />
                                :
                                <input value={item.value} onChange={(e) => handleArrayChange('admission', 'eligibility', idx, 'value', e.target.value)} className="border-b w-full text-sm" />
                            </>
                        ) : (
                            <>
                                <strong className="text-slate-900">{item.label}:</strong> {item.value}
                            </>
                        )}
                      </p>
                  ))}
                </div>
              </FadeIn>
            </div>

            {/* Right: Timeline */}
            <div className="relative">
              <FadeIn delay={0.3}>
                  <div className="space-y-0 relative">
                    <div className="absolute left-4 top-2 bottom-4 w-0.5 bg-slate-200"></div>
                    {pageData.admission.steps.map((item, idx) => (
                      <div key={item.id} className="relative flex gap-6 pb-8 last:pb-0 group">
                          <div className="relative z-10 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-red-600 transition-colors duration-300 ring-4 ring-white">
                            {item.step}
                          </div>
                          <div className="pt-1 w-full">
                            {isEditing ? (
                                <>
                                    <input value={item.title} onChange={(e) => handleArrayChange('admission', 'steps', idx, 'title', e.target.value)} className="font-bold text-slate-900 mb-1 w-full border-b outline-none" />
                                    <textarea value={item.desc} onChange={(e) => handleArrayChange('admission', 'steps', idx, 'desc', e.target.value)} className="text-sm text-slate-500 w-full border rounded p-1" rows={2} />
                                </>
                            ) : (
                                <>
                                    <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                                </>
                            )}
                          </div>
                      </div>
                    ))}
                  </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* --- Section 2: Withdrawal --- */}
        <section>
          <FadeIn>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-1 bg-red-600 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">{pageData.withdrawal.title}</h2>
            </div>
            
            {isEditing ? (
                <textarea 
                    value={pageData.withdrawal.description}
                    onChange={(e) => handleTextChange('withdrawal', 'description', e.target.value)}
                    className="text-slate-600 text-lg mb-8 w-full p-2 border rounded"
                    rows={3}
                />
            ) : (
                <p className="text-slate-600 text-lg mb-8 max-w-3xl">
                    {pageData.withdrawal.description}
                </p>
            )}
          </FadeIn>

          {/* Dynamic Table */}
          <FadeIn delay={0.2}>
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100">
              <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
                <span className="font-bold tracking-wide uppercase text-sm">Refund of Dues Policy</span>
                <LogOut size={18} className="text-red-400"/>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="p-4 md:p-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Time of Withdrawal</th>
                      <th className="p-4 md:p-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Refund Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pageData.withdrawal.refundTable.map((row, idx) => (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 md:p-6 font-medium text-slate-900">
                            {isEditing ? (
                                <input value={row.period} onChange={(e) => handleArrayChange('withdrawal', 'refundTable', idx, 'period', e.target.value)} className="border-b w-full" />
                            ) : row.period}
                        </td>
                        <td className={`p-4 md:p-6 font-bold flex items-center gap-2 ${
                            row.type === 'success' ? 'text-green-700' : 
                            row.type === 'info' ? 'text-blue-700' : 'text-red-600'
                        }`}>
                          <CheckCircle2 size={16}/> 
                          {isEditing ? (
                                <input value={row.refund} onChange={(e) => handleArrayChange('withdrawal', 'refundTable', idx, 'refund', e.target.value)} className="border-b w-full bg-transparent" />
                            ) : row.refund}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* --- Section 3: Dues & Facilities --- */}
        <section>
          <FadeIn>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-1 bg-red-600 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">{pageData.dues.title}</h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {pageData.dues.cards.map((card, idx) => {
              const IconComponent = iconMap[card.icon] || AlertTriangle; 
              const isRed = card.theme === 'red';
              
              return (
                <FadeIn key={card.id} delay={0.1 * (idx + 1)}>
                  <div className={`
                    p-6 rounded-xl border-t-4 h-full hover:shadow-lg transition-shadow
                    ${isRed ? 'bg-red-50 border-red-600' : 'bg-slate-50 border-blue-600'}
                  `}>
                    <IconComponent className={`mb-4 ${isRed ? 'text-red-600' : 'text-blue-600'}`} size={32}/>
                    {isEditing ? (
                        <>
                            <input 
                                value={card.title} 
                                onChange={(e) => handleArrayChange('dues', 'cards', idx, 'title', e.target.value)} 
                                className={`font-bold text-lg mb-2 w-full bg-transparent border-b ${isRed ? 'text-red-900 border-red-200' : 'text-slate-900 border-blue-200'}`} 
                            />
                            <textarea 
                                value={card.desc} 
                                onChange={(e) => handleArrayChange('dues', 'cards', idx, 'desc', e.target.value)} 
                                className={`text-sm leading-relaxed w-full bg-transparent border rounded p-1 ${isRed ? 'text-red-800/80 border-red-200' : 'text-slate-600 border-blue-200'}`} 
                                rows={4}
                            />
                        </>
                    ) : (
                        <>
                            <h3 className={`font-bold text-lg mb-2 ${isRed ? 'text-red-900' : 'text-slate-900'}`}>{card.title}</h3>
                            <p className={`text-sm leading-relaxed ${isRed ? 'text-red-800/80' : 'text-slate-600'}`}>
                            {card.desc}
                            </p>
                        </>
                    )}
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </section>

      </div>

      {/* --- Footer Note Section --- */}
      <section className="bg-slate-900 text-slate-300 py-16 px-4">
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-8 text-white">
                <FileText className="text-red-500" />
                <h2 className="text-2xl font-bold">{pageData.administrative.title}</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pageData.administrative.notes.map((note, idx) => (
                   <div key={note.id} className="flex gap-4">
                      <div className="bg-slate-800 p-2 rounded h-fit shrink-0">
                          <Clock className="text-blue-400" size={20}/>
                      </div>
                      <div className="w-full">
                          {isEditing ? (
                            <>
                                <input 
                                    value={note.title} 
                                    onChange={(e) => handleArrayChange('administrative', 'notes', idx, 'title', e.target.value)} 
                                    className="text-white font-bold mb-1 bg-transparent border-b border-slate-600 w-full" 
                                />
                                <textarea 
                                    value={note.desc} 
                                    onChange={(e) => handleArrayChange('administrative', 'notes', idx, 'desc', e.target.value)} 
                                    className="text-sm leading-relaxed bg-transparent border border-slate-600 rounded w-full p-1 mt-1 text-slate-300" 
                                    rows={3}
                                />
                            </>
                          ) : (
                            <>
                                <h4 className="text-white font-bold mb-1">{note.title}</h4>
                                <p className="text-sm leading-relaxed">{note.desc}</p>
                            </>
                          )}
                      </div>
                  </div>
                ))}
            </div>
        </div>
      </section>

    </div>
  );
}