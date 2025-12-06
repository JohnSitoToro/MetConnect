import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import {
  updateProfile,
  updatePassword,
  deleteUser,
  reauthenticateWithPopup,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db, provider } from "/firebase.config.js";
import { useNavigate } from "react-router-dom";
import Header from "../../layout/header/Header.jsx";
import Footer from "../../layout/footer/Footer.jsx";
import "./Profile.css";

const Profile = () => {
  const { user, logout } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [telefono, setTelefono] = useState("");
  const [identificacion, setIdentificacion] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");

  const [email, setEmail] = useState("");
  const [providerId, setProviderId] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const [isIncomplete, setIsIncomplete] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      setDisplayName(user.displayName || "");
      setEmail(user.email || "");

      const ref = doc(db, "usuarios", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();

        setTelefono(data.telefono || "");
        setIdentificacion(data.identificacion || "");
        setFechaNacimiento(data.fechaNacimiento || "");

        setIsIncomplete(!data.completo);

        setProviderId(data.metodo === "google" ? "google.com" : "password");
      }
    };

    loadProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    // Validación: si está incompleto, obligar a llenar todo
    if (
      telefono.trim() === "" ||
      identificacion.trim() === "" ||
      fechaNacimiento.trim() === ""
    ) {
      alert("Debes completar todos los datos obligatorios.");
      return;
    }

    setSaving(true);

    try {
      // Actualizar displayName en Auth
      await updateProfile(user, { displayName });

      // Actualizar datos en Firestore
      const ref = doc(db, "usuarios", user.uid);

      await updateDoc(ref, {
        nombre: displayName,
        telefono,
        identificacion,
        fechaNacimiento,
        completo: true, 
      });

      if (providerId !== "google.com" && newPassword.trim() !== "") {
        await updatePassword(user, newPassword);
      }

      alert("Datos guardados correctamente.");

      navigate("/home");
    } catch (error) {
      console.error(error);
      alert("Error al guardar los datos.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Header />
      <div className="profile-container">
        <h1>Completar Perfil</h1>

        {user ? (
          <>
            <div className="config-item">
              <label>Nombre:</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>

            <div className="config-item">
              <label>Teléfono:</label>
              <input
                type="text"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
              />
            </div>

            <div className="config-item">
              <label>Identificación:</label>
              <input
                type="text"
                value={identificacion}
                onChange={(e) => setIdentificacion(e.target.value)}
                required
              />
            </div>

            <div className="config-item">
              <label>Fecha de nacimiento:</label>
              <input
                type="date"
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
                required
              />
            </div>

            <button className="btn-primary" onClick={handleSave}>
              {saving ? "Guardando..." : "Guardar datos"}
            </button>
          </>
        ) : (
          <p>Cargando...</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Profile;