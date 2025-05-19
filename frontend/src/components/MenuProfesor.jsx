// frontend/src/components/MenuProfesor.jsx
import { Link } from 'react-router-dom'

export default function MenuProfesor() {
  return (
    <div style={{ padding: '1rem' }}>
      <h2>Menú Profesor</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ margin: '0.5rem 0' }}>
          <Link to="/menu_profesor/alumnos">👩‍🎓 Ver Alumnos</Link>
        </li>
        <li style={{ margin: '0.5rem 0' }}>
          <Link to="/menu_profesor/reportes">📝 Crear Reportes</Link>
        </li>
      </ul>
    </div>
  )
}
