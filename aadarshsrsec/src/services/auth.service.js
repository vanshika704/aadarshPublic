// src/services/auth.service.js
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase.config";

/**
 * Logs in the admin user using Firebase Auth
 * @param {string} email 
 * @param {string} password 
 * @returns {Object} { user, error }
 */
export const loginAdmin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error("Login Error:", error.code);
    return { user: null, error: error.code }; // Return error code to handle in UI
  }
};

/**
 * Logs out the current user
 */
export const logoutAdmin = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error("Logout Error:", error);
    return false;
  }
};