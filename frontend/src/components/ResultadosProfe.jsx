import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom';

export default function ResultadosProfe() {
  const { user } = useUser();
  const [ensayos, setEnsayos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ensayoSeleccionado, setEnsayoSeleccionado] = useState(null);
  const [resultados, setResultados] = useState([]);
  const [preguntas, setPreguntas] = useState([]);
  const [vista, setVista] = useState('');
  const [alumnosPregunta, setAlumnosPregunta] = useState([]);
  const [tituloAlumnos, setTituloAlumnos] = useState('');

  // Cargar ensayos del profesor
  useEffect(() => {
    if (!user) return;

    fetch(`/api/ensayos?profesorId=${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.ok) setEnsayos(data.ensayos);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [user]);

  // Cargar resultados de un ensayo
  const cargarResultados = (ensayoId) => {
    setIsLoading(true);
    fetch(`/api/ensayos/${ensayoId}/resultados`)
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          const ensayo = ensayos.find(e => e.id === ensayoId);
          setEnsayoSeleccionado(ensayo);
          setResultados(data.resultados);
          setVista('resultados');
          setPreguntas([]);
          setAlumnosPregunta([]);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  // Cargar preguntas de un ensayo
  const cargarPreguntas = (ensayoId) => {
    setIsLoading(true);
    fetch(`/api/ensayos/${ensayoId}/preguntas-respuestas-global`)
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          const ensayo = ensayos.find(e => e.id === ensayoId);
          setEnsayoSeleccionado(ensayo);
          setPreguntas(data.preguntas);
          setVista('preguntas');
          setResultados([]);
          setAlumnosPregunta([]);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  // Cargar alumnos que respondieron correcta/incorrectamente
  const cargarAlumnosPregunta = (preguntaId, correcta) => {
    if (!ensayoSeleccionado?.id) return;

    setIsLoading(true);
    fetch(`/api/ensayos/${ensayoSeleccionado.id}/preguntas/${preguntaId}/alumnos?correcta=${correcta}`)
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          setAlumnosPregunta(data.alumnos);
          setTituloAlumnos(correcta ? 'Alumnos que respondieron CORRECTAMENTE' : 'Alumnos que respondieron INCORRECTAMENTE');
          setVista('alumnos');
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  const volverAPreguntas = () => {
    setVista('preguntas');
    setAlumnosPregunta([]);
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
              {vista === 'resultados' && `Resultados del ensayo: ${ensayoSeleccionado.titulo}`}
              {vista === 'preguntas' && `Preguntas del ensayo: ${ensayoSeleccionado.titulo}`}
              {vista === 'alumnos' && ensayoSeleccionado.titulo}
            </h3>
            <div className="flex space-x-2">
              {vista === 'alumnos' && (
                <button
                  onClick={volverAPreguntas}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                >
                  ← Volver a preguntas
                </button>
              )}
              <button
                onClick={() => {
                  setEnsayoSeleccionado(null);
                  setVista('');
                  setResultados([]);
                  setPreguntas([]);
                  setAlumnosPregunta([]);
                }}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
              >
                ← Volver a lista
              </button>
            </div>
          </div>

          {/* VISTA: RESULTADOS */}
          {vista === 'resultados' && (
            resultados.length > 0 ? (
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
                        <td className="py-3 px-4 border-b">{resultado.alumno_nombre || `Alumno #${resultado.alumno_id}`}</td>
                        <td className="py-3 px-4 border-b">{resultado.puntaje} / {resultado.total_preguntas}</td>
                        <td className="py-3 px-4 border-b">
                          {resultado.tiempo_empleado ? `${Math.floor(resultado.tiempo_empleado / 60)}m ${resultado.tiempo_empleado % 60}s` : 'N/A'}
                        </td>
                        <td className="py-3 px-4 border-b">{new Date(resultado.fecha_completado).toLocaleDateString()}</td>
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
            ) : <p className="text-gray-500 italic">Ningún alumno ha completado este ensayo aún.</p>
          )}

          {/* VISTA: PREGUNTAS */}
          {vista === 'preguntas' && (
            preguntas.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr className="bg-indigo-50">
                      <th className="py-3 px-4 border-b text-left text-indigo-800 font-semibold">#</th>
                      <th className="py-3 px-4 border-b text-left text-indigo-800 font-semibold">Pregunta</th>
                      <th className="py-3 px-4 border-b text-left text-indigo-800 font-semibold">% Correctas</th>
                      <th className="py-3 px-4 border-b text-left text-indigo-800 font-semibold">Total respuestas</th>
                      <th className="py-3 px-4 border-b text-left text-indigo-800 font-semibold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preguntas.map((p, index) => {
                      const porcentaje = p.porcentaje_correctas || 0;
                      let colorClase = 'text-red-600';
                      let bgColorClase = 'bg-red-100';
                      
                      if (porcentaje >= 70) {
                        colorClase = 'text-green-600';
                        bgColorClase = 'bg-green-100';
                      } else if (porcentaje >= 50) {
                        colorClase = 'text-yellow-600';
                        bgColorClase = 'bg-yellow-100';
                      }

                      return (
                        <tr key={p.pregunta_id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 border-b font-medium">{index + 1}</td>
                          <td className="py-3 px-4 border-b">{p.enunciado}</td>
                          <td className="py-3 px-4 border-b">
                            <span className={`px-2 py-1 rounded-full text-sm font-semibold ${colorClase} ${bgColorClase}`}>
                              {porcentaje}%
                            </span>
                          </td>
                          <td className="py-3 px-4 border-b">
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">
                              {p.total_respuestas}
                            </span>
                          </td>
                          <td className="py-3 px-4 border-b">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => cargarAlumnosPregunta(p.pregunta_id, true)}
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors flex items-center"
                              >
                                ✅ Correctos ({p.correctas || 0})
                              </button>
                              <button
                                onClick={() => cargarAlumnosPregunta(p.pregunta_id, false)}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors flex items-center"
                              >
                                ❌ Incorrectos ({p.total_respuestas - p.correctas || 0})
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : <p className="text-gray-500 italic">No hay preguntas para este ensayo.</p>
          )}

          {/* VISTA: ALUMNOS POR PREGUNTA */}
          {vista === 'alumnos' && (
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-700">
                {tituloAlumnos}
              </h4>
              {alumnosPregunta.length > 0 ? (
                <div className="space-y-3">
                  {alumnosPregunta.map((alumno) => {
                    // CORRECCIÓN: Verificar directamente la propiedad es_correcta del alumno
                    const esCorrecto = alumno.es_correcta === true || 
                                      (alumno.es_correcta === undefined && tituloAlumnos.includes('CORRECTAMENTE'));
                    
                    return (
                      <div 
                        key={alumno.id} 
                        className={`p-4 rounded-lg border-l-4 shadow-sm ${
                          esCorrecto 
                            ? 'bg-green-50 border-green-400' 
                            : 'bg-red-50 border-red-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              esCorrecto ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              <span className="font-semibold">
                                {alumno.nombre?.charAt(0) || 'A'}
                              </span>
                            </div>
                            <div className="ml-3">
                              <p className={`font-medium ${
                                esCorrecto ? 'text-green-800' : 'text-red-800'
                              }`}>
                                {alumno.nombre}
                              </p>
                              {alumno.respuesta_elegida && (
                                <p className={`text-sm ${
                                  esCorrecto ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  Respuesta: <span className="font-semibold">{alumno.respuesta_elegida.toUpperCase()}</span>
                                </p>
                              )}
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            esCorrecto 
                              ? 'bg-green-200 text-green-800' 
                              : 'bg-red-200 text-red-800'
                          }`}>
                            {esCorrecto ? '✅ Correcto' : '❌ Incorrecto'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <p className="text-yellow-700 italic">
                    No hay alumnos en esta categoría.
                  </p>
                </div>
              )}
            </div>
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
                      <button
                        onClick={() => cargarPreguntas(ensayo.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                      >
                        Ver preguntas
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
          ) : <p className="text-gray-500 italic">No has creado ningún ensayo aún.</p>}
        </div>
      )}
    </div>
  );
}