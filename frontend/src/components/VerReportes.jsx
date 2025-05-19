import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function VerReportes() {
  const [reportes, setReportes] = useState([])

  useEffect(() => {
    fetch('/api/reportes')
      .then(r => r.json())
      .then(b => b.ok && setReportes(b.reportes))
      .catch(console.error)
  }, [])

  return (
    <div style={{ padding:'1rem' }}>
      <h2>Reportes Disponibles</h2>
      <ul>
        {reportes.map(r => (
          <li key={r.id}>
            <Link to={`/reportes/${r.id}`}>{r.titulo}</Link> —{' '}
            {new Date(r.creado).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  )
}
