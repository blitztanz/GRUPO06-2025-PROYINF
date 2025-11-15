import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';

export default function VerAlumnos() {
  const { user } = useUser();
  const [alumnos, setAlumnos] = useState([]);
  const [ensayos, setEnsayos] = useState([]);
  const [asignacion, setAsignacion] = useState({
    ensayoId: '',
    alumnoId: '',
    fechaLimite: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Cargar alumnos
  useEffect(() => {
    if (!user) return;

    setIsLoading(true);
    fetch('/api/alumnos')
      .then(res => res.json())
      .then(data => {
        if (data.ok) setAlumnos(data.alumnos);
      })
      .finally(() => setIsLoading(false));
  }, [user]);

  // Cargar ensayos del profesor
  useEffect(() => {
    if (!user) return;

    fetch(`/api/ensayos?profesorId=${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.ok) setEnsayos(data.ensayos);
      });
  }, [user]);

  const handleAsignarEnsayo = (alumnoId) => {
    setAsignacion(prev => ({ ...prev, alumnoId }));
    setShowModal(true);
  };

  const submitAsignacion = () => {
    if (!asignacion.ensayoId || !asignacion.alumnoId || !asignacion.fechaLimite) {
      alert('Por favor complete todos los campos');
      return;
    }

    setIsLoading(true);
    fetch('/api/ensayos/asignar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(asignacion)
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          alert('Ensayo asignado correctamente');
          setShowModal(false);
          setAsignacion({ ensayoId: '', alumnoId: '', fechaLimite: '' });
        } else {
          alert(data.error || 'Error al asignar ensayo');
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">Lista de Alumnos</h2>
      
      {isLoading ? (
        <p>Cargando alumnos...</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Nombre</th>
                <th className="py-3 px-4 text-left">Correo</th>
                <th className="py-3 px-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {alumnos.map(alumno => (
                <tr key={alumno.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">{alumno.nombre}</td>
                  <td className="py-3 px-4">{alumno.correo}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleAsignarEnsayo(alumno.id)}
                      className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
                    >
                      Asignar Ensayo
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal para asignar ensayo */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-indigo-600 mb-4">Asignar Ensayo</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="ensayoSelect" className="block text-gray-700 mb-1">Ensayo</label>
                <select
                  id="ensayoSelect"
                  value={asignacion.ensayoId}
                  onChange={(e) => setAsignacion({ ...asignacion, ensayoId: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Seleccione un ensayo</option>
                  {ensayos.map(ensayo => (
                    <option key={ensayo.id} value={ensayo.id}>
                      {ensayo.titulo} ({ensayo.materia})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="fechaLimiteInput" className="block text-gray-700 mb-1">Fecha Límite</label>
                <input
                  type="datetime-local"
                  id="fechaLimiteInput"
                  value={asignacion.fechaLimite}
                  onChange={(e) => setAsignacion({ ...asignacion, fechaLimite: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={submitAsignacion}
                disabled={isLoading}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
              >
                {isLoading ? 'Asignando...' : 'Asignar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}