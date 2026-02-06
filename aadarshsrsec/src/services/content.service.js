import { db, storage } from "../firebase.config";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  collection,
  getDocs,
  addDoc,
  deleteDoc
} from "firebase/firestore";
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "firebase/storage";

/* =========================================
   GENERIC HELPERS
   ========================================= */

// Generic file upload helper
export const uploadFile = async (file, path) => {
  try {
    // Naming convention: folder/timestamp_filename to avoid conflicts
    const fileRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

/* =========================================
   1. HOME BANNERS (Carousel)
   ========================================= */
const BANNER_DOC_REF = doc(db, "site_content", "home_banners");

export const getBanners = async () => {
  try {
    const snap = await getDoc(BANNER_DOC_REF);
    return snap.exists() ? snap.data().images || [] : [];
  } catch (error) {
    console.error("Error fetching banners:", error);
    return [];
  }
};

export const uploadBanner = async (file) => {
  try {
    const url = await uploadFile(file, "banners");
    // Add to the 'images' array in Firestore
    await setDoc(BANNER_DOC_REF, { images: arrayUnion(url) }, { merge: true });
    return url;
  } catch (error) {
    console.error("Error saving banner:", error);
    throw error;
  }
};

export const deleteBanner = async (url) => {
  try {
    await updateDoc(BANNER_DOC_REF, {
      images: arrayRemove(url)
    });
  } catch (error) {
    console.error("Error deleting banner:", error);
    throw error;
  }
};

/* =========================================
   2. SCHOOL SECTION (About, Principal, etc.)
   ========================================= */
const SCHOOL_DOC_REF = doc(db, "site_content", "school_section");

export const getSchoolSectionData = async () => {
  try {
    const snap = await getDoc(SCHOOL_DOC_REF);
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    console.error("Error fetching school section:", error);
    return null;
  }
};

export const updateSchoolSectionData = async (data) => {
  try {
    await setDoc(SCHOOL_DOC_REF, data, { merge: true });
  } catch (error) {
    console.error("Error updating school section:", error);
    throw error;
  }
};

/* =========================================
   3. LEADERSHIP SECTION (Cards)
   ========================================= */
const LEADERSHIP_DOC_REF = doc(db, "site_content", "leadership");

export const getLeadershipData = async () => {
  try {
    const snap = await getDoc(LEADERSHIP_DOC_REF);
    // Return the 'cards' array directly
    return snap.exists() ? snap.data().cards || [] : [];
  } catch (error) {
    console.error("Error fetching leadership:", error);
    return [];
  }
};

export const updateLeadershipData = async (cardsArray) => {
  try {
    // Store as an object: { cards: [...] }
    await setDoc(LEADERSHIP_DOC_REF, { cards: cardsArray }, { merge: true });
  } catch (error) {
    console.error("Error updating leadership:", error);
    throw error;
  }
};

/* =========================================
   4. ANNUAL FUNCTION SECTION
   ========================================= */
const ANNUAL_DOC_REF = doc(db, "site_content", "annual_function");

export const getAnnualFunctionData = async () => {
  try {
    const snap = await getDoc(ANNUAL_DOC_REF);
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    console.error("Error fetching annual function:", error);
    return null;
  }
};

export const updateAnnualFunctionData = async (data) => {
  try {
    await setDoc(ANNUAL_DOC_REF, data, { merge: true });
  } catch (error) {
    console.error("Error updating annual function:", error);
    throw error;
  }
};

/* =========================================
   5. GRID SECTION (Stats/Highlights)
   ========================================= */
const GRID_DOC_REF = doc(db, "site_content", "grid_section");

export const getGridData = async () => {
  try {
    const snap = await getDoc(GRID_DOC_REF);
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    console.error("Error fetching grid data:", error);
    return null;
  }
};

export const updateGridData = async (data) => {
  try {
    await setDoc(GRID_DOC_REF, data, { merge: true });
  } catch (error) {
    console.error("Error updating grid data:", error);
    throw error;
  }
};

/* =========================================
   6. INFRASTRUCTURE SECTION (Home Page)
   ========================================= */
const INFRA_DOC_REF = doc(db, "site_content", "infrastructure");

export const getInfraData = async () => {
  try {
    const snap = await getDoc(INFRA_DOC_REF);
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    console.error("Error fetching infra data:", error);
    return null;
  }
};

export const updateInfraData = async (data) => {
  try {
    await setDoc(INFRA_DOC_REF, data, { merge: true });
  } catch (error) {
    console.error("Error updating infra data:", error);
    throw error;
  }
};

/* =========================================
   7. NAVIGATION & MENUS
   ========================================= */
const NAV_MENU_DOC = doc(db, "site_content", "navbar_menu");
const ACTIVITIES_NAV_DOC = doc(db, "site_content", "navigation");

// --- Main Navbar ---
export const getNavbarData = async () => {
  try {
    const snap = await getDoc(NAV_MENU_DOC);
    return snap.exists() ? snap.data().menu : null;
  } catch (error) {
    console.error("Error fetching navbar:", error);
    return null;
  }
};

export const updateNavbarData = async (menuArray) => {
  try {
    await setDoc(NAV_MENU_DOC, { menu: menuArray }, { merge: true });
  } catch (error) {
    console.error("Error saving navbar:", error);
    throw error;
  }
};

// --- Activities Dropdown ---
export const getActivitiesMenu = async () => {
  try {
    const snap = await getDoc(ACTIVITIES_NAV_DOC);
    return snap.exists() ? snap.data().activities || [] : [];
  } catch (error) {
    console.error("Error fetching activities menu:", error);
    return [];
  }
};

export const addActivityItem = async (name, slug) => {
  try {
    const newItem = { name, path: `/activities/${slug}` };
    await setDoc(ACTIVITIES_NAV_DOC, { activities: arrayUnion(newItem) }, { merge: true });
    return newItem;
  } catch (error) {
    console.error("Error adding activity item:", error);
    throw error;
  }
};

export const removeActivityItem = async (item) => {
  try {
    await updateDoc(ACTIVITIES_NAV_DOC, {
      activities: arrayRemove(item)
    });
  } catch (error) {
    console.error("Error removing activity item:", error);
    throw error;
  }
};

/* =========================================
   8. FOOTER SECTION
   ========================================= */
const FOOTER_DOC_REF = doc(db, "site_content", "footer");

export const getFooterData = async () => {
  try {
    const snap = await getDoc(FOOTER_DOC_REF);
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    console.error("Error fetching footer:", error);
    return null;
  }
};

export const updateFooterData = async (data) => {
  try {
    await setDoc(FOOTER_DOC_REF, data, { merge: true });
  } catch (error) {
    console.error("Error updating footer:", error);
    throw error;
  }
};

/* =========================================
   9. ABOUT PAGE (Detailed)
   ========================================= */
const ABOUT_PAGE_REF = doc(db, "site_content", "about_page");

export const getAboutPageData = async () => {
  try {
    const snap = await getDoc(ABOUT_PAGE_REF);
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    console.error("Error fetching about page:", error);
    return null;
  }
};

export const updateAboutPageData = async (data) => {
  try {
    await setDoc(ABOUT_PAGE_REF, data, { merge: true });
  } catch (error) {
    console.error("Error updating about page:", error);
    throw error;
  }
};

/* =========================================
   10. ACTIVITIES PAGE (Dynamic List)
   ========================================= */
const ACTIVITIES_COLLECTION = collection(db, "activities");

export const getActivities = async () => {
  try {
    const snap = await getDocs(ACTIVITIES_COLLECTION);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching activities:", error);
    return [];
  }
};

export const addActivity = async (data, imageFile) => {
  try {
    let imageUrl = "";
    if (imageFile) {
      imageUrl = await uploadFile(imageFile, "activities");
    }
    
    // Add to Firestore
    const docRef = await addDoc(ACTIVITIES_COLLECTION, {
      ...data,
      image: imageUrl,
      createdAt: new Date()
    });
    
    return { id: docRef.id, ...data, image: imageUrl };
  } catch (error) {
    console.error("Error adding activity:", error);
    throw error;
  }
};

export const updateActivity = async (id, data, newImageFile) => {
  try {
    let imageUrl = data.image; // Keep old image by default
    
    if (newImageFile) {
      imageUrl = await uploadFile(newImageFile, "activities");
    }

    const docRef = doc(db, "activities", id);
    await updateDoc(docRef, {
      ...data,
      image: imageUrl
    });

    return { id, ...data, image: imageUrl };
  } catch (error) {
    console.error("Error updating activity:", error);
    throw error;
  }
};

export const deleteActivity = async (id) => {
  try {
    await deleteDoc(doc(db, "activities", id));
  } catch (error) {
    console.error("Error deleting activity:", error);
    throw error;
  }
};

/* =========================================
   11. AFFILIATION & STATUS
   ========================================= */
const AFFILIATION_DOC = doc(db, "site_content", "affiliation");

export const getAffiliationData = async () => {
  try {
    const snap = await getDoc(AFFILIATION_DOC);
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    console.error("Error fetching affiliation:", error);
    return null;
  }
};

export const updateAffiliationData = async (data) => {
  try {
    await setDoc(AFFILIATION_DOC, data, { merge: true });
  } catch (error) {
    console.error("Error updating affiliation:", error);
    throw error;
  }
};

/* =========================================
   12. CONTACT PAGE
   ========================================= */
const CONTACT_DOC = doc(db, "site_content", "contact_page");

export const getContactData = async () => {
  try {
    const snap = await getDoc(CONTACT_DOC);
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    console.error("Error fetching contact data:", error);
    return null;
  }
};

export const updateContactData = async (data) => {
  try {
    await setDoc(CONTACT_DOC, data, { merge: true });
  } catch (error) {
    console.error("Error updating contact data:", error);
    throw error;
  }
};

/* =========================================
   13. INFRASTRUCTURE PAGE (Detailed)
   ========================================= */
const INFRA_PAGE_DOC = doc(db, "site_content", "infrastructure_page");

export const getInfraPageData = async () => {
  try {
    const snap = await getDoc(INFRA_PAGE_DOC);
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    console.error("Error fetching infra page:", error);
    return null;
  }
};

export const updateInfraPageData = async (data) => {
  try {
    await setDoc(INFRA_PAGE_DOC, data, { merge: true });
  } catch (error) {
    console.error("Error updating infra page:", error);
    throw error;
  }
};

/* =========================================
   14. MISSION & VISION PAGE
   ========================================= */
const MISSION_DOC = doc(db, "site_content", "mission_vision");

export const getMissionVisionData = async () => {
  try {
    const snap = await getDoc(MISSION_DOC);
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    console.error("Error fetching mission/vision:", error);
    return null;
  }
};

export const updateMissionVisionData = async (data) => {
  try {
    await setDoc(MISSION_DOC, data, { merge: true });
  } catch (error) {
    console.error("Error updating mission/vision:", error);
    throw error;
  }
};

/* =========================================
   15. NEWS & EVENTS SECTION
   ========================================= */
const NEWS_DOC = doc(db, "site_content", "news_section");

export const getNewsData = async () => {
  try {
    const snap = await getDoc(NEWS_DOC);
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    console.error("Error fetching news:", error);
    return null;
  }
};

export const updateNewsData = async (data) => {
  try {
    await setDoc(NEWS_DOC, data, { merge: true });
  } catch (error) {
    console.error("Error updating news:", error);
    throw error;
  }
};

/* =========================================
   16. PRINCIPAL PAGE (Detailed)
   ========================================= */
const PRINCIPAL_PAGE_DOC = doc(db, "site_content", "principal_page");

export const getPrincipalPageData = async () => {
  try {
    const snap = await getDoc(PRINCIPAL_PAGE_DOC);
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    console.error("Error fetching principal page:", error);
    return null;
  }
};

export const updatePrincipalPageData = async (data) => {
  try {
    await setDoc(PRINCIPAL_PAGE_DOC, data, { merge: true });
  } catch (error) {
    console.error("Error updating principal page:", error);
    throw error;
  }
};

/* =========================================
   17. RULES & REGULATIONS PAGE
   ========================================= */
const RULES_DOC = doc(db, "site_content", "rules_page");

export const getRulesData = async () => {
  try {
    const snap = await getDoc(RULES_DOC);
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    console.error("Error fetching rules:", error);
    return null;
  }
};

export const updateRulesData = async (data) => {
  try {
    await setDoc(RULES_DOC, data, { merge: true });
  } catch (error) {
    console.error("Error updating rules:", error);
    throw error;
  }
};

export const updateActivitiesData = async (activitiesList) => {
  try {
    // We reference a document named 'navbar' inside 'siteContent' collection
    const navbarRef = doc(db, "siteContent", "navbar");
    
    // We use setDoc with { merge: true } so it creates the doc if it doesn't exist
    await setDoc(navbarRef, { 
      activities: activitiesList,
      lastUpdated: new Date()
    }, { merge: true });
    
    return true;
  } catch (error) {
    console.error("Error saving activities:", error);
    throw error;
  }
};

// --- NEW FUNCTION: Fetch Activities (You need this to load it!) ---
export const getActivitiesData = async () => {
  try {
    const navbarRef = doc(db, "siteContent", "navbar");
    const docSnap = await getDoc(navbarRef);
    
    if (docSnap.exists() && docSnap.data().activities) {
      return docSnap.data().activities;
    } else {
      return null; // Return null to fall back to default data
    }
  } catch (error) {
    console.error("Error fetching activities:", error);
    return null;
  }
};

/* =========================================
   18. DOSSIER (Documents)
   ========================================= */
const DOSSIER_DOC_REF = doc(db, "siteContent", "dossier");

export const getDossierData = async () => {
  try {
    const snap = await getDoc(DOSSIER_DOC_REF);
    return snap.exists() ? snap.data().items || null : null;
  } catch (error) {
    console.error("Error fetching dossier:", error);
    return null;
  }
};

export const updateDossierData = async (dossierItems) => {
  try {
    await setDoc(DOSSIER_DOC_REF, { 
      items: dossierItems,
      lastUpdated: new Date() 
    }, { merge: true });
  } catch (error) {
    console.error("Error updating dossier:", error);
    throw error;
  }
};