import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Send, Loader2, Edit, Save, X } from 'lucide-react';
// 1. IMPORT TOAST
import toast from 'react-hot-toast';
import emailjs from "@emailjs/browser";

import { useAuth } from '../context/AuthContext';
import { getContactData, updateContactData } from '../services/content.service';

import img1 from "../assets/map.png";

// --- DEFAULT DATA ---
const DEFAULTS = {
  pageTitle: "Contact Us",
  pageDescription: "We are here to help. Reach out to us for admissions, inquiries, or any assistance you need.",
  schoolInfo: {
    name: "ADARSH SENIOR SECONDARY PUBLIC SCHOOL",
    affiliation: "(AFFILIATED TO CBSE - NEW DELHI)",
    management: "Managed By: Shaheed Bhagat Singh Education Society",
    address: {
      line1: "Village - Nahra",
      line2: "Barara",
      district: "District - Ambala (PB)"
    }
  },
  contactDetails: {
    office: { label: "Office", number: "79882-12029", tel: "7988212029" },
    counselor: { label: "Counselor", number: "99969-85239", tel: "9996985239" },
    email: "info.adarshschool@gmail.com",
    website: "www.adarshschoolnahra.com",
    websiteUrl: "http://www.adarshschoolnahra.com"
  }
};

const Contact = () => {
  const { currentUser, userRole } = useAuth();
  const isAdmin = currentUser && userRole === 'admin';

  const [content, setContent] = useState(DEFAULTS);
  const [ setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Form State (For User Messages)
  const [userForm, setUserForm] = useState({ name: '', phone: '', email: '', message: '' });

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getContactData();
        if (data) setContent(prev => ({ ...prev, ...data }));
      } catch (error) {
        console.error("Failed to fetch contact data", error);
        toast.error("Failed to load contact info.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- HANDLERS FOR EDITING CONTENT ---
  const handleContentChange = (section, field, value, nestedField = null) => {
    setContent(prev => {
      // Deep clone to avoid direct mutation
      const newState = JSON.parse(JSON.stringify(prev));
      
      if (nestedField) {
        newState[section][field][nestedField] = value;
      } else if (section) {
        newState[section][field] = value;
      } else {
        newState[field] = value; 
      }
      return newState;
    });
  };

  const handleSaveContent = async () => {
    setSaveLoading(true);
    // TOAST: Loading
    const toastId = toast.loading("Saving contact info...");

    try {
      await updateContactData(content);
      setIsEditing(false);
      // TOAST: Success
      toast.success("Contact information updated!", { id: toastId });
    } catch (error) {
      console.error(error);
      // TOAST: Error
      toast.error("Failed to save changes.", { id: toastId });
    } finally {
      setSaveLoading(false);
    }
  };

  // --- HANDLERS FOR USER MESSAGE FORM ---
  const handleUserFormChange = (e) => {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  };

  const handleUserFormSubmit = (e) => {
  e.preventDefault();

  const toastId = toast.loading("Sending message...");

  emailjs
    .send(
     import.meta.env.VITE_SERVICE_ID,
  import.meta.env.VITE_TEMPLATE_ID,
      {
        name: userForm.name,
        phone: userForm.phone,
        email: userForm.email,
        message: userForm.message,
      },
     import.meta.env.VITE_PUBLIC_KEY,
    )
    .then(() => {
      toast.success("Message sent successfully!", { id: toastId });
      setUserForm({ name: '', phone: '', email: '', message: '' });
    })
    .catch((error) => {
      console.error(error);
      toast.error("Failed to send message. Try again.", { id: toastId });
    });
};

  return (
    <div className="bg-gray-50 min-h-screen pb-12 relative group">
      
      {/* --- ADMIN CONTROLS --- */}
      {isAdmin && !isEditing && (
        <button 
          onClick={() => setIsEditing(true)}
          className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition hover:scale-110"
          title="Edit Contact Info"
        >
          <Edit size={24} />
        </button>
      )}

      {isEditing && (
        <div className="fixed bottom-6 right-6 z-50 flex gap-2 animate-bounce-in">
          <button onClick={() => setIsEditing(false)} className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-full shadow-xl flex items-center gap-2 font-bold">
            <X size={18} /> Cancel
          </button>
          <button onClick={handleSaveContent} disabled={saveLoading} className="bg-green-600 text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 font-bold disabled:opacity-70">
            {saveLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save
          </button>
        </div>
      )}

      {/* --- Header Section --- */}
      <div className="bg-red-800 text-white pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {isEditing ? (
            <input 
              value={content.pageTitle}
              onChange={(e) => handleContentChange(null, "pageTitle", e.target.value)}
              className="text-3xl md:text-5xl font-bold mb-4 bg-red-900/50 text-center w-full border-b border-white/30 outline-none"
            />
          ) : (
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{content.pageTitle}</h1>
          )}
          
          {isEditing ? (
            <textarea 
              value={content.pageDescription}
              onChange={(e) => handleContentChange(null, "pageDescription", e.target.value)}
              className="text-red-100 text-lg w-full max-w-2xl bg-red-900/50 text-center border-b border-white/30 outline-none resize-none"
            />
          ) : (
            <p className="text-red-100 text-lg max-w-2xl mx-auto">
              {content.pageDescription}
            </p>
          )}
        </div>
      </div>

      {/* --- Main Content Wrapper --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* --- Left Column: Info --- */}
          <div className="space-y-6">
            
            {/* School Details Card */}
            <div className={`bg-white p-8 rounded-2xl shadow-lg border border-gray-100 ${isEditing ? 'ring-2 ring-blue-400' : ''}`}>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">School Information</h2>
              
              <div className="space-y-6">
                <div>
                  {isEditing ? (
                    <input 
                      value={content.schoolInfo.name}
                      onChange={(e) => handleContentChange('schoolInfo', 'name', e.target.value)}
                      className="text-red-700 font-bold text-lg mb-1 uppercase tracking-wide w-full border-b border-gray-300"
                    />
                  ) : (
                    <h3 className="text-red-700 font-bold text-lg mb-1 uppercase tracking-wide">
                      {content.schoolInfo.name}
                    </h3>
                  )}

                  <p className="text-sm text-gray-500 font-medium mb-3">
                    {content.schoolInfo.affiliation}
                  </p>
                  <p className="text-gray-600 text-sm italic bg-red-50 p-3 rounded-lg border border-red-100 inline-block w-full">
                    {content.schoolInfo.management}
                  </p>
                </div>

                <div className="flex items-start gap-4 pt-2">
                  <div className="bg-red-100 p-3 rounded-full text-red-700 shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div className="w-full">
                    <h4 className="font-bold text-gray-800 text-lg">Registered Office</h4>
                    {isEditing ? (
                      <div className="flex flex-col gap-1 mt-1">
                        <input value={content.schoolInfo.address.line1} onChange={(e) => handleContentChange('schoolInfo', 'address', e.target.value, 'line1')} className="border p-1 text-sm rounded" placeholder="Line 1" />
                        <input value={content.schoolInfo.address.line2} onChange={(e) => handleContentChange('schoolInfo', 'address', e.target.value, 'line2')} className="border p-1 text-sm rounded" placeholder="Line 2" />
                        <input value={content.schoolInfo.address.district} onChange={(e) => handleContentChange('schoolInfo', 'address', e.target.value, 'district')} className="border p-1 text-sm rounded" placeholder="District" />
                      </div>
                    ) : (
                      <p className="text-gray-600 leading-relaxed mt-1">
                        {content.schoolInfo.address.line1}<br />
                        {content.schoolInfo.address.line2}<br />
                        {content.schoolInfo.address.district}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Channels Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Phone */}
              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-50 rounded-lg text-red-700">
                    <Phone size={24} />
                  </div>
                  <h3 className="font-bold text-gray-800 leading-tight">Call<br/>Support</h3>
                </div>
                <div className="space-y-4">
                  {/* Office */}
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">{content.contactDetails.office.label}</p>
                    {isEditing ? (
                      <input 
                        value={content.contactDetails.office.number}
                        onChange={(e) => handleContentChange('contactDetails', 'office', e.target.value, 'number')}
                        className="w-full border-b border-gray-300 font-semibold"
                      />
                    ) : (
                      <a href={`tel:${content.contactDetails.office.tel}`} className="text-lg font-semibold text-gray-800 hover:text-red-700 transition-colors">
                        {content.contactDetails.office.number}
                      </a>
                    )}
                  </div>
                  {/* Counselor */}
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">{content.contactDetails.counselor.label}</p>
                    {isEditing ? (
                      <input 
                        value={content.contactDetails.counselor.number}
                        onChange={(e) => handleContentChange('contactDetails', 'counselor', e.target.value, 'number')}
                        className="w-full border-b border-gray-300 font-semibold"
                      />
                    ) : (
                      <a href={`tel:${content.contactDetails.counselor.tel}`} className="text-lg font-semibold text-gray-800 hover:text-red-700 transition-colors">
                        {content.contactDetails.counselor.number}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-50 rounded-lg text-red-700">
                    <Mail size={24} />
                  </div>
                  <h3 className="font-bold text-gray-800 leading-tight">Write<br/>To Us</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Email</p>
                    {isEditing ? (
                      <input 
                        value={content.contactDetails.email}
                        onChange={(e) => handleContentChange('contactDetails', 'email', e.target.value)}
                        className="w-full border-b border-gray-300 text-sm font-semibold"
                      />
                    ) : (
                      <a href={`mailto:${content.contactDetails.email}`} className="text-sm font-semibold text-gray-800 hover:text-red-700 break-all transition-colors">
                        {content.contactDetails.email}
                      </a>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Visit</p>
                    {isEditing ? (
                      <input 
                        value={content.contactDetails.website}
                        onChange={(e) => handleContentChange('contactDetails', 'website', e.target.value)}
                        className="w-full border-b border-gray-300 text-sm font-semibold"
                      />
                    ) : (
                      <a href={content.contactDetails.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-gray-800 hover:text-red-700 transition-colors">
                        {content.contactDetails.website}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- Right Column: Contact Form (User Facing) --- */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-red-700 h-fit sticky top-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Send us a Message</h2>
            <p className="text-gray-500 mb-6 text-sm">Fill out the form below and we'll get back to you shortly.</p>
            
            <form onSubmit={handleUserFormSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <input 
                    type="text" name="name" required 
                    value={userForm.name} onChange={handleUserFormChange}
                    placeholder="John Doe" 
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none transition-all bg-gray-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input 
                    type="tel" name="phone" required
                    value={userForm.phone} onChange={handleUserFormChange}
                    placeholder="+91 98765 43210" 
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none transition-all bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" name="email" required
                  value={userForm.email} onChange={handleUserFormChange}
                  placeholder="you@example.com" 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none transition-all bg-gray-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea 
                  rows="4" name="message" required
                  value={userForm.message} onChange={handleUserFormChange}
                  placeholder="How can we help you?" 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none transition-all resize-none bg-gray-50 focus:bg-white"
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Send size={18} />
                Send Message
              </button>
            </form>
          </div>

        </div>

        {/* --- Map Section --- */}
        <div className="mt-12 bg-white p-2 rounded-2xl shadow-lg border border-gray-100">
            <div className="p-4 pb-2">
                <h3 className="text-xl font-bold text-gray-800">Visit Campus</h3>
                <p className="text-gray-500 text-sm">Use the map below to navigate to our location.</p>
            </div>
            <div className="rounded-xl overflow-hidden h-96 w-full relative bg-gray-100">
                <img
                    src={img1}
                    alt="School Location Map"
                    className="w-full h-full object-contain"
                />
            </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;