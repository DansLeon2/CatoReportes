import { Stethoscope } from "lucide-react";

export default function TarjetaCitaMedica({
  datos,
  actualizarDatos,
}: {
  datos: any;
  actualizarDatos: (d: any) => void;
}) {
  const sintomasSeleccionados = datos.sintomasSeleccionados || [];
  const diagnosticoPreliminar = datos.diagnosticoPreliminar || "";
  const prioridad = datos.prioridad || "";
  const requiereAsistencia = datos.requiereAsistencia || false;

  const handleToggleSintoma = (opcion: string) => {
    if (sintomasSeleccionados.includes(opcion)) {
      actualizarDatos({
        sintomasSeleccionados: sintomasSeleccionados.filter(
          (item: string) => item !== opcion,
        ),
      });
    } else {
      actualizarDatos({
        sintomasSeleccionados: [...sintomasSeleccionados, opcion],
      });
    }
  };

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-bold text-red-600 uppercase flex items-center gap-2">
          <div className="w-1 h-4 bg-red-600 rounded-full"></div> Detalles de la
          Cita Médica
        </h2>
        <Stethoscope size={18} className="text-gray-300" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div className="flex flex-col justify-between">
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase mb-3 block">
              Motivo de Consulta / Síntomas
            </label>
            <div className="space-y-2">
              {["Dolor General", "Fiebre / Malestar", "Revisión de Rutina"].map(
                (opcion) => (
                  <label
                    key={opcion}
                    className={`flex items-center gap-3 p-2.5 cursor-pointer rounded-lg border transition-all text-sm
                    ${sintomasSeleccionados.includes(opcion) ? "border-red-600 bg-red-50 text-red-700 font-bold" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}
                  >
                    <input
                      type="checkbox"
                      checked={sintomasSeleccionados.includes(opcion)}
                      onChange={() => handleToggleSintoma(opcion)}
                      className="w-4 h-4 accent-red-600 rounded"
                    />
                    {opcion}
                  </label>
                ),
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex flex-col md:flex-row justify-between gap-4 items-center">
            <div className="w-full md:w-auto">
              <label className="text-xs font-bold text-gray-400 uppercase block mb-3">
                Prioridad de Atención
              </label>
              <div className="flex flex-wrap gap-2">
                {["Alta", "Media", "Baja"].map((nivel) => (
                  <button
                    key={nivel}
                    onClick={() =>
                      actualizarDatos({
                        prioridad: prioridad === nivel ? "" : nivel,
                      })
                    }
                    className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                      prioridad === nivel
                        ? "bg-red-600 border-red-600 text-white shadow-sm"
                        : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    {nivel}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors w-full md:w-fit">
              <input
                type="checkbox"
                checked={requiereAsistencia}
                onChange={(
                  e: any, // Corregido el 'e' implícito agregando ': any'
                ) => actualizarDatos({ requiereAsistencia: e.target.checked })}
                className="w-5 h-5 accent-red-600 rounded cursor-pointer"
              />
              <span className="text-sm font-bold text-gray-700">
                ¿Silla de ruedas?
              </span>
            </label>
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-[11px] font-bold text-gray-500 uppercase mb-3 block">
            Diagnóstico Preliminar y Notas
          </label>
          <textarea
            value={diagnosticoPreliminar}
            onChange={(e: any) =>
              actualizarDatos({ diagnosticoPreliminar: e.target.value })
            } // Corregido
            placeholder="Anota alergias conocidas, medicamentos actuales..."
            className="w-full flex-grow p-3 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500/20 resize-none bg-white min-h-[120px]"
          />
        </div>
      </div>
    </section>
  );
}
