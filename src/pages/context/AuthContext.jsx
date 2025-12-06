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

  // 🔥 Nuevo: permite refrescar el perfil
  const [refresh, setRefresh] = useState(false);
  const reloadProfile = () => setRefresh((p) => !p);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("Usuario actual:", currentUser);

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
  }, [refresh]); // 🔥 se vuelve a ejecutar cuando recargamos el perfil

  const logout = async () => await signOut(auth);

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, logout, reloadProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};