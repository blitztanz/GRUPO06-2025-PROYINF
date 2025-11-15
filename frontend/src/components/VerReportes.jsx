import React, { useEffect, useState } from 'react';

export default function VerReportes() {
  const [ensayos, setEnsayos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnsayos = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/ensayos', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Error al obtener los ensayos');
        }
        
        const data = await response.json();
        if (data.ok) {
          const ensayosConResultados = await Promise.all(
            data.ensayos.map(async ensayo => {
              const resResultados = await fetch(
                `http://localhost:4000/api/ensayos/${ensayo.id}/resultados`,
                { credentials: 'include' }
              );
              const resultadosData = await resResultados.json();
              
              const resProfesor = await fetch(
                `http://localhost:4000/api/alumnos/${ensayo.autor_id}`,
                { credentials: 'include' }
              );
              const profesorData = await resProfesor.json();
              
              return {
                ...ensayo,
                resultados: resultadosData.ok ? resultadosData.resultados : [],
                profesor: profesorData.ok ? profesorData.alumno : null
              };
            })
          );
          
          setEnsayos(ensayosConResultados);
        } else {
          setError(data.error || 'Error desconocido');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEnsayos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 flex-col">
        <div 
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"
          aria-hidden="true" 
        ></div>
        <p role="status" className="mt-4 text-gray-600">
          Cargando reportes...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md mx-auto mt-10">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-indigo-700 mb-8">Reportes de Ensayos</h1>
      
      {ensayos.length === 0 ? (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          No hay ensayos disponibles para mostrar.
        </div>
      ) : (
        <div className="space-y-8">
          {ensayos.map(ensayo => (
            <div key={ensayo.id} className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{ensayo.titulo}</h2>
                  <p className="text-gray-600">{ensayo.materia}</p>
                  {ensayo.profesor && (
                    <p className="text-sm text-gray-500 mt-1">
                      Creado por: {ensayo.profesor.nombre}
                    </p>
                  )}
                </div>
                <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                  {ensayo.num_preguntas} preguntas
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{ensayo.descripcion}</p>
              
              <div className="mt-6">
                <h3 className="font-medium text-gray-800 mb-3">Resultados de los alumnos:</h3>
                
                {ensayo.resultados.length === 0 ? (
                  <p className="text-gray-500 italic">No hay resultados registrados para este ensayo.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alumno</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Puntaje</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiempo</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {ensayo.resultados.map((resultado) => (
                          <tr key={resultado.alumno_id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {resultado.alumno_nombre}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {resultado.puntaje} / {resultado.total_preguntas}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(resultado.fecha_completado).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {resultado.tiempo_empleado ? `${Math.floor(resultado.tiempo_empleado / 60)}m ${resultado.tiempo_empleado % 60}s` : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}