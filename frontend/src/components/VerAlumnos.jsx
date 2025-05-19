// frontend/src/components/VerAlumnos.jsx
import { useState, useEffect } from 'react'

export default function VerAlumnos() {
  const [alumnos, setAlumnos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('http://localhost:4000/api/alumnos')
      .then(res => res.json())
      .then(body => {
        if (!body.ok) throw new Error(body.error)
        setAlumnos(body.alumnos)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Cargando alumnos…</p>
  if (error)   return <p style={{ color: 'red' }}>Error: {error}</p>

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Listado de Alumnos</h2>
      {alumnos.length === 0 ? (
        <p>No hay alumnos registrados.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th><th>Nombre</th><th>Correo</th>
            </tr>
          </thead>
          <tbody>
            {alumnos.map(a => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.nombre}</td>
                <td>{a.correo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
