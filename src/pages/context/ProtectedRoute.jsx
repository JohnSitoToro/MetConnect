import { useAuth } from "./AuthContext.jsx";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Mientras se verifica el estado de autenticación
  if (loading) return <div>Cargando...</div>;

  // Si no hay usuario autenticado → redirigir al login
  if (!user) return <Navigate to="/" replace />;

  // Si hay usuario, mostrar la página
  return children;
}