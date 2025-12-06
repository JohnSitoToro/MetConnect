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
import { db, auth, provider } from "/firebase.config.js";
import { useNavigate } from "react-router-dom";
import Header from "../../layout/header/Header.jsx";
import Footer from "../../layout/footer/Footer.jsx";
import "./Profile.css";

const Profile = () => {
  const { user, profile, reloadProfile, logout } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [telefono, setTelefono] = useState("");
  const [identificacion, setIdentificacion] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");

  const [email, setEmail] = useState("");
  const [providerId, setProviderId] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [isIncomplete, setIsIncomplete] = useState(false);

  const navigate = useNavigate();

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

        setProviderId(data.provider || user.providerData[0]?.providerId || "password");
      }
    };

    loadProfile();
  }, [user]);

  // ----------------------------------------
  // 🔹 GUARDAR CAMBIOS DEL PERFIL
  // ----------------------------------------
  const handleSave = async () => {
    if (!user) return;

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
      await updateProfile(user, { displayName });

      const ref = doc(db, "usuarios", user.uid);

      await updateDoc(ref, {
        nombre: displayName,
        telefono,
        identificacion,
        fechaNacimiento,
        completo: true,
      });

      reloadProfile();

      if (providerId !== "google.com" && newPassword.trim() !== "") {
        await updatePassword(user, newPassword);
        alert("Contraseña actualizada correctamente.");
      }

      alert("Datos guardados.");
      navigate("/home");

    } catch (error) {
      console.error(error);
      alert("Error al guardar los datos.");
    } finally {
      setSaving(false);
    }
  };

  // ----------------------------------------
  // 🔥 ELIMINAR CUENTA COMPLETA
  // ----------------------------------------
  const handleDeleteAccount = async () => {
    if (!user) return;

    const confirmDelete = window.confirm(
      "⚠️ Esta acción eliminará tu cuenta y todos tus datos. ¿Seguro que deseas continuar?"
    );
    if (!confirmDelete) return;

    setDeleting(true);

    try {
      // Reautenticación obligatoria
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

      // Eliminar Firestore
      await deleteDoc(doc(db, "usuarios", user.uid));

      // Eliminar Autenticación
      await deleteUser(user);

      // Limpiar sesión local
      await logout();

      alert("Tu cuenta ha sido eliminada correctamente.");
      navigate("/");

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
        <h1>Completar Perfil</h1>

        {isIncomplete && (
          <p className="progress-reminder">
            ⚠️ Tu perfil está incompleto. Completarlo te permitirá agendar citas y usar todas las funciones.
            <br />¡Solo faltan unos pasos!
          </p>
        )}

        {user ? (
          <>
            <div className="config-item">
              <label>Nombre:</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Ej. Juan Pérez"
              />
            </div>

            <div className="config-item">
              <label>Teléfono:</label>
              <input
                type="text"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Ej. 3101234567"
              />
            </div>

            <div className="config-item">
              <label>Identificación:</label>
              <input
                type="text"
                value={identificacion}
                onChange={(e) => setIdentificacion(e.target.value)}
                placeholder="Ej. 1234567890"
              />
            </div>

            <div className="config-item">
              <label>Fecha de nacimiento:</label>
              <input
                type="date"
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
              />
            </div>

            {providerId !== "google.com" && (
              <div className="config-item">
                <label>Nueva contraseña:</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Dejar vacío si no deseas cambiarla"
                />
              </div>
            )}

            <button className="btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>

            <button
              className="btn-danger"
              onClick={handleDeleteAccount}
              disabled={deleting}
            >
              {deleting ? "Eliminando..." : "Eliminar cuenta"}
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