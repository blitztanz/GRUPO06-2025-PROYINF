import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from './context/UserContext';

// Componentes
import Login from './components/Login';
import MenuProfesor from './components/MenuProfesor';
import CrearEnsayo from './components/CrearEnsayo';
import VerAlumnos from './components/VerAlumnos';
import MenuAlumno from './components/MenuAlumno';
import VerReportes from './components/VerReportes';
import VerEnsayos from './components/VerEnsayos';
import ResolverEnsayo from './components/ResolverEnsayo';
import ResultadosCompletos from './components/ResultadosCompletos';
import ResultadoDetalle from './components/ResultadoDetalle';
import DetalleReporte from './components/DetalleReporte';
import MenuExterno from './components/MenuExterno';
import BancoPreguntas from './components/BancoPreguntas';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import ResultadosProfes from './components/ResultadosProfe';
import CursosSincronizados from "./components/cursos_sincronizados";


export default function App() {
  const { user } = useUser();

  return (
    <BrowserRouter>
      {user && <Navbar />}
      <div className={user ? "pt-16" : ""}>
        <Routes>
          {/* Redirección inicial */}
          <Route path="/" element={<Navigate to={user ? `/menu_${user.tipo}` : '/login'} replace />} />

          {/* Login público */}
          <Route path="/login" element={<Login />} />

          {/* Rutas de profesor */}
          <Route path="/menu_profesor" element={
            <ProtectedRoute allowedRoles={['profesor']}>
              <MenuProfesor />
            </ProtectedRoute>
          } />
          <Route path="/menu_profesor/alumnos" element={
            <ProtectedRoute allowedRoles={['profesor']}>
              <VerAlumnos />
            </ProtectedRoute>
          } />
          <Route path="/menu_profesor/resultados" element={
            <ProtectedRoute allowedRoles={['profesor']}>
              <ResultadosProfes />
            </ProtectedRoute>
          } />
          <Route path="/menu_profesor/ensayos" element={
            <ProtectedRoute allowedRoles={['profesor']}>
              <CrearEnsayo />
            </ProtectedRoute>
          } />
          <Route path="/menu_profesor/banco_preguntas" element={
            <ProtectedRoute allowedRoles={['profesor']}>
              <BancoPreguntas />
            </ProtectedRoute>
          } />
          <Route path="/menu_profesor/cursos" element={
            <CursosSincronizados profesorId={localStorage.getItem("profesorId")}/>
          } />

          {/* Rutas de alumno */}
          <Route path="/menu_alumno" element={
            <ProtectedRoute allowedRoles={['alumno']}>
              <MenuAlumno />
            </ProtectedRoute>
          } />
          <Route path="/menu_alumno/ensayos" element={
            <ProtectedRoute allowedRoles={['alumno']}>
              <VerEnsayos />
            </ProtectedRoute>
          } />
          <Route path="ensayo/:id" element={
            <ProtectedRoute allowedRoles={['alumno']}>
              <ResolverEnsayo />
            </ProtectedRoute>
          } />
          <Route path="/menu_alumno/reportes" element={
            <ProtectedRoute allowedRoles={['alumno']}>
              <VerReportes />
            </ProtectedRoute>
          } />
          <Route path="/menu_alumno/resultados" element={
            <ProtectedRoute allowedRoles={['alumno']}>
              <ResultadosCompletos />
            </ProtectedRoute>
          } />
          <Route path="/resultado-detalle/:id" element={
            <ProtectedRoute allowedRoles={['alumno']}>
              <ResultadoDetalle />
            </ProtectedRoute>
          } />

          {/* Rutas de externo */}
          <Route path="/menu_externo" element={
            <ProtectedRoute allowedRoles={['externo']}>
              <MenuExterno />
            </ProtectedRoute>
          } />
          <Route path="/menu_externo/reportes" element={
            <ProtectedRoute allowedRoles={['externo']}>
              <VerReportes />
            </ProtectedRoute>
          } />

          {/* Rutas compartidas */}
          <Route path="/reportes/:id" element={
            <ProtectedRoute allowedRoles={['alumno', 'profesor', 'externo']}>
              <DetalleReporte />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}