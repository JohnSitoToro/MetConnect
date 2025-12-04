import { useState, useEffect, useRef } from "react";
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

const TRANSITION_MS = 400;
const AUTOPLAY_MS = 2000;

export default function LoginPage() {
  const images = [
    "/IMG/tp_vasos.jpg",
    "/IMG/vaso.jpg",
    "/IMG/tp_vasos_2.jpg",
    "/IMG/vasos.jpg",
    "/IMG/fresa.jpg",
  ];
  const extendedImages = [...images, images[0]];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const slideRef = useRef(null);
  const navigate = useNavigate();

  // ---------------------------
  // 🔹 LOGIN con Google
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(
        doc(db, "users", user.uid),
        {
          nombre: user.displayName,
          email: user.email,
          foto: user.photoURL || null,
          metodo: "google",
          fechaRegistro: new Date(),
        },
        { merge: true }
      );

      alert(`Bienvenido, ${user.displayName} 🍓`);
      navigate("/home");
    } catch (error) {
      // Si el usuario cierra el popup o cancela el inicio, no hacemos nada
      if (error.code === "auth/popup-closed-by-user") return;
      if (error.code === "auth/cancelled-popup-request") return;

      // Solo mostramos alerta si realmente hubo un error inesperado
      console.error("Error al iniciar sesión con Google:", error.code, error.message);
      alert("Hubo un error al iniciar sesión con Google.");
    }
  };

  // 🔹 LOGIN con correo
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Inicio de sesión exitoso 🍰");
      navigate("/home");
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error.code, error.message);
      alert("Correo o contraseña incorrectos.");
    }
  };

  // 🔹 REGISTRO con correo
  const handleRegister = async (e) => {
    e.preventDefault();

    // ✅ Validación previa
    if (!displayName.trim()) {
      alert("Por favor ingresa tu nombre completo.");
      return;
    }
    if (!email.trim()) {
      alert("El correo electrónico es obligatorio.");
      return;
    }
    if (password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      // 🔸 Crear usuario en Firebase Authentication
      const result = await createUserWithEmailAndPassword(auth, email, password);

      // 🔸 Actualizar el perfil con el nombre
      await updateProfile(result.user, { displayName });

      // 🔸 Guardar los datos en Firestore
      await setDoc(doc(db, "users", result.user.uid), {
        nombre: displayName,
        email: email,
        metodo: "correo",
        fechaRegistro: new Date(),
      });

      console.log("Usuario creado correctamente:", result.user.uid);

      alert("Cuenta creada con éxito 🎉");
      setIsRegister(false);
    } catch (error) {
      console.error("Error al crear cuenta:", error.code, error.message);

      // 🔸 Mensajes personalizados
      let mensaje = "No se pudo crear la cuenta. Verifica los datos ingresados.";
      if (error.code === "auth/email-already-in-use")
        mensaje = "Este correo ya está registrado. Intenta iniciar sesión.";
      else if (error.code === "auth/invalid-email")
        mensaje = "El formato del correo no es válido.";
      else if (error.code === "auth/weak-password")
        mensaje = "La contraseña debe tener al menos 6 caracteres.";
      else if (error.code === "auth/network-request-failed")
        mensaje = "Error de conexión. Verifica tu red e inténtalo de nuevo.";

      alert(mensaje);
    }
  };

  // ---------------------------
  // Carrusel automático
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
      setIsTransitioning(true);
    }, AUTOPLAY_MS);
    return () => clearInterval(interval);
  }, []);

  const handleTransitionEnd = () => {
    if (currentIndex === extendedImages.length - 1) {
      setIsTransitioning(false);
      setCurrentIndex(0);
    }
  };

  useEffect(() => {
    if (!isTransitioning) {
      const id = setTimeout(() => setIsTransitioning(true), 20);
      return () => clearTimeout(id);
    }
  }, [isTransitioning]);

  // ---------------------------
  return (
    <div className="contenedor">
      <div className="lado-izquierdo">
        <img src="/IMG/logo.jpg" alt="Logo" className="logo" />
        <h2>Dulzura moderna, simple y elegante.</h2>

        <form
          className="formulario"
          onSubmit={isRegister ? handleRegister : handleEmailLogin}
        >
          {isRegister && (
            <input
              type="text"
              placeholder="Nombre completo"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
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

          <button type="submit" className="btn-principal">
            {isRegister ? "Crear cuenta" : "Iniciar sesión"}
          </button>
        </form>

        <button className="btn-google" onClick={handleGoogleLogin}>
          <img
            src="/IMG/google_logo.jpg"
            alt="Google"
            className="icono-google"
          />
          Iniciar con Google
        </button>

        <p className="alternar">
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

      <div className="lado-derecho">
        <h1 className="aviso-domicilios">
          🚚 Servicio de domicilios disponible <br /> solo en Buga y Cali 🍓
        </h1>
        <div className="carrusel">
          <div
            className="slides"
            ref={slideRef}
            onTransitionEnd={handleTransitionEnd}
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              transition: isTransitioning
                ? `transform ${TRANSITION_MS}ms ease-in-out`
                : "none",
            }}
          >
            {extendedImages.map((src, i) => (
              <div className="slide" key={i}>
                <img src={src} alt={`Slide ${i}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}