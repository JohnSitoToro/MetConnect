import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, provider } from "/firebase.config.js";

import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import { doc, setDoc } from "firebase/firestore";
import "./Login.css";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";
import "../context/ThemeContext.css";


export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);


  // LOGIN con Google
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(
        doc(db, "users", user.uid),
        {
          nombre: user.displayName,
          email: user.email,
          metodo: "google",
          fechaRegistro: new Date(),
        },
        { merge: true }
      );

      navigate("/home");
    } catch (error) {}
  };

  // LOGIN con correo
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (error) {
      alert("Correo o contraseña incorrectos.");
    }
  };

  // REGISTRO con correo
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!displayName.trim()) {
      alert("Por favor ingresa tu nombre.");
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(result.user, { displayName });

      await setDoc(doc(db, "users", result.user.uid), {
        nombre: displayName,
        email: email,
        metodo: "correo",
        fechaRegistro: new Date(),
      });

      setIsRegister(false);
    } catch (error) {
      alert("No se pudo crear la cuenta.");
    }
  };

  return (
    <div className="login-container">
       <button className="theme-toggle" onClick={toggleTheme}>
        {theme === "light" ? "🌙 Modo oscuro" : "☀️ Modo claro"}
      </button>
      <div className="login-card">
        <img src="/IMG/logo_MedConnect.jpg" alt="MedConnect" className="logo" />

        <h2 className="title">
          {isRegister ? "Crear cuenta" : "Iniciar sesión"}
        </h2>

        <form
          className="form"
          onSubmit={isRegister ? handleRegister : handleEmailLogin}
        >
          {isRegister && (
            <input
              type="text"
              placeholder="Nombre completo"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          )}

          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="btn-primary">
            {isRegister ? "Crear cuenta" : "Entrar"}
          </button>
        </form>

        <button className="btn-google" onClick={handleGoogleLogin}>
          <img src="/IMG/google_logo.jpg" className="google-icon" />
          Continuar con Google
        </button>

        <p className="switch">
          {isRegister ? (
            <>
              ¿Ya tienes cuenta?{" "}
              <span onClick={() => setIsRegister(false)}>Inicia sesión</span>
            </>
          ) : (
            <>
              ¿No tienes cuenta?{" "}
              <span onClick={() => setIsRegister(true)}>Regístrate</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
