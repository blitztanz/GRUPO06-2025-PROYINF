import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CrearReporte() {
  const [preguntas, setPreguntas] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState(new Set());
  const [titulo, setTitulo] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/preguntas')
      .then(r => r.json())
      .then(b => b.ok ? setPreguntas(b.preguntas) : Promise.reject(b.error))
      .catch(() => setError('No pude cargar preguntas'));
  }, []);

  const toggle = id => {
    const s = new Set(seleccionadas);
    s.has(id) ? s.delete(id) : s.add(id);
    setSeleccionadas(s);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!titulo || seleccionadas.size === 0) {
      setError('Ingresa título y al menos una pregunta');
      return;
    }
    try {
      const res = await fetch('/api/reportes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo,
          preguntaIds: Array.from(seleccionadas)
        })
      });
      const body = await res.json();
      if (!body.ok) throw new Error(body.error);
      navigate('/menu_alumno/reportes');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 mt-16 mb-8 rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
        Crear Reporte
      </h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="text"
            placeholder="Título del reporte"
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <fieldset className="border border-gray-300 rounded-lg p-4">
          <legend className="text-lg font-medium text-indigo-600 mb-2">Selecciona preguntas</legend>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {preguntas.map(p => (
              <div key={p.id} className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={seleccionadas.has(p.id)}
                  onChange={() => toggle(p.id)}
                  className="mt-1"
                />
                <label className="text-gray-700">{p.enunciado}</label>
              </div>
            ))}
          </div>
        </fieldset>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition"
        >
          Guardar Reporte
        </button>
      </form>
    </div>
  );
}
