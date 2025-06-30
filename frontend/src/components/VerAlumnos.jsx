import { useState, useEffect } from 'react';

export default function VerAlumnos() {
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/api/alumnos')
      .then(res => res.json())
      .then(body => {
        if (!body.ok) throw new Error(body.error);
        setAlumnos(body.alumnos);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-10 text-gray-500">Cargando alumnos…</p>;
  if (error) return <p className="text-center text-red-500 mt-10">Error: {error}</p>;

  return (
    <div className="max-w-5xl w-full mx-auto bg-white p-8 mt-16 mb-8 rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
        Listado de Alumnos
      </h2>

      {alumnos.length === 0 ? (
        <p className="text-center text-gray-500">No hay alumnos registrados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-indigo-50 text-indigo-700 text-sm uppercase">
              <tr>
                <th className="px-4 py-3 border-b border-gray-200">ID</th>
                <th className="px-4 py-3 border-b border-gray-200">Nombre</th>
                <th className="px-4 py-3 border-b border-gray-200">Correo</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {alumnos.map(a => (
                <tr key={a.id} className="hover:bg-indigo-50 transition">
                  <td className="px-4 py-2 border-b">{a.id}</td>
                  <td className="px-4 py-2 border-b">{a.nombre}</td>
                  <td className="px-4 py-2 border-b">{a.correo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
