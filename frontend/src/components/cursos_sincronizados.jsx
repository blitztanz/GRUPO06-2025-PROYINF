import { useState, useEffect } from "react";

function CursosSincronizados({ profesorId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCursos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/api/classroom/sync-cursos/${profesorId}`);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Error al sincronizar cursos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCursos();
  }, [profesorId]);

  if (!data) return <p>Cargando...</p>;

  return (
    <div className="p-6 bg-white shadow rounded">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{data.mensaje}</h2>
        <button
          onClick={fetchCursos}
          disabled={loading}
          className={`px-3 py-1 rounded text-white transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Sincronizando..." : "🔄 Sincronizar"}
        </button>
      </div>

      {data.cursos.map(curso => (
        <div
          key={curso.id}
          className="mb-6 border border-gray-200 rounded-lg p-4 shadow-sm bg-indigo-50"
        >
          <h3 className="text-lg font-semibold text-indigo-800">
            {curso.name} {curso.section && `(${curso.section})`}
          </h3>
          <p className="text-sm text-gray-600">ID: {curso.id}</p>

          <h4 className="mt-2 font-medium">Alumnos:</h4>
          {curso.alumnos?.length > 0 ? (
            <ul className="list-disc ml-6">
              {curso.alumnos.map(al => (
                <li key={al.id}>
                  {al.nombre} <span className="text-gray-500">({al.email})</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No hay alumnos inscritos</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default CursosSincronizados;
