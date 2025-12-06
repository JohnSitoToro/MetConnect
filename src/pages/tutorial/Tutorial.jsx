import Header from "../../layout/header/Header.jsx";
import Footer from "../../layout/footer/Footer.jsx";
import "./Tutorial.css";

export default function Tutorial() {
  
  return (
    <>
      <Header />
      <div className="tutorial-container">
        <h2>Tutorial de Uso</h2>

        <p>A continuación encontrarás un video explicativo sobre cómo usar la plataforma.</p>

        <div className="video-wrapper">
          <video controls>
            <source src="/tutorial.mp4" type="video/mp4" />
            Tu navegador no soporta reproducción de video.
          </video>
        </div>
      </div>

      <Footer />
    </>
  );
}