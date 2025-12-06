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
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db, provider } from "/firebase.config.js";
import { useNavigate } from "react-router-dom";
import Header from "../../layout/header/Header.jsx";
import Footer from "../../layout/footer/Footer.jsx";
import "./Profile.css";

const Profile = () => {
  const { user, logout } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [providerId, setProviderId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // 🔹 Estados que faltaban
  const [isIncomplete, setIsIncomplete] = useState(false);
  const [phone, setPhone] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [birthdate, setBirthdate] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) return;
      setDisplayName(user.displayName || "");
      setEmail(user.email || "");

      // 🔹 Buscar proveedor desde Firestore
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data();
        setProviderId(data.provider || user.providerData[0]?.providerId || "");
      } else {
        setProviderId(user.providerData[0]?.providerId || "");
      }
    };
    fetchUser();

    const load = async () => {
      if (!user) return;

      const ref = doc(db, "usuarios", user.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) return;

      const data = snap.data();

      // 🔹 Si faltan campos, marcar incompleto
      setIsIncomplete(!data.completo);

      setPhone(data.telefono || "");
      setIdNumber(data.identificacion || "");
      setBirthdate(data.fechaNacimiento || "");
    };

    load();
  }, [user]);

  // 🔹 Guardar cambios de perfil
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateProfile(user, { displayName });

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { name: displayName });

      if (providerId !== "google.com" && newPassword.trim() !== "") {
        await updatePassword(user, newPassword);
        alert("Contraseña actualizada correctamente ✅");
      }

      alert("Perfil actualizado correctamente ✅");
      setNewPassword("");
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      alert("Hubo un problema al actualizar el perfil ❌");
    } finally {
      setSaving(false);
    }
  };

  // 🔹 Eliminar cuenta
  const handleDeleteAccount = async () => {
    if (!user) return;

    const confirmDelete = window.confirm(
      "⚠️ Esta acción eliminará tu cuenta y todos tus datos. ¿Seguro que deseas continuar?"
    );
    if (!confirmDelete) return;

    setDeleting(true);

    try {
      // 🔹 Reautenticación
      if (providerId === "google.com") {
        await reauthenticateWithPopup(user, provider);
      } else {
        const currentPassword = prompt("Por seguridad, ingresa tu contraseña actual:");
        if (!currentPassword) {
          alert("Operación cancelada.");
          setDeleting(false);
          return;
        }
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
      }

      // 🔹 Eliminar de Firestore
      await deleteDoc(doc(db, "users", user.uid));

      // 🔹 Eliminar cuenta de Firebase Auth
      await deleteUser(user);

      // 🔹 Cerrar sesión localmente
      await logout();

      alert("Tu cuenta ha sido eliminada correctamente ✅");

      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error) {
      console.error("Error al eliminar cuenta:", error);
      alert("No se pudo eliminar la cuenta. Intenta nuevamente.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="profile-container">
        <h1>Perfil de Usuario</h1>

        {user ? (
          <div className="config-container">
            <div className="config-section">
              <h4>Información Personal</h4>

              <div className="config-item">
                <label>Nombre:</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>

              <div className="config-item">
                <label>Correo:</label>
                <input type="email" value={email} disabled />
              </div>

              {providerId !== "google.com" ? (
                <div className="config-item">
                  <label>Nueva Contraseña:</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Dejar vacío si no deseas cambiarla"
                  />
                </div>
              ) : (
                <p className="info-text">
                  ⚠️ Usuario de Google: no puedes cambiar la contraseña aquí.
                </p>
              )}

              {isIncomplete && (
                <p className="warning-text">
                  ⚠️ Algunos campos de tu perfil están incompletos. Por favor, complétalos.
                </p>
              )}
            </div>

            <div className="config-buttons">
              <button
                className="btn-primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>

              <button
                className="btn-danger"
                onClick={handleDeleteAccount}
                disabled={deleting}
              >
                {deleting ? "Eliminando..." : "Eliminar cuenta"}
              </button>
            </div>
          </div>
        ) : (
          <p>Cargando información del usuario...</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Profile;
