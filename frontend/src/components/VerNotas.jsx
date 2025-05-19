// frontend/src/components/VerNotas.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function VerNotas() {
  const { alumnoId } = useAuth()
  const navigate = useNavigate()
  const [notas, setNotas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Si no hay alumnoId, redirigimos al login
    if (!alumnoId) {
      navigate('/login')
      return
    }

    fetch(`/api/notas?alumnoId=${alumnoId}`)
      .then(res => res.json())
      .then(body => {
        if (!body.ok) throw new Error(body.error)
        setNotas(body.notas)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [alumnoId, navigate])

  if (loading) return <p>Cargando notas…</p>
  if (error)   return <p style={{ color: 'red' }}>Error: {error}</p>

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Mis Notas</h2>
      {notas.length === 0
        ? <p>No tienes notas aún.</p>
        : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Reporte</th>
                <th>Fecha</th>
                <th>Nota</th>
              </tr>
            </thead>
            <tbody>
              {notas.map(n => (
                <tr key={n.reporte_id}>
                  <td>{n.titulo}</td>
                  <td>{new Date(n.creado).toLocaleDateString()}</td>
                  <td>{n.valor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      }
    </div>
  )
}
