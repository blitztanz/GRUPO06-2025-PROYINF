import { useState, useEffect } from 'react'

export function useAuth() {
  const [alumnoId, setAlumnoId] = useState(null)

  useEffect(() => {
    const id = localStorage.getItem('alumnoId')
    if (id) setAlumnoId(parseInt(id, 10))
  }, [])

  return { alumnoId }
}
