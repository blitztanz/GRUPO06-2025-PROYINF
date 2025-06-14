import { Router } from 'express';
import { pool } from '../db.js';
const router = Router();

router.get('/', async (req, res) => {
  try {
    const { dificultad, materia } = req.query;
    let baseQuery = `
      SELECT id, enunciado, opcion_a, opcion_b, opcion_c, opcion_d, correcta, dificultad, materia, autor_id 
      FROM preguntas`;
    const conditions = [];
    const values = [];

    if (dificultad) {
      values.push(dificultad);
      conditions.push(`dificultad = $${values.length}`);
    }
    if (materia) {
      values.push(materia);
      conditions.push(`materia = $${values.length}`);
    }

    if (conditions.length > 0) {
      baseQuery += ' WHERE ' + conditions.join(' AND ');
    }
    baseQuery += ' ORDER BY id';

    const { rows } = await pool.query(baseQuery, values);
    return res.json({ ok: true, preguntas: rows });
  } catch (err) {
    console.error('Error en GET /api/preguntas:', err);
    return res.status(500).json({ ok: false, error: 'Error al obtener preguntas' });
  }
});

router.post('/', async (req, res) => {
  console.log('Datos recibidos:', req.body);
  try {
    const {
      enunciado,
      opcion_a,
      opcion_b,
      opcion_c,
      opcion_d,
      correcta,
      dificultad,
      materia,
      autor_id,
    } = req.body;

    if (
      !enunciado ||
      !opcion_a ||
      !opcion_b ||
      !opcion_c ||
      !opcion_d ||
      !correcta ||
      !dificultad ||
      !materia ||
      !autor_id
    ) {
      return res.status(400).json({ ok: false, error: 'Faltan datos obligatorios' });
    }

    const opcionesValidas = ['a', 'b', 'c', 'd'];
    if (!opcionesValidas.includes(correcta)) {
      return res.status(400).json({ ok: false, error: 'Respuesta correcta inválida' });
    }

    const dificultadesValidas = ['baja', 'media', 'alta'];
    if (!dificultadesValidas.includes(dificultad)) {
      return res.status(400).json({ ok: false, error: 'Dificultad inválida' });
    }

    const materiasValidas = ['matematicas', 'lenguaje', 'ciencias'];
    if (!materiasValidas.includes(materia)) {
      return res.status(400).json({ ok: false, error: 'Materia inválida' });
    }

    const insertQuery = `
      INSERT INTO preguntas (
        enunciado, opcion_a, opcion_b, opcion_c, opcion_d, correcta, dificultad, materia, autor_id
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING id
    `;

    const { rows } = await pool.query(insertQuery, [
      enunciado,
      opcion_a,
      opcion_b,
      opcion_c,
      opcion_d,
      correcta,
      dificultad,
      materia,
      autor_id,
    ]);

    return res.status(201).json({ ok: true, id: rows[0].id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: 'Error al crear pregunta' });
  }
});

export default router;
