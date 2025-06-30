import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function Navbar() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      try {
        await logout();
        navigate('/login');
      } catch (error) {
        alert('Ocurrió un error al cerrar sesión');
      }
    }
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 px-6 py-4 flex items-center">
      {/* Opcional: Logo o título */}
      {/* <div className="text-xl font-bold text-indigo-600 mr-8">PAES</div> */}

      <div className="flex flex-wrap items-center space-x-6 flex-grow">
        {user.tipo === 'profesor' && (
          <>
            <Link
              to="/menu_profesor"
              className="text-gray-700 hover:text-indigo-600 font-medium transition"
            >
              Menú Profesor
            </Link>
            <Link
              to="/menu_profesor/alumnos"
              className="text-gray-700 hover:text-indigo-600 font-medium transition"
            >
              Alumnos
            </Link>
            <Link
              to="/menu_profesor/reportes"
              className="text-gray-700 hover:text-indigo-600 font-medium transition"
            >
              Crear Reporte
            </Link>
            <Link
              to="/menu_profesor/banco_preguntas"
              className="text-gray-700 hover:text-indigo-600 font-medium transition"
            >
              Banco de Preguntas
            </Link>
          </>
        )}

        {user.tipo === 'alumno' && (
          <>
            <Link
              to="/menu_alumno"
              className="text-gray-700 hover:text-indigo-600 font-medium transition"
            >
              Menú Alumno
            </Link>
            <Link
              to="/menu_alumno/reportes"
              className="text-gray-700 hover:text-indigo-600 font-medium transition"
            >
              Ver Reportes
            </Link>
            <Link
              to="/menu_alumno/notas"
              className="text-gray-700 hover:text-indigo-600 font-medium transition"
            >
              Notas
            </Link>
          </>
        )}

        {user.tipo === 'externo' && (
          <>
            <Link
              to="/menu_externo"
              className="text-gray-700 hover:text-indigo-600 font-medium transition"
            >
              Menú Externo
            </Link>
            <Link
              to="/menu_externo/reportes"
              className="text-gray-700 hover:text-indigo-600 font-medium transition"
            >
              Ver Reportes
            </Link>
          </>
        )}
      </div>

      <button
        onClick={handleLogout}
        className="ml-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        Cerrar sesión
      </button>
    </nav>
  );
}
