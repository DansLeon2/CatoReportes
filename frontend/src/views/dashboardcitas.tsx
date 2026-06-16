import { useState } from "react";
import TarjetaCitaMedica from "../components/tarjetamedica"; // Corregida la ruta a components y minúsculas

export default function DashboardCitas() {
  const [datosCita, setDatosCita] = useState({
    pacienteId: "",
    sintomasSeleccionados: [],
    diagnosticoPreliminar: "",
    prioridad: "",
    requiereAsistencia: false,
  });

  const actualizarDatosCita = (nuevosDatos: any) => {
    // Corregido el error de 'prev' agregándole ': any'
    setDatosCita((prev: any) => ({ ...prev, ...nuevosDatos }));
  };

  const guardarCita = async () => {
    try {
      const respuesta = await fetch("/api/citas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosCita),
      });

      if (respuesta.ok) {
        alert("Cita médica registrada con éxito en el sistema.");
        setDatosCita({
          pacienteId: "",
          sintomasSeleccionados: [],
          diagnosticoPreliminar: "",
          prioridad: "",
          requiereAsistencia: false,
        });
      } else {
        alert("Error al registrar la cita.");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Sistema de Citas Médicas
            </h1>
            <p className="text-sm text-gray-500">Módulo de Registro y Triage</p>
          </div>
          <button
            onClick={guardarCita}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-sm"
          >
            Registrar Cita
          </button>
        </header>

        <TarjetaCitaMedica
          datos={datosCita}
          actualizarDatos={actualizarDatosCita}
        />
      </div>
    </div>
  );
}
