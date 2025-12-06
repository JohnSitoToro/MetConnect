import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RequireCompleteProfile = () => {
  const { user, profile } = useAuth(); // ✅ necesitamos profile

  // Si no hay usuario → login
  if (!user) {
    return <Navigate to="/" />;
  }

  // Si hay usuario pero su perfil está incompleto → bloquear todo
  if (profile && profile.completo === false) {
    return <Navigate to="/profile" />;
  }

  // Si está completo → permitir navegación
  return <Outlet />;
};

export default RequireCompleteProfile;
