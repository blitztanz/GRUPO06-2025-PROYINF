// components/ResolverEnsayo.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';

export default function ResolverEnsayo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [ensayo, setEnsayo] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tiempoRestante, setTiempoRestante] = useState(0);

  useEffect(() => {
    const fetchEnsayo = async () => {
      try {
        const [ensayoResponse, preguntasResponse] = await Promise.all([
          axios.get(`/api/ensayos/${id}`),
          axios.get(`/api/ensayos/${id}/preguntas`)
        ]);

        setEnsayo(ensayoResponse.data.ensayo);
        setPreguntas(preguntasResponse.data.preguntas);
        
        if (ensayoResponse.data.ensayo.tiempo_limite) {
          setTiempoRestante(ensayoResponse.data.ensayo.tiempo_limite * 60); // Convertir a segundos
        }
      } catch (err) {
        setError('Error al cargar el ensayo');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnsayo();
  }, [id]);

  useEffect(() => {
    if (tiempoRestante <= 0 || !ensayo?.tiempo_limite) return;

    const timer = setInterval(() => {
      setTiempoRestante(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(); // Auto-enviar cuando el tiempo se acaba
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [tiempoRestante, ensayo?.tiempo_limite]);

  const handleRespuestaChange = (preguntaId, opcion) => {
    setRespuestas(prev => ({
      ...prev,
      [preguntaId]: opcion
    }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`/api/ensayos/${id}/respuestas`, {
        alumnoId: user.id,
        respuestas: respuestas
      });
      
      // Redirigir directamente a resultados completos con estado
      navigate('/menu_alumno/resultados', { 
        state: { 
          fromSubmit: true,
          ensayoId: id 
        } 
      });
    } catch (err) {
      setError('Error al enviar las respuestas');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando ensayo...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-3xl w-full mx-auto bg-white p-6 rounded-2xl shadow-lg border border-gray-200 mt-16 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-indigo-700">{ensayo?.titulo}</h2>
        {ensayo?.tiempo_limite && (
          <div className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-lg font-medium">
            Tiempo restante: {Math.floor(tiempoRestante / 60)}:{String(tiempoRestante % 60).padStart(2, '0')}
          </div>
        )}
      </div>

      <div className="space-y-8">
        {preguntas.map((pregunta, index) => (
          <div key={pregunta.id} className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-medium mb-4">
              Pregunta {index + 1}: {pregunta.enunciado}
            </h3>
            <div className="space-y-2">
              {['a', 'b', 'c', 'd'].map((opcion) => (
                <div key={opcion} className="flex items-center">
                  <input
                    type="radio"
                    id={`p${pregunta.id}-${opcion}`}
                    name={`p${pregunta.id}`}
                    checked={respuestas[pregunta.id] === opcion}
                    onChange={() => handleRespuestaChange(pregunta.id, opcion)}
                    className="mr-2"
                  />
                  <label htmlFor={`p${pregunta.id}-${opcion}`}>
                    {opcion.toUpperCase()}. {pregunta[`opcion_${opcion}`]}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition"
        >
          Enviar respuestas
        </button>
      </div>
    </div>
  );
}