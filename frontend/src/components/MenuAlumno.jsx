import { Link } from 'react-router-dom';

export default function MenuAlumno() {
  return (
    <div className="max-w-3xl w-full mx-auto bg-white p-6 rounded-2xl shadow-lg border border-gray-200 mt-16 mb-8">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
        Menú del Alumno
      </h2>

      <ul className="space-y-4">
        <li>
          <Link
            to="/menu_alumno/reportes"
            className="flex items-center justify-between px-4 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium rounded-lg transition shadow-sm border border-indigo-200"
          >
            <span className="text-lg">📄 Ver Reportes</span>
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

        <li>
          <Link
            to="/notas"
            className="flex items-center justify-between px-4 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium rounded-lg transition shadow-sm border border-indigo-200"
          >
            <span className="text-lg">📝 Mis Notas</span>
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
      </ul>
    </div>
  );
}
