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
  const [meetLink, setMeetLink] = useState("");

  const isIncomplete = !doctor || !fecha || !hora || !servicio;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isIncomplete) {
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
        meetLink,
        usuarioId: user.uid,
        creadoEn: serverTimestamp(),
      });

      alert("✅ Cita agendada correctamente.");

      setDoctor("");
      setEstado("Pendiente");
      setFecha("");
      setHora("");
      setServicio("");
      setMeetLink("");

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

        {isIncomplete && (
          <p className="progress-reminder">
            ⚠️ ¡Formulario incompleto! Completa todos los campos para continuar.
          </p>
        )}

        <form className="appointment-form" onSubmit={handleSubmit}>
          {/* DOCTOR */}
          <label>Doctor</label>
          <input
            type="text"
            placeholder="Ej. Dr. Juan Pérez"
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
          />
          <small>Ingresa el nombre del médico.</small>

          {/* ESTADO */}
          <label>Estado</label>
          <input
            type="text"
            value={estado}
            disabled
          />
          <small>Este campo se establece automáticamente como Pendiente.</small>

          {/* FECHA */}
          <label>Fecha</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
          <small>Selecciona la fecha deseada.</small>

          {/* HORA */}
          <label>Hora</label>
          <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
          />
          <small>Elige la hora más conveniente.</small>

          {/* SERVICIO (SELECT) */}
          <label>Servicio</label>
          <select
            value={servicio}
            onChange={(e) => setServicio(e.target.value)}
          >
            <option value="">Selecciona un servicio</option>
            <option value="Consulta general">Consulta general</option>
            <option value="Telemedicina">Telemedicina</option>
            <option value="Pediatría">Pediatría</option>
            <option value="Odontología">Odontología</option>
            <option value="Psicología">Psicología</option>
            <option value="Laboratorio clínico">Laboratorio clínico</option>
          </select>
          <small>Escoge el tipo de atención que necesitas.</small>

          {/* BOTÓN */}
          <button className="btn-primary" disabled={loading}>
            {loading ? "Agendando..." : "Agendar cita"}
          </button>
        </form>
        {/* VIDEOLLAMADA POR MEET */}
        <label>Videollamada (opcional)</label>

        <div className="meet-box">
          <button
            type="button"
            className="btn-meet"
            onClick={() => setMeetLink("https://meet.google.com/new")}
          >
            Generar enlace de Google Meet
          </button>

          <input
            type="text"
            placeholder="Enlace de videollamada"
            value={meetLink}
            readOnly
          />
        </div>

        <small>Si deseas una cita virtual, genera y comparte el enlace de Google Meet.</small>
      </div>
      <Footer />
    </>
  );
}