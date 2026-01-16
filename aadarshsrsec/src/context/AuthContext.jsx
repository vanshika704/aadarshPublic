// import React, { createContext, useContext, useEffect, useState } from "react";
// import { auth } from "../firebase.config";
// import { onAuthStateChanged, signOut } from "firebase/auth";

// const AuthContext = createContext();

// // Custom hook to use auth easily
// // eslint-disable-next-line react-refresh/only-export-components
// export function useAuth() {
//   return useContext(AuthContext);
// }

// export function AuthProvider({ children }) {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // This runs once when the app starts
//   useEffect(() => {
//     // Firebase listener: detects if a user is logged in or out
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setCurrentUser(user); // If user is null, they are logged out
//       setLoading(false);
//     });

//     return unsubscribe; // Cleanup
//   }, []);

//   const logout = () => {
//     return signOut(auth);
//   };

//   const value = {
//     currentUser,
//     logout
//   };

//   // Don't render anything until we know the auth status
//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// }

import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase.config"; // Ensure db is exported from config
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

// Custom hook to use auth easily
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // Store 'admin' or 'user'
  const [loading, setLoading] = useState(true);

  // This runs once when the app starts
  useEffect(() => {
    // Firebase listener: detects if a user is logged in or out
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // 1. User is logged in
        setCurrentUser(user);

        // 2. Fetch their Role from Firestore
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            // Get the role field (e.g., "admin")
            setUserRole(userDoc.data().role);
          } else {
            // Default to 'user' if no specific record exists
            setUserRole("user");
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUserRole("user"); // Fail safe
        }
      } else {
        // User is logged out
        setCurrentUser(null);
        setUserRole(null);
      }
      
      setLoading(false);
    });

    return unsubscribe; // Cleanup
  }, []);

  const logout = () => {
    return signOut(auth);
  };

  const value = {
    currentUser,
    userRole, // Exposing this allows components to check permissions
    logout
  };

  // Don't render anything until we know the auth status
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}