// components/ResultadoDetalle.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';

export default function ResultadoDetalle() {
  const { id } = useParams();
  const { user } = useUser();
  const [resultado, setResultado] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resultadoResponse, preguntasResponse] = await Promise.all([
          axios.get(`/api/ensayos/${id}/resultados?alumnoId=${user.id}`),
          axios.get(`/api/ensayos/${id}/preguntas-respuestas?alumnoId=${user.id}`)
        ]);

        setResultado(resultadoResponse.data.resultado);
        setPreguntas(preguntasResponse.data.preguntas);
      } catch (err) {
        setError('Error al cargar el resultado');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [id, user]);

  if (loading) {
    return <div className="text-center py-8">Cargando resultado...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-3xl w-full mx-auto bg-white p-6 rounded-2xl shadow-lg border border-gray-200 mt-16 mb-8">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
        Detalle del Resultado
      </h2>

      <div className="bg-indigo-50 p-6 rounded-lg mb-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-indigo-700">
            {resultado.puntaje} / {resultado.total_preguntas}
          </div>
          <div className="text-lg mt-2">
            {Math.round((resultado.puntaje / resultado.total_preguntas) * 100)}%
          </div>
          <div className="mt-4 text-sm text-gray-600">
            {resultado.titulo} • {resultado.materia}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {preguntas.map((pregunta, index) => (
          <div 
            key={pregunta.id} 
            className={`border-l-4 p-4 ${pregunta.es_correcta ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}
          >
            <h3 className="font-medium mb-2">
              Pregunta {index + 1}: {pregunta.enunciado}
            </h3>
            
            <div className="space-y-2 ml-4">
              {['a', 'b', 'c', 'd'].map((opcion) => (
                <div 
                  key={opcion} 
                  className={`p-2 rounded ${pregunta.correcta === opcion ? 'bg-green-100 font-bold' : ''} ${pregunta.respuesta_elegida === opcion && !pregunta.es_correcta ? 'bg-red-100' : ''}`}
                >
                  {opcion.toUpperCase()}. {pregunta[`opcion_${opcion}`]}
                  {pregunta.correcta === opcion && (
                    <span className="ml-2 text-green-600">✓ Correcta</span>
                  )}
                  {pregunta.respuesta_elegida === opcion && !pregunta.es_correcta && (
                    <span className="ml-2 text-red-600">✗ Tu respuesta</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}