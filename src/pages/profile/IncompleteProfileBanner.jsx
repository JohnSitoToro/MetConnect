import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

export default function IncompleteProfileBanner() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ No mostrar en Login ni Register
  if (location.pathname === "/" || location.pathname === "/login") {
    return null;
  }

  // ✅ Debe estar logueado
  if (!user || !profile) return null;

  // ✅ Debe ser Google + incompleto
  if (profile.metodo !== "google" || profile.completo === true) {
    return null;
  }

  return (
    <div
      style={{
        width: "100%",
        background: "var(--card-color)",
        color: "var(--text-color)",
        borderBottom: "1px solid var(--input-border)",
        padding: "12px",
        textAlign: "center",
        fontWeight: 600,
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 5000,
        cursor: "pointer",
      }}
      onClick={() => navigate("/profile")}
    >
      ⚠️ Debes completar tu perfil antes de continuar.
      <span style={{ color: "var(--primary)", marginLeft: "6px" }}>
        Ir al perfil
      </span>
    </div>
  );
}