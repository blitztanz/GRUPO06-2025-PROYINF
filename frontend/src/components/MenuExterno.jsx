import { Link } from 'react-router-dom';

export default function MenuExterno() {
  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md rounded-xl p-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">Menú Externo</h2>
      <ul className="space-y-4">
        <li>
          <Link
            to="/menu_externo/reportes"
            className="block px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-center font-medium shadow-sm"
          >
            📄 Ver Reportes
          </Link>
        </li>
        {/* Puedes añadir más enlaces aquí */}
      </ul>
    </div>
  );
}
