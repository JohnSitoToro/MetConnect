import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./pages/context/ProtectedRoute.jsx";
import { AuthProvider } from "./pages/context/AuthContext.jsx";

import Home from "./pages/home/Home.jsx";
import Login from "./pages/login/Login.jsx";
import Profile from "./pages/profile/Profile.jsx";
import Appointment from "./pages/appointment/Appointment.jsx";
import History from "./pages/history/History.jsx";
import Tutorial from "./pages/tutorial/Tutorial.jsx";
import RequireCompleteProfile from "./pages/profile/RequireCompleteProfile.jsx";
import IncompleteProfileBanner from "./pages/profile/IncompleteProfileBanner.jsx";

export default function App() {
  return (
    <AuthProvider>
      <IncompleteProfileBanner />
      <Routes>

        {/* ✅ Ruta pública */}
        <Route path="/" element={<Login />} />

        {/* ✅ Guard: exige perfil completo */}
        <Route element={<RequireCompleteProfile />}>

          {/* ✅ Todas estas rutas solo funcionan si el perfil está COMPLETO */}
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

        </Route>

        {/* ✅ La ruta profile SIEMPRE accesible */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

      </Routes>
    </AuthProvider>
  );
}