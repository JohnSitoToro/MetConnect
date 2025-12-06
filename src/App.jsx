import { Routes, Route } from "react-router-dom";

// 🔹 Contextos
import { AuthProvider } from "./pages/context/AuthContext.jsx";
import ProtectedRoute from "./pages/context/ProtectedRoute.jsx";

// 🔹 Páginas
import Login from "./pages/login/Login.jsx";
import Profile from "./pages/profile/Profile.jsx";
import Home from "./pages/home/Home.jsx";
import Appointment from "./pages/appointment/Appointment.jsx";
import History from "./pages/history/History.jsx";
import Tutorial from "./pages/tutorial/Tutorial.jsx";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* 🔹 Página pública */}
        <Route path="/" element={<Login />} />

        {/* 🔹 Página para completar datos */}
        <Route path="/profile" element={<Profile />} />

        {/* 🔒 Páginas protegidas */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointment"
          element={
            <ProtectedRoute>
              <Appointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tutorial"
          element={
            <ProtectedRoute>
              <Tutorial />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
