import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

import Login         from './components/Login'
import MenuProfesor  from './components/MenuProfesor'
import CrearReporte  from './components/CrearReporte'
import VerAlumnos    from './components/VerAlumnos'
import MenuAlumno    from './components/MenuAlumno'
import VerReportes   from './components/VerReportes'
import DetalleReporte from './components/DetalleReporte'
import VerNotas      from './components/VerNotas'
import MenuExterno    from './components/MenuExterno'
import Notas          from './components/Notas'
import BancoPreguntas from './components/BancoPreguntas'

// 👇 IMPORTA el navbar
import Navbar from './components/Navbar'

export default function App() {
  const auth = useAuth()

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Profesor */}
        <Route path="/menu_profesor" element={<MenuProfesor />} />
        <Route path="/menu_profesor/alumnos" element={<VerAlumnos />} />
        <Route path="/menu_profesor/reportes" element={<CrearReporte />} />
        <Route path="/menu_profesor/banco_preguntas" element={<BancoPreguntas />} />

        {/* Alumno */}
        <Route path="/menu_alumno" element={<MenuAlumno />} />
        <Route path="/menu_alumno/reportes" element={<VerReportes />} />
        <Route path="/reportes/:id" element={<DetalleReporte />} />
        <Route path="/menu_alumno/notas" element={<VerNotas />} />

        {/* Página de Notas */}
        <Route path="/notas" element={<Notas />} />
        
        {/* Externo */}
        <Route path="/menu_externo" element={<MenuExterno />} />
        <Route path="/menu_externo/reportes" element={<VerReportes />} />
        <Route path="/menu_externo/reportes/:id" element={<DetalleReporte />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
