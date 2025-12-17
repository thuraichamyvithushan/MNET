import React, { createContext, useState, useEffect, useContext } from "react";
import { auth, firestore } from "../firebase";

// Create context
export const AuthContext = createContext();

// Custom hook for easy access to auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await firestore.collection("users").doc(firebaseUser.uid).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: userData.role || "user", // Default to "user" if no role set
              ...userData
            });
          } else {
            // User is authenticated but no Firestore document - still set basic user info
            console.log("User document not found in Firestore, using Firebase Auth data");
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "User",
              role: "user"
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Still set basic user info on error
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "User",
            role: "user"
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Helper function to check if user is admin
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;