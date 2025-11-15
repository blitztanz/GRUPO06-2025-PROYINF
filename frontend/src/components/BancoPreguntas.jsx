import { useState, useEffect } from 'react';

export default function BancoPreguntas() {
  const [preguntas, setPreguntas] = useState([]);
  const [filtros, setFiltros] = useState({ dificultad: '', materia: '' });
  const [form, setForm] = useState({
    texto: '',
    dificultad: '',
    materia: '',
    opciones: ['', '', '', ''],
    respuestaCorrecta: '',
  });

  useEffect(() => {
    const query = new URLSearchParams();
    if (filtros.dificultad) query.append('dificultad', filtros.dificultad);
    if (filtros.materia) query.append('materia', filtros.materia);

    fetch(`/api/preguntas?${query.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.preguntas)) setPreguntas(data.preguntas);
      });
  }, [filtros]);

  function handleAgregarPregunta(e) {
    e.preventDefault();

    const nuevaPregunta = {
      enunciado: form.texto,
      opcion_a: form.opciones[0],
      opcion_b: form.opciones[1],
      opcion_c: form.opciones[2],
      opcion_d: form.opciones[3],
      correcta: form.respuestaCorrecta,
      dificultad: form.dificultad,
      materia: form.materia,
      autor_id: 1,
    };

    fetch('/api/preguntas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevaPregunta),
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al agregar');
        return res.json();
      })
      .then(data => {
        setPreguntas(prev => [...prev, {
          id: data.id,
          enunciado: form.texto,
          dificultad: form.dificultad,
          materia: form.materia,
        }]);

        setForm({
          texto: '',
          dificultad: '',
          materia: '',
          opciones: ['', '', '', ''],
          respuestaCorrecta: '',
        });
      })
      .catch(console.error);
  }

  function handleOpcionChange(i, valor) {
    const nuevasOpciones = [...form.opciones];
    nuevasOpciones[i] = valor;
    setForm({ ...form, opciones: nuevasOpciones });
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-3xl font-bold text-indigo-700 mb-8 text-center">Banco de Preguntas</h2>

      {/* Formulario */}
      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 mb-10">
        <h3 className="text-xl font-semibold text-indigo-600 mb-4">Agregar nueva pregunta</h3>
        <form onSubmit={handleAgregarPregunta} className="space-y-4">
          <textarea
            value={form.texto}
            onChange={e => setForm({ ...form, texto: e.target.value })}
            placeholder="Texto de la pregunta"
            required
            className="w-full p-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-200"
          />

          <div className="grid grid-cols-2 gap-4">
            <select
              value={form.dificultad}
              onChange={e => setForm({ ...form, dificultad: e.target.value })}
              required
              className="p-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-200"
            >
              <option value="">Dificultad</option>
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>

            <select
              value={form.materia}
              onChange={e => setForm({ ...form, materia: e.target.value })}
              required
              className="p-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-200"
            >
              <option value="">Materia</option>
              <option value="matematicas">Matemáticas</option>
              <option value="lenguaje">Lenguaje</option>
              <option value="ciencias">Ciencias</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {form.opciones.map((opt, i) => (
              <input
                key={`opcion-input-${i}`}
                type="text"
                placeholder={`Opción ${i + 1}`}
                value={opt}
                onChange={e => handleOpcionChange(i, e.target.value)}
                required
                className="p-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-200"
              />
            ))}
          </div>

          <select
            value={form.respuestaCorrecta}
            onChange={e => setForm({ ...form, respuestaCorrecta: e.target.value })}
            required
            className="w-full p-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-200"
          >
            <option value="">Respuesta Correcta</option>
            {form.opciones.map((opt, i) => (
              <option key={`opcion-select-${i}`} value={['a', 'b', 'c', 'd'][i]}>
                {opt || `Opción ${i + 1}`}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Agregar Pregunta
          </button>
        </form>
      </div>

      {/* Filtros */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-indigo-600 mb-4">Filtrar preguntas</h3>
        <div className="grid grid-cols-2 gap-4">
          <select
            value={filtros.dificultad}
            onChange={e => setFiltros({ ...filtros, dificultad: e.target.value })}
            className="p-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-200"
          >
            <option value="">Todas las dificultades</option>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>

          <select
            value={filtros.materia}
            onChange={e => setFiltros({ ...filtros, materia: e.target.value })}
            className="p-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-200"
          >
            <option value="">Todas las materias</option>
            <option value="matematicas">Matemáticas</option>
            <option value="lenguaje">Lenguaje</option>
            <option value="ciencias">Ciencias</option>
          </select>
        </div>
      </div>

      {/* Lista de preguntas */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-indigo-600 mb-4">Preguntas existentes</h3>
        <ul className="space-y-3">
          {preguntas.map(p => (
            <li key={p.id} className="border-b border-gray-100 pb-2">
              <span className="font-semibold text-gray-700">{p.materia} - {p.dificultad}</span>
              <p className="text-gray-800">{p.enunciado}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
