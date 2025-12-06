import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "/firebase.config.js";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("Usuario actual:", currentUser);

      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(userRef);

        if (!snap.exists()) {
          await setDoc(userRef, {
            uid: currentUser.uid,
            name: currentUser.displayName || "",
            email: currentUser.email,
            provider: currentUser.providerData[0].providerId,
            createdAt: new Date(),
          });
        }
      }

      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => await signOut(auth);

  if (loading) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #ffe4ec, #ffd6e0)",
          zIndex: 3000,
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <div
          style={{
            width: "55px",
            height: "55px",
            border: "5px solid #ffb6c1",
            borderTop: "5px solid #ff4d88",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginBottom: "1.2rem",
          }}
        ></div>

        <p
          style={{
            color: "#c23b6c",
            fontSize: "1.2rem",
            fontWeight: 600,
            textShadow: "0 1px 2px rgba(255,255,255,0.6)",
            animation: "fadeIn 1.5s ease-in-out infinite alternate",
          }}
        >
          Verificando tu perfil... 🍓
        </p>

        <style>
          {`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes fadeIn {
              from { opacity: 0.6; }
              to { opacity: 1; }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
