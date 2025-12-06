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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [documento, setDocumento] = useState("");
  const [nacimiento, setNacimiento] = useState("");
  const [genero, setGenero] = useState("");
  const [direccion, setDireccion] = useState("");
  const [displayName, setDisplayName] = useState("");
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);


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
          completo: false, // ⚠️ importante
        });
      }

      const data = snap.data();

      if (!data?.completo) {
        return navigate("/profile"); // ⚠️ Redirigir a completar datos
      }

      navigate("/home");
    } catch (error) {
      console.error(error);
    }
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

      await setDoc(doc(db, "usuarios", result.user.uid), {
        nombre: displayName,
        email: email,
        telefono,
        documento,
        nacimiento,
        genero,
        direccion,
        metodo: "correo",
        fechaRegistro: new Date(),
        completo: true
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

          {isRegister && (
            <>
              <input type="text" placeholder="Nombre completo" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />

              <input type="text" placeholder="Número de teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} />

              <input type="text" placeholder="Documento de identidad" value={documento} onChange={(e) => setDocumento(e.target.value)} />

              <input type="date" value={nacimiento} onChange={(e) => setNacimiento(e.target.value)} />

              <select value={genero} onChange={(e) => setGenero(e.target.value)}>
                <option>Selecciona tu género</option>
                <option>Masculino</option>
                <option>Femenino</option>
                <option>Otro</option>
              </select>

              <input type="text" placeholder="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
            </>
          )}

          <button className="btn-primary">
            {isRegister ? "Crear cuenta" : "Entrar"}
          </button>
        </form>

        {!isRegister && (
          <button className="btn-google" onClick={handleGoogleLogin}>
            <img src="/IMG/google_logo.jpg" className="google-icon" />
            Continuar con Google
          </button>
        )}

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
