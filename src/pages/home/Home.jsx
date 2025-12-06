import "./Home.css";
import Header from "../../layout/header/Header.jsx";
import Footer from "../../layout/footer/Footer.jsx";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../../pages/context/ThemeContext.jsx";
import "../context/ThemeContext.css";

function Home() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <>
      <Header />
      <div className="home-container">
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? "🌙 Modo oscuro" : "☀️ Modo claro"}
        </button>
        {/* Sección Hero */}
        <section className="hero">
          <div className="hero-text">
            <h1>Bienvenido a <span>MedConnect</span></h1>
            <p>
              La plataforma médica que conecta pacientes, doctores y servicios de salud
              de manera rápida, segura y moderna. Reserva tus citas,
              revisa tu historial y mantén el control de tu bienestar desde un solo lugar.
            </p>
            <button className="btn-primary" onClick={() => navigate("/appointment")}>
              Reservar una cita 🩺
            </button>
          </div>

          <img src="/IMG/doctor_hero.jpg" alt="MedConnect Atención Médica" className="hero-img" />
        </section>

        {/* Sección Servicios */}
        <section className="services">
          <h2>Servicios que ofrecemos</h2>

          <div className="service-list">
            <div className="service-card">
              <img src="/IMG/consulta_medica.jpg" alt="Consulta médica" />
              <h3>Consultas Médicas</h3>
              <p>Agenda con especialistas certificados en múltiples áreas de la salud.</p>
            </div>

            <div className="service-card">
              <img src="/IMG/historial_clinico.jpg" alt="Historial clínico" />
              <h3>Historial Clínico</h3>
              <p>Accede a tus antecedentes médicos y resultados en cualquier momento.</p>
            </div>

            <div className="service-card">
              <img src="/IMG/telemedicina.jpg" alt="Telemedicina" />
              <h3>Telemedicina</h3>
              <p>Realiza consultas virtuales desde tu hogar de forma segura.</p>
            </div>
          </div>
        </section>

        {/* Sección Misión */}
        <section className="mission">
          <img src="/IMG/personal_medico.jpg" alt="Equipo médico" className="img-mission" />
          <div className="mission-text">
            <h2>Nuestra misión</h2>
            <p>
              En MedConnect creemos en un sistema de salud accesible, humano y eficiente.
              Trabajamos para mejorar la experiencia de atención médica mediante la tecnología,
              conectando a las personas con los profesionales adecuados cuando más lo necesitan.
            </p>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
}

export default Home;