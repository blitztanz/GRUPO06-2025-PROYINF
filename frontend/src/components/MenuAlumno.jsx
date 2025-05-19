// frontend/src/components/MenuAlumno.jsx
import { Link } from 'react-router-dom'

export default function MenuAlumno() {
  return (
    <div style={{ padding: '1rem' }}>
      <h2>Menú Alumno</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ margin: '0.5rem 0' }}>
          <Link to="/menu_alumno/reportes">📄 Ver Reportes</Link>
        </li>
        <li style={{ margin: '0.5rem 0' }}>
          <Link to="/notas">📝 Mis Notas</Link>
        </li>
      </ul>
    </div>
  )
}
