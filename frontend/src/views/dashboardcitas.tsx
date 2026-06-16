import { useState } from "react";
import TarjetaCitaMedica from "../components/tarjetamedica";

export default function DashboardCitas() {
  // Estado expandido con datos complejos del Paciente y de la Cita
  const [datosCita, setDatosCita] = useState({
    // Datos del Paciente
    identificacion: "",
    nombreCompleto: "",
    fechaNacimiento: "",
    genero: "",
    telefono: "",
    // Datos médicos
    sintomasSeleccionados: [],
    diagnosticoPreliminar: "",
    prioridad: "",
    requiereAsistencia: false,
  });

  const actualizarDatosCita = (nuevosDatos: any) => {
    setDatosCita((prev: any) => ({ ...prev, ...nuevosDatos }));
  };

  const guardarCita = async () => {
    // Validación básica antes de enviar
    if (
      !datosCita.identificacion ||
      !datosCita.nombreCompleto ||
      !datosCita.fechaNacimiento
    ) {
      alert("Por favor, complete los datos principales del paciente.");
      return;
    }

    try {
      const respuesta = await fetch("/api/citas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosCita),
      });

      if (respuesta.ok) {
        alert("Paciente y Cita Médica registrados con éxito.");
        // Limpiar formulario completo
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
      console.error("Error de red:", error);
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

        {/* SECCIÓN NUEVA: DATOS PERSONALES DEL PACIENTE */}
        <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-sm font-bold text-gray-700 uppercase mb-4 flex items-center gap-2">
            <div className="w-1 h-4 bg-gray-400 rounded-full"></div> 1. Datos
            del Paciente
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

        {/* COMPONENTE DE DETALLES CLÍNICOS (Tu Tarjeta Adaptada) */}
        <TarjetaCitaMedica
          datos={datosCita}
          actualizarDatos={actualizarDatosCita}
        />
      </div>
    </div>
  );
}
