import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./pages/context/AuthContext.jsx";
import ProtectedRoute from "./pages/context/ProtectedRoute.jsx";

import Home from "./pages/home/Home.jsx";
import Login from "./pages/login/Login.jsx"; 
import Products from "./pages/products/Products.jsx";
import Profile from "./pages/profile/Profile.jsx";
import Cart from "./pages/cart/Cart.jsx";
import About from "./pages/about/About.jsx";

import "./App.css";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* 🔹 Página pública */}
        <Route path="/" element={<Login />} />

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
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}