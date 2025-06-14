import React, { useState, useEffect } from 'react';

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
      autor_id: 1, // cambia esto si usas usuarios reales
    };

    console.log('Enviando nueva pregunta:', nuevaPregunta);

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
        const preguntaAgregada = {
          id: data.id,
          enunciado: form.texto,
          dificultad: form.dificultad,
          materia: form.materia,
        };

        setPreguntas(prev => [...prev, preguntaAgregada]);

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
    <div>
      <h2>Banco de Preguntas</h2>

      <div>
        <h3>Agregar pregunta</h3>
        <form onSubmit={handleAgregarPregunta}>
          <textarea
            placeholder="Texto de la pregunta"
            value={form.texto}
            onChange={e => setForm({ ...form, texto: e.target.value })}
            required
          />
          <br />
          <label>
            Dificultad:
            <select
              value={form.dificultad}
              onChange={e => setForm({ ...form, dificultad: e.target.value })}
              required
            >
              <option value="">Seleccione</option>
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          </label>
          <br />
          <label>
            Materia:
            <select
              value={form.materia}
              onChange={e => setForm({ ...form, materia: e.target.value })}
              required
            >
              <option value="">Seleccione</option>
              <option value="matematicas">Matemáticas</option>
              <option value="lenguaje">Lenguaje</option>
              <option value="ciencias">Ciencias</option>
            </select>
          </label>
          <br />
          Opciones:
          {form.opciones.map((opt, i) => (
            <input
              key={i}
              type="text"
              placeholder={`Opción ${i + 1}`}
              value={opt}
              onChange={e => handleOpcionChange(i, e.target.value)}
              required
            />
          ))}
          <br />
          <label>
            Respuesta Correcta:
            <select
              value={form.respuestaCorrecta}
              onChange={e => setForm({ ...form, respuestaCorrecta: e.target.value })}
              required
            >
              <option value="">Seleccione una opción</option>
              {form.opciones.map((opt, i) => (
                <option key={i} value={['a','b','c','d'][i]}>
                  {opt || `Opción ${i + 1}`}
                </option>
              ))}
            </select>
          </label>
          <br />
          <button type="submit">Agregar Pregunta</button>
        </form>
      </div>

      <div>
        <h3>Filtros</h3>
        <label>
          Dificultad:
          <select
            value={filtros.dificultad}
            onChange={e => setFiltros({ ...filtros, dificultad: e.target.value })}
          >
            <option value="">Todas</option>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </label>

        <label>
          Materia:
          <select
            value={filtros.materia}
            onChange={e => setFiltros({ ...filtros, materia: e.target.value })}
          >
            <option value="">Todas</option>
            <option value="matematicas">Matemáticas</option>
            <option value="lenguaje">Lenguaje</option>
            <option value="ciencias">Ciencias</option>
          </select>
        </label>
      </div>

      <div>
        <h3>Preguntas existentes</h3>
        <ul>
          {preguntas.map(p => (
            <li key={p.id}>
              <b>{p.materia} - {p.dificultad}</b>: {p.enunciado}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
