import { useState, useEffect } from "react";
import PropTypes from "prop-types";

function CursosSincronizados({ profesorId }) {
  const [data, setData] = useState({ cursos: [] }); 
  const [loading, setLoading] = useState(false);

  const fetchCursos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/api/classroom/sync-cursos/${profesorId}`);
      const json = await res.json();
      setData(json?.cursos ? { ...json, cursos: json.cursos } : { cursos: [] });
    } catch (error) {
      console.error("Error al sincronizar cursos:", error);
      setData({ cursos: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCursos();
  }, [profesorId]);

  const cursos = data?.cursos || [];

  if (loading && cursos.length === 0) {
    return (
      <div className="p-8 bg-white shadow-md rounded-2xl flex flex-col items-center justify-center min-h-[300px] text-center">
        <div
          className="w-12 h-12 border-4 border-indigo-500 border-b-transparent rounded-full animate-spin mb-4"
          aria-hidden="true" 
        />
        <output className="text-lg font-medium text-gray-700">
          Sincronizando cursos...
        </output>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-2xl space-y-6">
      <div className="flex justify-between items-center border-b pb-3">
        <h2 className="text-2xl font-semibold text-gray-800">
          {data?.mensaje || "Cursos sincronizados"}
        </h2>
        <button
          onClick={fetchCursos}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition-all ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          <span className={`inline-block transition-transform ${loading ? "animate-spin" : ""}`}>
            🔄
          </span>
          {loading ? "Sincronizando..." : "Sincronizar"}
        </button>
      </div>

      <div className="space-y-4">
        {cursos.length > 0 ? (
          cursos.map((curso) => (
            <div
              key={curso.id}
              className="border border-indigo-100 rounded-xl p-5 shadow-sm bg-indigo-50 hover:shadow-md transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-indigo-800">
                    {curso.name}
                  </h3>
                  <p className="text-sm text-gray-600">ID: {curso.id}</p>
                </div>
              </div>

              <div className="mt-3">
                <h4 className="font-medium text-gray-700 mb-1">Alumnos:</h4>
                {curso.alumnos?.length > 0 ? (
                  <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                    {curso.alumnos.map((al) => (
                      <li key={al.id}>
                        <span className="font-medium">{al.nombre}</span>{" "}
                        <span className="text-gray-500 text-xs">({al.email})</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm italic">
                    No hay alumnos inscritos
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm italic">No hay cursos sincronizados</p>
        )}
      </div>
    </div>
  );
}

CursosSincronizados.propTypes = {
  profesorId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired
};

export default CursosSincronizados;