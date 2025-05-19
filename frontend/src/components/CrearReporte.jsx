import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function CrearReporte() {
  const [preguntas, setPreguntas] = useState([])
  const [seleccionadas, setSeleccionadas] = useState(new Set())
  const [titulo, setTitulo] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/preguntas')
      .then(r => r.json())
      .then(b => b.ok ? setPreguntas(b.preguntas) : Promise.reject(b.error))
      .catch(err => setError('No pude cargar preguntas'))
  }, [])

  const toggle = id => {
    const s = new Set(seleccionadas)
    s.has(id) ? s.delete(id) : s.add(id)
    setSeleccionadas(s)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!titulo || seleccionadas.size === 0) {
      setError('Ingresa título y al menos una pregunta')
      return
    }
    try {
      const res = await fetch('/api/reportes', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({
          titulo,
          preguntaIds: Array.from(seleccionadas)
        })
      })
      const body = await res.json()
      if (!body.ok) throw new Error(body.error)
      navigate('/menu_alumno/reportes')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div style={{ padding:'1rem' }}>
      <h2>Crear Reporte</h2>
      {error && <p style={{color:'red'}}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título del reporte"
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          style={{ width:'100%', marginBottom:12 }}
        />

        <fieldset style={{ border:'1px solid #ccc', padding:12 }}>
          <legend>Selecciona preguntas</legend>
          {preguntas.map(p => (
            <div key={p.id}>
              <label>
                <input
                  type="checkbox"
                  checked={seleccionadas.has(p.id)}
                  onChange={() => toggle(p.id)}
                />
                {' '}{p.enunciado}
              </label>
            </div>
          ))}
        </fieldset>

        <button type="submit" style={{ marginTop:12 }}>
          Guardar Reporte
        </button>
      </form>
    </div>
  )
}
