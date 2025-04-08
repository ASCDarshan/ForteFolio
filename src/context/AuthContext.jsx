import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../firebaseConfig'; // Ensure firebaseConfig exports a properly initialized `auth` object
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getDatabase, ref, set } from "firebase/database"; // Ensure Firebase Database is initialized in firebaseConfig

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Handles initial auth check

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // Optional: Save basic profile info on first login/update
       const db = getDatabase();
       const userProfileRef = ref(db, `users/${result.user.uid}/profile`);
       await set(userProfileRef, {
            displayName: result.user.displayName,
            email: result.user.email,
            photoURL: result.user.photoURL
       });
      // currentUser state will be set by onAuthStateChanged
      return true; // Indicate success
    } catch (error) {
      console.error("Google login error:", error);
      // Handle specific errors (e.g., popup closed) if needed
       return false; // Indicate failure
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      // currentUser state will be set to null by onAuthStateChanged
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    // Firebase listener for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null); // Ensure null is set if no user is logged in
      setLoading(false); // Auth check complete
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading, // Export loading state
    handleGoogleLogin,
    logout
  };

  // Don't render children until initial auth check is complete
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};