import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function VerReportes() {
  const [reportes, setReportes] = useState([]);

  useEffect(() => {
    fetch('/api/reportes')
      .then(r => r.json())
      .then(b => b.ok && setReportes(b.reportes))
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-4xl w-full mx-auto bg-white p-8 mt-16 mb-8 rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
        Reportes Disponibles
      </h2>

      {reportes.length === 0 ? (
        <p className="text-center text-gray-500">No hay reportes disponibles.</p>
      ) : (
        <ul className="space-y-4">
          {reportes.map((r) => (
            <li
              key={r.id}
              className="flex flex-col md:flex-row md:justify-between items-start md:items-center bg-indigo-50 border border-indigo-200 rounded-xl px-6 py-4 shadow-sm hover:bg-indigo-100 transition"
            >
              <Link
                to={`/reportes/${r.id}`}
                className="text-indigo-700 font-medium text-lg hover:underline"
              >
                {r.titulo}
              </Link>
              <span className="text-sm text-gray-500 mt-1 md:mt-0">
                {new Date(r.creado).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
