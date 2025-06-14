import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function Navbar() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', marginBottom: '1rem' }}>
      {/*<Link to="/" style={{ marginRight: '1rem' }}>Inicio</Link>*/}

      {user.tipo === 'profesor' && (
        <>
          <Link to="/menu_profesor" style={{ marginRight: '1rem' }}>Menú Profesor</Link>
          <Link to="/menu_profesor/alumnos" style={{ marginRight: '1rem' }}>Alumnos</Link>
          <Link to="/menu_profesor/reportes" style={{ marginRight: '1rem' }}>Crear Reporte</Link>
          <Link to="/menu_profesor/banco_preguntas" style={{ marginRight: '1rem' }}>Banco de Preguntas</Link>
        </>
      )}

      {user.tipo === 'alumno' && (
        <>
          <Link to="/menu_alumno" style={{ marginRight: '1rem' }}>Menú Alumno</Link>
          <Link to="/menu_alumno/reportes" style={{ marginRight: '1rem' }}>Ver Reportes</Link>
          <Link to="/menu_alumno/notas" style={{ marginRight: '1rem' }}>Notas</Link>
        </>
      )}

      {user.tipo === 'externo' && (
        <>
          <Link to="/menu_externo" style={{ marginRight: '1rem' }}>Menú Externo</Link>
          <Link to="/menu_externo/reportes" style={{ marginRight: '1rem' }}>Ver Reportes</Link>
        </>
      )}

      <button onClick={handleLogout} style={{ marginLeft: '1rem' }}>Cerrar sesión</button>
    </nav>
  );
}
