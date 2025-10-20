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

      <div className="flex flex-wrap items-center space-x-6 flex-grow">
        {user.tipo === 'profesor' && (
          <>
            <Link
              to="/menu_profesor"
              className="text-gray-700 hover:text-indigo-600 font-medium transition"
            >
              Inicio
            </Link>
            <Link
              to="/menu_profesor/alumnos"
              className="text-gray-700 hover:text-indigo-600 font-medium transition"
            >
              Alumnos
            </Link>
            <Link
              to="/menu_profesor/resultados"
              className="text-gray-700 hover:text-indigo-600 font-medium transition"
            >
              Resultados
            </Link>
            <Link
              to="/menu_profesor/ensayos"
              className="text-gray-700 hover:text-indigo-600 font-medium transition"
            >
              Crear Ensayo
            </Link>
            <Link
              to="/menu_profesor/banco_preguntas"
              className="text-gray-700 hover:text-indigo-600 font-medium transition"
            >
              Banco de Preguntas
            </Link>
            <Link
              to="/menu_profesor/cursos"
              className="text-gray-700 hover:text-indigo-600 font-medium transition"
            >
              Cursos
            </Link>
          </>
        )}

        {user.tipo === 'alumno' && (
          <>
            <Link
              to="/menu_alumno"
              className="text-gray-700 hover:text-indigo-600 font-medium transition"
            >
              Inicio
            </Link>
            <Link
              to="/menu_alumno/ensayos"
              className="text-gray-700 hover:text-indigo-600 font-medium transition"
            >
              Ensayos PAES
            </Link>
            <Link
              to="/menu_alumno/resultados"
              className="text-gray-700 hover:text-indigo-600 font-medium transition"
            >
              Resultados
            </Link>
          </>
        )}

        {user.tipo === 'externo' && (
          <>
            <Link
              to="/menu_externo"
              className="text-gray-700 hover:text-indigo-600 font-medium transition"
            >
              Inicio
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

      <div className="ml-auto flex items-center space-x-4">
        {user.avatar_url && (
          <img 
            src={user.avatar_url} 
            alt="Perfil" 
            className="w-10 h-10 rounded-full object-cover border-2 border-indigo-100"
            referrerPolicy="no-referrer"
          />
        )}
        
        <button
          onClick={handleLogout}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}
