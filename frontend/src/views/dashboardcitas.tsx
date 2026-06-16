import { useState } from "react";
import TarjetaCitaMedica from "../components/tarjetamedica";
import axios from "axios";

export default function DashboardCitas() {
  const [datosCita, setDatosCita] = useState({
    identificacion: "",
    nombreCompleto: "",
    fechaNacimiento: "",
    genero: "",
    telefono: "",
    sintomasSeleccionados: [],
    diagnosticoPreliminar: "",
    prioridad: "",
    requiereAsistencia: false,
  });

  const actualizarDatosCita = (nuevosDatos: any) => {
    setDatosCita((prev: any) => ({ ...prev, ...nuevosDatos }));
  };

  const guardarCita = async () => {
    if (
      !datosCita.identificacion ||
      !datosCita.nombreCompleto ||
      !datosCita.fechaNacimiento
    ) {
      alert("Por favor, complete los datos principales del paciente.");
      return;
    }

    try {
      // Apuntando directo al puerto 5000 donde corre tu servidor Node.js
      const respuesta = await axios.post("http://localhost:5000/api/citas", datosCita);

      if (respuesta.status === 200 || respuesta.status === 201) {
        alert("Paciente y Cita Médica registrados con éxito.");
        setDatosCita({
          identificacion: "",
          nombreCompleto: "",
          fechaNacimiento: "",
          genero: "",
          telefono: "",
          sintomasSeleccionados: [],
          diagnosticoPreliminar: "",
          prioridad: "",
          requiereAsistencia: false,
        });
      } else {
        alert("Error al registrar la cita médica.");
      }
    } catch (error) {
      console.error("Error de red al conectar con el backend:", error);
      alert("No se pudo conectar con el servidor backend. Asegúrate de que el backend esté corriendo en el puerto 5000.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* ENCABEZADO */}
        <header className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Admisión y Citas Médicas
            </h1>
            <p className="text-sm text-gray-500">
              Registro unificado de pacientes e historial de triage
            </p>
          </div>
          <button
            onClick={guardarCita}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors shadow-sm w-full sm:w-auto"
          >
            Registrar Paciente y Cita
          </button>
        </header>

        {/* 1. DATOS DEL PACIENTE */}
        <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-sm font-bold text-gray-700 uppercase mb-4 flex items-center gap-2">
            <div className="w-1 h-4 bg-gray-400 rounded-full"></div> 1. Datos del Paciente
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">
                Identificación (Cédula/DNI)
              </label>
              <input
                type="text"
                value={datosCita.identificacion}
                onChange={(e) =>
                  actualizarDatosCita({ identificacion: e.target.value })
                }
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-red-500"
                placeholder="Ej. 1725489630"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">
                Nombre Completo
              </label>
              <input
                type="text"
                value={datosCita.nombreCompleto}
                onChange={(e) =>
                  actualizarDatosCita({ nombreCompleto: e.target.value })
                }
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-red-500"
                placeholder="Ej. Juan Pérez López"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                value={datosCita.fechaNacimiento}
                onChange={(e) =>
                  actualizarDatosCita({ fechaNacimiento: e.target.value })
                }
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">
                Teléfono de Contacto
              </label>
              <input
                type="text"
                value={datosCita.telefono}
                onChange={(e) =>
                  actualizarDatosCita({ telefono: e.target.value })
                }
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-red-500"
                placeholder="Ej. 0998877665"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">
                Género
              </label>
              <div className="flex gap-4 mt-1">
                {["Masculino", "Femenino", "Otro"].map((g) => (
                  <label
                    key={g}
                    className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="genero"
                      checked={datosCita.genero === g}
                      onChange={() => actualizarDatosCita({ genero: g })}
                      className="w-4 h-4 accent-red-600"
                    />
                    {g}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 2. SÍNTOMAS Y PRIORIDAD (Componente Adaptado) */}
        <TarjetaCitaMedica
          datos={datosCita}
          actualizarDatos={actualizarDatosCita}
        />
      </div>
    </div>
  );
}