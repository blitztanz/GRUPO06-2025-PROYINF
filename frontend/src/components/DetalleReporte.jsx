import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

export default function DetalleReporte() {
  const { id } = useParams()
  const [preguntas, setPreguntas] = useState([])

  useEffect(() => {
    fetch(`/api/reportes/${id}`)
      .then(r => r.json())
      .then(b => b.ok && setPreguntas(b.preguntas))
      .catch(console.error)
  }, [id])

  return (
    <div style={{ padding:'1rem' }}>
      <h2>Reporte #{id}</h2>
      <ul>
        {preguntas.map(p => (
          <li key={p.id}>{p.enunciado}</li>
        ))}
      </ul>
    </div>
  )
}
