import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../pages/context/AuthContext.jsx";
import logo from "/IMG/logo_MedConnect.jpg";
import "./Header.css";
import { useContext } from "react";
import { ThemeContext } from "../../pages/context/ThemeContext.jsx";
import "../../pages/context/ThemeContext.css";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // 👇 detecta si estás en /profile
  const isProfilePage = location.pathname === "/profile";

  return (
    <header className={`header ${isProfilePage ? "profile-page" : ""}`}>
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo_H" />
      </div>

      <nav>
        <ul className="nav-list">
          {user && (
            <li>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive ? "btn-profile active" : "btn-profile"
                }
              >
                <h2 className="user">
                  Hola, {user.displayName ? user.displayName : user.email.split("@")[0]}!
                </h2>
              </NavLink>
            </li>
          )}

          <li><NavLink to="/home">Inicio</NavLink></li>
          <li><NavLink to="/appointment">Agendar Citas</NavLink></li>
          <li><NavLink to="/history">Historial Medico</NavLink></li>
          <li><NavLink to="/tutorial">Tutorial</NavLink></li>

          {user ? (
            <li>
              <button className="btnClose" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </li>
          ) : (
            <li><NavLink to="/">Iniciar sesión</NavLink></li>
          )}

          <li>
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === "light" ? "🌙 Modo Oscuro" : "☀️ Modo Claro"}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;