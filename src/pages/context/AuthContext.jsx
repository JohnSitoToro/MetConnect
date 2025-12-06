import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "/firebase.config.js";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userRef = doc(db, "usuarios", currentUser.uid);
        const snap = await getDoc(userRef);

        if (!snap.exists()) {
          await setDoc(userRef, {
            uid: currentUser.uid,
            name: currentUser.displayName || "",
            email: currentUser.email,
            provider: currentUser.providerData[0].providerId,
            creado: new Date(),
            completo: false,
          });
          setProfile({ completo: false });
        } else {
          setProfile(snap.data());
        }

      }

      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => await signOut(auth);

  // 🌸 Loader mientras se valida la sesión
  if (loading) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(4px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 3000,
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        {/* Spinner */}
        <div
          style={{
            width: "60px",
            height: "60px",
            border: "6px solid rgba(77,139,255,.3)",
            borderTop: "6px solid var(--primary)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginBottom: "1rem",
          }}
        ></div>

        {/* Texto */}
        <p
          style={{
            color: "white",
            fontSize: "1.1rem",
            fontWeight: 500,
            opacity: .9,
          }}
        >
          Cargando sesión...
        </p>

        <style>
          {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
        </style>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
