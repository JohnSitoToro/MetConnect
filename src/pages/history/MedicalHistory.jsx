import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../../../firebase.config";
import { useAuth } from "../context/AuthContext";
import "./MedicalHistory.css";

import Header from "../../layout/header/Header.jsx";
import Footer from "../../layout/footer/Footer.jsx";

export default function MedicalHistory() {
  const { user } = useAuth();
  const [citas, setCitas] = useState([]);
  

  useEffect(() => {
    if (!user) return;

    // Escuchar citas del usuario
    const q = query(
      collection(db, "citas"),
      where("uid", "==", user.uid),
      orderBy("fecha", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCitas(data);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <>
      <Header />
      <div className="medical-history">
        <h2>Historial Médico</h2>

        {citas.length === 0 ? (
          <p>No tienes citas registradas aún.</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Motivo</th>
                <th>Doctor</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {citas.map((cita) => (
                <tr key={cita.id}>
                  <td>{cita.fecha}</td>
                  <td>{cita.hora}</td>
                  <td>{cita.motivo}</td>
                  <td>{cita.doctor}</td>
                  <td>{cita.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Footer />
    </>
  );
}
