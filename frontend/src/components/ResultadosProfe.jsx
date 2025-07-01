import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom';

export default function ResultadosProfe() {
  const { user } = useUser();
  const [ensayos, setEnsayos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ensayoSeleccionado, setEnsayoSeleccionado] = useState(null);
  const [resultados, setResultados] = useState([]);

  // Cargar ensayos del profesor
  useEffect(() => {
    if (!user) return;

    fetch(`/api/ensayos?profesorId=${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          setEnsayos(data.ensayos);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [user]);

  // Cargar resultados de un ensayo específico
  const cargarResultados = (ensayoId) => {
    setIsLoading(true);
    fetch(`/api/ensayos/${ensayoId}/resultados`)
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          setEnsayoSeleccionado(ensayos.find(e => e.id === ensayoId));
          setResultados(data.resultados);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  if (isLoading && ensayos.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <p>Cargando ensayos...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">Mis Ensayos</h2>
      
      {ensayoSeleccionado ? (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-indigo-600">
              Resultados del ensayo: {ensayoSeleccionado.titulo}
            </h3>
            <button
              onClick={() => setEnsayoSeleccionado(null)}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              ← Volver a la lista
            </button>
          </div>

          {resultados.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-4 border-b text-left">Alumno</th>
                    <th className="py-3 px-4 border-b text-left">Puntaje</th>
                    <th className="py-3 px-4 border-b text-left">Tiempo empleado</th>
                    <th className="py-3 px-4 border-b text-left">Fecha</th>
                    <th className="py-3 px-4 border-b text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {resultados.map((resultado) => (
                    <tr key={`${resultado.ensayo_id}-${resultado.alumno_id}`} className="hover:bg-gray-50">
                      <td className="py-3 px-4 border-b">
                        {resultado.alumno_nombre || `Alumno #${resultado.alumno_id}`}
                      </td>
                      <td className="py-3 px-4 border-b">
                        {resultado.puntaje} / {resultado.total_preguntas}
                      </td>
                      <td className="py-3 px-4 border-b">
                        {resultado.tiempo_empleado ? `${Math.floor(resultado.tiempo_empleado / 60)}m ${resultado.tiempo_empleado % 60}s` : 'N/A'}
                      </td>
                      <td className="py-3 px-4 border-b">
                        {new Date(resultado.fecha_completado).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 border-b">
                        <Link
                          to={`/resultado-detalle/${resultado.ensayo_id}?alumnoId=${resultado.alumno_id}`}
                          className="text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          Ver detalles
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 italic">Ningún alumno ha completado este ensayo aún.</p>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-indigo-600 mb-4">Lista de Ensayos</h3>
          
          {ensayos.length > 0 ? (
            <ul className="space-y-4">
              {ensayos.map((ensayo) => (
                <li key={ensayo.id} className="border-b border-gray-200 pb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-lg">{ensayo.titulo}</h4>
                      <p className="text-gray-600">{ensayo.materia} - {ensayo.tiempo_limite} minutos</p>
                      <p className="text-sm text-gray-500">
                        Creado el {new Date(ensayo.fecha_creacion).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => cargarResultados(ensayo.id)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                      >
                        Ver resultados
                      </button>
                      <Link
                        to={`/ensayo/${ensayo.id}/editar`}
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
                      >
                        Editar
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No has creado ningún ensayo aún.</p>
          )}
        </div>
      )}
    </div>
  );
}