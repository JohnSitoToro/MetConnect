import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, provider } from "/firebase.config.js";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import { doc, setDoc, getDoc } from "firebase/firestore";
import "./Login.css";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";
import "../context/ThemeContext.css";


export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

  // Campos
  const [form, setForm] = useState({
    email: "",
    password: "",
    displayName: "",
    telefono: "",
    documento: "",
    nacimiento: "",
    genero: "",
    direccion: "",
  });

  const updateField = (field, value) => {
    setForm({ ...form, [field]: value });

    if (!value.trim()) {
      setFormErrors({
        ...formErrors,
        [field]: "📝 Este campo no puede quedar vacío.",
      });
    } else {
      setFormErrors({ ...formErrors, [field]: "" });
    }
  };

  // MICROCOPIA automática para email
  const validateEmail = () => {
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setFormErrors({
        ...formErrors,
        email: "📧 Tu correo no parece válido. Intenta revisarlo.",
      });
    }
  };

  // MICROCOPIA automática para password
  const validatePassword = () => {
    if (form.password.length < 6) {
      setFormErrors({
        ...formErrors,
        password: "🔐 Tu contraseña debe tener al menos 6 caracteres.",
      });
    }
  };

  // LOGIN con Google
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "usuarios", user.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        await setDoc(userRef, {
          nombre: user.displayName || "",
          email: user.email,
          telefono: "",
          identificacion: "",
          fechaNacimiento: "",
          metodo: "google",
          fechaRegistro: new Date(),
          completo: false,
        });
      }

      const data = snap.data();

      if (!data?.completo) {
        return navigate("/profile");
      }

      navigate("/home");
    } catch (error) {
      console.error(error);
    }
  };

  // LOGIN con correo
  const handleEmailLogin = async (e) => {
    e.preventDefault();

    if (formErrors.email || formErrors.password) return;

    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      navigate("/home");
    } catch (error) {
      setFormErrors({
        ...formErrors,
        email: "⚠️ Correo o contraseña incorrectos.",
      });
    }
  };

  // REGISTRO
  const handleRegister = async (e) => {
    e.preventDefault();

    const requiredFields = ["email", "password", "displayName"];

    let hasError = false;
    let newErrors = {};

    requiredFields.forEach((f) => {
      if (!form[f].trim()) {
        newErrors[f] = "⚠️ Este campo es obligatorio.";
        hasError = true;
      }
    });

    setFormErrors(newErrors);
    if (hasError) return;

    try {
      const result = await createUserWithEmailAndPassword(auth, form.email, form.password);

      await updateProfile(result.user, { displayName: form.displayName });

      await setDoc(doc(db, "usuarios", result.user.uid), {
        ...form,
        metodo: "correo",
        fechaRegistro: new Date(),
        completo: true,
      });

      setIsRegister(false);
    } catch (error) {
      alert("No se pudo crear la cuenta.");
    }
  };

  return (
    <div className="login-container">

      {/* BOTÓN MODO OSCURO */}
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === "light" ? "🌙 Modo oscuro" : "☀️ Modo claro"}
      </button>

      <div className="login-card">

        {/* LOGO */}
        <img src="/IMG/logo_MedConnect.jpg" alt="MedConnect" className="logo" />

        <h2 className="title">
          {isRegister ? "Crea tu cuenta ✨" : "Bienvenido de nuevo 👋"}
        </h2>

        <p className="subtitle">
          {isRegister
            ? "Solo te tomará un minuto completar tu registro."
            : "Nos alegra verte de nuevo. Tu salud primero siempre."}
        </p>

        {/* FORM */}
        <form onSubmit={isRegister ? handleRegister : handleEmailLogin} className="form">

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            onBlur={validateEmail}
            required
          />
          {formErrors.email && <p className="microcopy">{formErrors.email}</p>}

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
            onBlur={validatePassword}
            required
          />
          {formErrors.password && <p className="microcopy">{formErrors.password}</p>}

          {/* CAMPOS ADICIONALES EN REGISTRO */}
          {isRegister && (
            <>
              <input
                type="text"
                placeholder="¿Cómo te llamas?"
                value={form.displayName}
                onChange={(e) => updateField("displayName", e.target.value)}
                required
              />
              {formErrors.displayName && <p className="microcopy">{formErrors.displayName}</p>}

              <input
                type="text"
                placeholder="Número de contacto"
                value={form.telefono}
                onChange={(e) => updateField("telefono", e.target.value)}
              />

              <input
                type="text"
                placeholder="Documento de identidad"
                value={form.documento}
                onChange={(e) => updateField("documento", e.target.value)}
              />

              <label className="label">Fecha de nacimiento</label>
              <input
                type="date"
                value={form.nacimiento}
                onChange={(e) => updateField("nacimiento", e.target.value)}
              />

              <select value={form.genero} onChange={(e) => updateField("genero", e.target.value)}>
                <option>Selecciona tu género</option>
                <option>Masculino</option>
                <option>Femenino</option>
                <option>Otro</option>
              </select>

              <input
                type="text"
                placeholder="Dirección actual"
                value={form.direccion}
                onChange={(e) => updateField("direccion", e.target.value)}
              />
            </>
          )}

          <button className="btn-primary">
            {isRegister ? "Crear mi cuenta" : "Ingresar"}
          </button>
        </form>

        {/* GOOGLE LOGIN */}
        {!isRegister && (
          <button className="btn-google" onClick={handleGoogleLogin}>
            <img src="/IMG/google_logo.jpg" className="google-icon" />
            Continuar con Google
          </button>
        )}

        {/* CAMBIAR ENTRE LOGIN / REGISTRO */}
        <p className="switch">
          {isRegister ? (
            <>
              ¿Ya tienes cuenta?{" "}
              <span onClick={() => setIsRegister(false)}>Inicia sesión aquí</span>
            </>
          ) : (
            <>
              ¿Aún no tienes cuenta?{" "}
              <span onClick={() => setIsRegister(true)}>Regístrate gratis</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}