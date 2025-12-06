import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../pages/context/AuthContext.jsx";
import logo from "/IMG/logo_MedConnect.jpg";
import "./Header.css";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // 👇 detecta si estás en /profile
  const isProfilePage = location.pathname === "/profile";

  return (
    <header className={`header ${isProfilePage ? "profile-page" : ""}`}>
      <div className="logo-container">
        <img src={logo} alt="Dulce Fresa" className="logo_H" />
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
          <li><NavLink to="/products">Productos</NavLink></li>
          <li><NavLink to="/cart">Carrito</NavLink></li>
          <li><NavLink to="/about">Sobre Nosotros</NavLink></li>

          {user ? (
            <li>
              <button className="btnClose" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </li>
          ) : (
            <li><NavLink to="/">Iniciar sesión</NavLink></li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;