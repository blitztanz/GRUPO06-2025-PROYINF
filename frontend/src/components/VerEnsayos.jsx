// components/VerEnsayos.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';

export default function VerEnsayos() {
  const { user } = useUser();
  const [ensayos, setEnsayos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnsayos = async () => {
      try {
        const response = await axios.get(`/api/ensayos?alumnoId=${user.id}`);
        setEnsayos(response.data.ensayos);
      } catch (err) {
        setError('Error al cargar los ensayos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchEnsayos();
    }
  }, [user]);

  if (loading) {
    return <div className="text-center py-8">Cargando ensayos...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-3xl w-full mx-auto bg-white p-6 rounded-2xl shadow-lg border border-gray-200 mt-16 mb-8">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
        Mis Ensayos PAES
      </h2>

      {ensayos.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No tienes ensayos asignados</p>
      ) : (
        <ul className="space-y-4">
          {ensayos.map((ensayo) => (
            <li key={ensayo.id}>
              <Link
                to={`/ensayo/${ensayo.id}`}
                className="flex items-center justify-between px-4 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium rounded-lg transition shadow-sm border border-indigo-200"
              >
                <div>
                  <span className="text-lg">{ensayo.titulo}</span>
                  <div className="text-sm text-gray-500 mt-1">
                    {ensayo.materia} • {ensayo.tiempo_limite} minutos
                    {ensayo.fecha_limite && (
                      <span> • Entrega: {new Date(ensayo.fecha_limite).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}