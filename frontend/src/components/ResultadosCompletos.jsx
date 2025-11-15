import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom';

export default function ResultadosCompletos() {
  const { user } = useUser();
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResultados = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const alumnoId = Number.parseInt(user?.id, 10);
      if (Number.isNaN(alumnoId)) {
        throw new Error('ID de usuario inválido');
      }
      
      console.log('Enviando request con alumnoId:', alumnoId);
      
      const response = await axios.get('/api/ensayos/resultados-alumno', {
        params: { alumnoId }
      });
      
      console.log('Respuesta recibida:', response.data);
      
      if (response.data.ok) {
        setResultados(response.data.resultados);
      } else {
        throw new Error(response.data.error || 'Error en la respuesta');
      }
    } catch (err) {
      console.error('Error al obtener resultados:', err);
      console.error('Detalles del error:', err.response?.data);
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }, [user]); 

  useEffect(() => {
    if (user?.id) {
      fetchResultados();
    } else if (user) {
      setError('ID de usuario no encontrado');
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user, fetchResultados]); 

  if (loading) {
    return <div className="text-center py-8">Cargando resultados...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error: {error}</p>
        <button 
          onClick={fetchResultados}
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl w-full mx-auto bg-white p-6 rounded-2xl shadow-lg border border-gray-200 mt-16 mb-8">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
        Mis Resultados
      </h2>

      {resultados.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No has completado ningún ensayo aún</p>
      ) : (
        <div className="space-y-4">
          {resultados.map((resultado) => (
            <Link
              key={`${resultado.ensayo_id}-${resultado.fecha_completado}`}
              to={`/resultado-detalle/${resultado.ensayo_id}`}
              className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-lg">{resultado.titulo}</h3>
                  <p className="text-sm text-gray-500">{resultado.materia}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-indigo-700">
                    {resultado.puntaje}/{resultado.total_preguntas}
                  </span>
                  <div className="text-sm">
                    {new Date(resultado.fecha_completado).toLocaleDateString('es-CL', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}