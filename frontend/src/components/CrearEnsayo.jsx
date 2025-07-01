import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function CrearEnsayo() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [preguntasDisponibles, setPreguntasDisponibles] = useState([]);
  const [preguntasSeleccionadas, setPreguntasSeleccionadas] = useState([]);
  const [filtros, setFiltros] = useState({ dificultad: '', materia: '' });
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    materia: '',
    tiempo_limite: 60,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Cargar preguntas disponibles
  useEffect(() => {
    const query = new URLSearchParams();
    if (filtros.dificultad) query.append('dificultad', filtros.dificultad);
    if (filtros.materia) query.append('materia', filtros.materia);

    fetch(`/api/preguntas?${query.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (data.ok && Array.isArray(data.preguntas)) {
          setPreguntasDisponibles(data.preguntas);
        }
      });
  }, [filtros]);

  // Manejar selección/deselección de preguntas
  const togglePregunta = (pregunta) => {
    setPreguntasSeleccionadas(prev => {
      const existe = prev.some(p => p.id === pregunta.id);
      if (existe) {
        return prev.filter(p => p.id !== pregunta.id);
      } else {
        return [...prev, pregunta];
      }
    });
  };

  // Crear el ensayo
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Crear el ensayo
      const ensayoResponse = await fetch('/api/ensayos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Añade esto para incluir cookies
        body: JSON.stringify({
          titulo: form.titulo,
          descripcion: form.descripcion,
          materia: form.materia,
          tiempo_limite: form.tiempo_limite,
          autor_id: user.id,
        }),
      });

      const ensayoData = await ensayoResponse.json();
      if (!ensayoResponse.ok) throw new Error(ensayoData.error || 'Error al crear ensayo');

      // 2. Asociar preguntas al ensayo
      const preguntasPromises = preguntasSeleccionadas.map((pregunta, index) => 
        fetch('/api/ensayos/ensayos_preguntas', { // Corregí la ruta aquí
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // Añade esto para incluir cookies
          body: JSON.stringify({
            ensayo_id: ensayoData.id,
            pregunta_id: pregunta.id,
            orden: index + 1,
          }),
        }).then(res => {
          if (!res.ok) throw new Error('Error al asociar pregunta');
          return res.json();
        })
      );

      await Promise.all(preguntasPromises);

      alert('Ensayo creado exitosamente!');
      navigate('/menu_profesor');
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Error al crear el ensayo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-3xl font-bold text-indigo-700 mb-8 text-center">Crear Nuevo Ensayo</h2>

      {/* Formulario de ensayo */}
      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 mb-10">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              placeholder="Título del ensayo"
              required
              className="w-full p-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-200"
            />

            <textarea
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              placeholder="Descripción (opcional)"
              className="w-full p-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-200"
            />

            <div className="grid grid-cols-2 gap-4">
              <select
                value={form.materia}
                onChange={(e) => setForm({ ...form, materia: e.target.value })}
                required
                className="p-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-200"
              >
                <option value="">Seleccione materia</option>
                <option value="matematicas">Matemáticas</option>
                <option value="lenguaje">Lenguaje</option>
                <option value="ciencias">Ciencias</option>
              </select>

              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={form.tiempo_limite}
                  onChange={(e) => setForm({ ...form, tiempo_limite: e.target.value })}
                  placeholder="Tiempo límite (min)"
                  min="1"
                  required
                  className="w-full p-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-200"
                />
                <span className="whitespace-nowrap">minutos</span>
              </div>
            </div>
          </div>

          {/* Preguntas seleccionadas */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">
              Preguntas seleccionadas ({preguntasSeleccionadas.length})
            </h3>
            {preguntasSeleccionadas.length > 0 ? (
              <ul className="space-y-2 max-h-60 overflow-y-auto p-2 border rounded-lg">
                {preguntasSeleccionadas.map((pregunta, index) => (
                  <li key={pregunta.id} className="flex items-center justify-between p-2 bg-indigo-50 rounded">
                    <span className="text-gray-700">
                      {index + 1}. {pregunta.enunciado.substring(0, 50)}...
                    </span>
                    <button
                      type="button"
                      onClick={() => togglePregunta(pregunta)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No hay preguntas seleccionadas</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || preguntasSeleccionadas.length === 0}
            className={`mt-4 w-full bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 transition ${
              isLoading || preguntasSeleccionadas.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Creando...' : 'Crear Ensayo'}
          </button>
        </form>
      </div>

      {/* Banco de preguntas */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-indigo-600 mb-4">Banco de Preguntas</h3>
        
        {/* Filtros */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <select
            value={filtros.dificultad}
            onChange={(e) => setFiltros({ ...filtros, dificultad: e.target.value })}
            className="p-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-200"
          >
            <option value="">Todas las dificultades</option>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>

          <select
            value={filtros.materia}
            onChange={(e) => setFiltros({ ...filtros, materia: e.target.value })}
            className="p-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-200"
          >
            <option value="">Todas las materias</option>
            <option value="matematicas">Matemáticas</option>
            <option value="lenguaje">Lenguaje</option>
            <option value="ciencias">Ciencias</option>
          </select>
        </div>

        {/* Lista de preguntas */}
        <ul className="space-y-3 max-h-96 overflow-y-auto">
          {preguntasDisponibles.map((pregunta) => (
            <li key={pregunta.id} className="border-b border-gray-100 pb-2">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={preguntasSeleccionadas.some(p => p.id === pregunta.id)}
                  onChange={() => togglePregunta(pregunta)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">
                      {pregunta.materia} - {pregunta.dificultad}
                    </span>
                    <span className="text-sm text-gray-500">
                      {preguntasSeleccionadas.some(p => p.id === pregunta.id) ? 'Seleccionada' : ''}
                    </span>
                  </div>
                  <p className="text-gray-800">{pregunta.enunciado}</p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <p className={`text-sm ${pregunta.correcta === 'a' ? 'font-bold text-green-600' : 'text-gray-600'}`}>
                      A) {pregunta.opcion_a}
                    </p>
                    <p className={`text-sm ${pregunta.correcta === 'b' ? 'font-bold text-green-600' : 'text-gray-600'}`}>
                      B) {pregunta.opcion_b}
                    </p>
                    <p className={`text-sm ${pregunta.correcta === 'c' ? 'font-bold text-green-600' : 'text-gray-600'}`}>
                      C) {pregunta.opcion_c}
                    </p>
                    <p className={`text-sm ${pregunta.correcta === 'd' ? 'font-bold text-green-600' : 'text-gray-600'}`}>
                      D) {pregunta.opcion_d}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}