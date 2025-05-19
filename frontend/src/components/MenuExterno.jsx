// frontend/src/components/MenuExterno.jsx
import { Link } from 'react-router-dom'

export default function MenuExterno() {
  return (
    <div style={{ padding: '1rem' }}>
      <h2>Menú Externo</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ margin: '0.5rem 0' }}>
          <Link to="/menu_externo/reportes">📄 Ver Reportes</Link>
        </li>
        {/* aquí podrías añadir más opciones para usuarios externos */}
      </ul>
    </div>
  )
}
