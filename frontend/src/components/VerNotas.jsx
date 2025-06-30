import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function VerNotas() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || user.tipo !== 'alumno') {
      navigate('/login');
      return;
    }

    fetch(`/api/notas?alumnoId=${user.id}`)
      .then(res => res.json())
      .then(body => {
        if (!body.ok) throw new Error(body.error);
        setNotas(body.notas);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="text-center mt-10 text-indigo-600 font-semibold text-lg">
        Cargando notas…
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500 font-semibold">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl w-full mx-auto bg-white p-8 mt-16 mb-8 rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
        Mis Notas
      </h2>

      {notas.length === 0 ? (
        <p className="text-center text-gray-500">No tienes notas aún.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-indigo-100 text-indigo-700 text-left">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold">Reporte</th>
                <th className="px-6 py-3 text-sm font-semibold">Fecha</th>
                <th className="px-6 py-3 text-sm font-semibold">Nota</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {notas.map((n) => (
                <tr key={n.reporte_id} className="hover:bg-indigo-50 transition">
                  <td className="px-6 py-4 text-gray-700">{n.titulo}</td>
                  <td className="px-6 py-4 text-gray-500">{new Date(n.creado).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-medium text-indigo-600">{n.valor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
