import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; 

export const fetchHomeData = async () => {
  try {
    const docRef = doc(db, "home", "content");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No home document found!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching home data:", error);
    throw error;
  }
};