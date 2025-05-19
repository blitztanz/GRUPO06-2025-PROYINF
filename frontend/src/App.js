// frontend/src/App.js
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

import Login         from './components/Login'
import MenuProfesor  from './components/MenuProfesor'
import CrearReporte  from './components/CrearReporte'
import VerAlumnos    from './components/VerAlumnos'       // <- nuevo
import MenuAlumno    from './components/MenuAlumno'
import VerReportes   from './components/VerReportes'
import DetalleReporte from './components/DetalleReporte'
import VerNotas      from './components/VerNotas'
import MenuExterno    from './components/MenuExterno';
import Notas          from './components/Notas'  // ← nuevo


export default function App() {
  const { alumnoId } = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Profesor */}
        <Route path="/menu_profesor" element={<MenuProfesor />} />
        <Route path="/menu_profesor/alumnos" element={<VerAlumnos />} />
        <Route path="/menu_profesor/reportes" element={<CrearReporte />} />

        {/* Alumno */}
        <Route path="/menu_alumno" element={<MenuAlumno />} />
        <Route path="/menu_alumno/reportes" element={<VerReportes />} />
        <Route path="/reportes/:id" element={<DetalleReporte />} />
        <Route path="/menu_alumno/notas" element={<VerNotas />} />

        {/* Página de Notas — sin props, solo mensaje por defecto */}
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
