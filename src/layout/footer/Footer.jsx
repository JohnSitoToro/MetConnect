import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} MedConnect  | Todos los derechos reservados</p>
      <div className="footer-links">
        <a href="https://www.instagram.com/antonella_dulcefresa?igsh=ZHBlbXl2amNqYWN5" target="_blank" rel="noopener noreferrer">
          <img src="/IMG/instagram.jpg" alt="Instagram" className="footer-icon" />Instagram
        </a>
        <a href="https://www.facebook.com/share/1GiNXnvbnR/" target="_blank" rel="noopener noreferrer">
          <img src="/IMG/facebook.jpg" alt="Instagram" className="footer-icon" />Facebook
        </a>
        <a href="https://wa.me/573108202991" target="_blank" rel="noopener noreferrer">
          <img src="/IMG/whatsapp.jpg" alt="Instagram" className="footer-icon" />WhatsApp
        </a>
      </div>
    </footer>
  );
}

export default Footer;