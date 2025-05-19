// frontend/src/components/Login.jsx
import { useState, useEffect } from 'react'
import { useNavigate }  from 'react-router-dom'

export default function Login() {
  const [tipo, setTipo]             = useState('')
  const [usuarios, setUsuarios]     = useState([])
  const [selectedUserId, setUserId] = useState('')
  const [loadingUsers, setLoading]  = useState(false)
  const [error, setError]           = useState(null)
  const navigate = useNavigate()

  // Cada vez que cambie el tipo a "alumno", traemos la lista
  useEffect(() => {
    if (tipo === 'alumno') {
      setLoading(true)
      fetch('http://localhost:4000/api/alumnos')
        .then(r => r.json())
        .then(b => {
          if (!b.ok) throw new Error(b.error)
          setUsuarios(b.alumnos)
        })
        .catch(err => setError('No pude cargar alumnos'))
        .finally(() => setLoading(false))
    } else {
      setUsuarios([])
      setUserId('')
    }
  }, [tipo])

  const handleSubmit = e => {
    e.preventDefault()
    if (!tipo) return alert('Selecciona un tipo de usuario.')
    if (tipo === 'alumno' && !selectedUserId)
      return alert('Selecciona tu usuario.')

    // Guardamos el tipo y, si es alumno, el ID
    localStorage.setItem('userTipo', tipo)
    if (tipo === 'alumno') {
      localStorage.setItem('alumnoId', selectedUserId)
    }

    // Redirigimos
    if (tipo === 'profesor')      navigate('/menu_profesor')
    else if (tipo === 'alumno')   navigate('/menu_alumno')
    else                           navigate('/menu_externo')
  }

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h1>Login PAES</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        {/* Selección de tipo */}
        <label>Tipo de usuario:</label>
        <select
          value={tipo}
          onChange={e => setTipo(e.target.value)}
          required
          style={{ display: 'block', width: '100%', margin: '8px 0' }}
        >
          <option value="">-- Elige uno --</option>
          <option value="profesor">Profesor</option>
          <option value="alumno">Alumno</option>
          <option value="externo">Externo</option>
        </select>

        {/* Si es alumno, mostramos select de usuarios */}
        {tipo === 'alumno' && (
          <>
            {loadingUsers
              ? <p>Cargando alumnos…</p>
              : (
                <>
                  <label>Selecciona tu usuario:</label>
                  <select
                    value={selectedUserId}
                    onChange={e => setUserId(e.target.value)}
                    required
                    style={{ display: 'block', width: '100%', margin: '8px 0' }}
                  >
                    <option value="">-- Elige tu nombre --</option>
                    {usuarios.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.nombre} ({u.correo})
                      </option>
                    ))}
                  </select>
                </>
              )
            }
          </>
        )}

        <button type="submit" style={{ width: '100%', marginTop: 16 }}>
          Entrar
        </button>
      </form>
    </div>
  )
}
