"use client";
import { createContext } from "react";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { app } from "@/app/lib/firebase/firebase";
import { ClipLoader } from "react-spinners";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <ClipLoader
            className="mx-auto"
            color="#0d6efd"
            size={100}
            speedMultiplier="2"
          />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
