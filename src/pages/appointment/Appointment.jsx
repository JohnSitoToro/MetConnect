import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "/firebase.config.js";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext.jsx";

import Header from "../../layout/header/Header.jsx";
import Footer from "../../layout/footer/Footer.jsx";
import "./Appointment.css";

export default function Appointment() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [doctor, setDoctor] = useState("");
  const [estado, setEstado] = useState("Pendiente");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [servicio, setServicio] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!doctor || !fecha || !hora || !servicio) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "citas"), {
        doctor,
        estado,
        fecha,
        hora,
        servicio,
        usuarioId: user.uid, // 🔹 Guarda usuario
        creadoEn: serverTimestamp(),
      });

      alert("✅ Cita agendada correctamente.");
      setDoctor("");
      setEstado("Pendiente");
      setFecha("");
      setHora("");
      setServicio("");

      navigate("/history");
    } catch (error) {
      console.error(error);
      alert("❌ Error al agendar la cita. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="appointment-container">
        <h1>Agendar Nueva Cita</h1>

        <form className="appointment-form" onSubmit={handleSubmit}>
          <label>Doctor</label>
          <input
            type="text"
            placeholder="Nombre del doctor"
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
          />

          <label>Estado</label>
          <input
            type="text"
            placeholder="Pendiente / Confirmada / Cancelada"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
          />

          <label>Fecha</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />

          <label>Hora</label>
          <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
          />

          <label>Servicio</label>
          <input
            type="text"
            placeholder="Consulta médica, Telemedicina, etc."
            value={servicio}
            onChange={(e) => setServicio(e.target.value)}
          />

          <button className="btn-primary" disabled={loading}>
            {loading ? "Agendando..." : "Agendar cita"}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}
