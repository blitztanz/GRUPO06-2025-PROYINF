import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// Validar ID de alumno
const validateAlumnoId = (alumnoId) => {
  if (!alumnoId) return { ok: false, error: 'Se requiere alumnoId' };
  if (isNaN(Number(alumnoId))) return { ok: false, error: 'alumnoId debe ser numérico' };
  return { ok: true };
};

router.post('/', async (req, res) => {
  try {
    const { titulo, descripcion, materia, tiempo_limite, autor_id } = req.body;

    if (!titulo || !materia || !tiempo_limite || !autor_id) {
      return res.status(400).json({ ok: false, error: 'Faltan datos obligatorios' });
    }

    const { rows } = await pool.query(
      `INSERT INTO ensayos (titulo, descripcion, materia, tiempo_limite, autor_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [titulo, descripcion, materia, tiempo_limite, autor_id]
    );

    return res.status(201).json({ ok: true, id: rows[0].id });
  } catch (err) {
    console.error('Error en POST /api/ensayos:', err);
    return res.status(500).json({ ok: false, error: 'Error al crear ensayo' });
  }
});

// Asociar pregunta a ensayo
router.post('/ensayos_preguntas', async (req, res) => {
  try {
    const { ensayo_id, pregunta_id, orden } = req.body;

    if (!ensayo_id || !pregunta_id || orden == null) {
      return res.status(400).json({ ok: false, error: 'Faltan datos obligatorios' });
    }

    await pool.query(
      `INSERT INTO ensayos_preguntas (ensayo_id, pregunta_id, orden)
       VALUES ($1, $2, $3)`,
      [ensayo_id, pregunta_id, orden]
    );

    return res.status(201).json({ ok: true });
  } catch (err) {
    console.error('Error en POST /api/ensayos_preguntas:', err);
    return res.status(500).json({ ok: false, error: 'Error al asociar pregunta' });
  }
});

// Obtener resultados completos de ensayos para un alumno
router.get('/resultados-alumno', async (req, res) => {
  console.log('Query params recibidos:', req.query);
  
  if (!req.query.alumnoId) {
    return res.status(400).json({ 
      ok: false, 
      error: 'Parámetro alumnoId es requerido' 
    });
  }

  const alumnoId = parseInt(req.query.alumnoId, 10);
  if (isNaN(alumnoId)) {
    return res.status(400).json({ 
      ok: false, 
      error: 'alumnoId debe ser un número válido' 
    });
  }

  try {
    const queryText = `
      SELECT 
        re.ensayo_id,
        e.titulo,
        re.puntaje,
        re.total_preguntas,
        re.fecha_completado,
        e.materia
      FROM resultados_ensayos re
      JOIN ensayos e ON e.id = re.ensayo_id
      WHERE re.alumno_id = $1
      ORDER BY re.fecha_completado DESC
    `;
    
    console.log('Ejecutando query:', queryText, 'con alumnoId:', alumnoId);
    
    const { rows } = await pool.query(queryText, [alumnoId]);

    return res.json({ 
      ok: true, 
      resultados: rows 
    });
  } catch (err) {
    console.error('Error en la consulta SQL:', err);
    return res.status(500).json({ 
      ok: false, 
      error: 'Error en la base de datos',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Obtener resultados específicos de un ensayo para un alumno
router.get('/:id/resultados', async (req, res) => {
  const { id } = req.params;
  const { alumnoId } = req.query;

  if (alumnoId) {
    // Lógica existente para resultados de alumno específico
    const validation = validateAlumnoId(alumnoId);
    if (!validation.ok) return res.status(400).json(validation);

    try {
      const { rows } = await pool.query(`
        SELECT 
          re.puntaje,
          re.total_preguntas,
          re.fecha_completado,
          re.tiempo_empleado,
          e.titulo,
          e.materia,
          (SELECT COUNT(*) FROM ensayos_preguntas WHERE ensayo_id = $1) as total_preguntas_ensayo
        FROM resultados_ensayos re
        JOIN ensayos e ON e.id = re.ensayo_id
        WHERE re.ensayo_id = $1 AND re.alumno_id = $2
      `, [id, alumnoId]);

      if (rows.length === 0) {
        return res.status(404).json({ ok: false, error: 'Resultados no encontrados' });
      }

      return res.json({ ok: true, resultado: rows[0] });
    } catch (err) {
      console.error(`Error en GET /api/ensayos/${id}/resultados (alumno):`, err);
      return res.status(500).json({ ok: false, error: 'Error al obtener resultados' });
    }
  } 
  else {
    // Nueva lógica para todos los resultados del ensayo
    try {
      const { rows } = await pool.query(`
        SELECT 
          re.ensayo_id,
          re.alumno_id,
          u.nombre as alumno_nombre,
          re.puntaje,
          re.total_preguntas,
          re.fecha_completado,
          re.tiempo_empleado
        FROM resultados_ensayos re
        JOIN usuarios u ON u.id = re.alumno_id
        WHERE re.ensayo_id = $1
        ORDER BY re.fecha_completado DESC
      `, [id]);

      return res.json({ ok: true, resultados: rows });
    } catch (err) {
      console.error(`Error en GET /api/ensayos/${id}/resultados (profesor):`, err);
      return res.status(500).json({ ok: false, error: 'Error al obtener resultados' });
    }
  }
});

// Obtener alumnos que respondieron correctamente o incorrectamente a una pregunta específica de un ensayo
router.get('/:ensayoId/preguntas/:preguntaId/alumnos', async (req, res) => {
  const ensayoId = parseInt(req.params.ensayoId, 10);
  const preguntaId = parseInt(req.params.preguntaId, 10);
  const correcta = req.query.correcta === 'true';

  if (isNaN(ensayoId) || isNaN(preguntaId)) {
    return res.status(400).json({ ok: false, error: 'ensayoId o preguntaId inválido' });
  }

  try {
    const { rows } = await pool.query(
      `SELECT 
         u.id, 
         u.nombre, 
         COALESCE(r.respuesta_elegida, 'No respondió') as respuesta_elegida,
         r.es_correcta
       FROM respuestas_ensayos r
       JOIN usuarios u ON u.id = r.alumno_id
       WHERE r.ensayo_id = $1
         AND r.pregunta_id = $2
         AND r.es_correcta = $3
       ORDER BY u.nombre ASC`,
      [ensayoId, preguntaId, correcta]
    );

    res.json({ ok: true, alumnos: rows });
  } catch (err) {
    console.error('Error en GET /ensayos/:ensayoId/preguntas/:preguntaId/alumnos:', err);
    res.status(500).json({ ok: false, error: 'Error al obtener alumnos' });
  }
});


// Obtener ensayos asignados a un alumno
router.get('/', async (req, res) => {
  const { alumnoId, profesorId } = req.query;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  if (alumnoId) {
    const validation = validateAlumnoId(alumnoId);
    if (!validation.ok) return res.status(400).json(validation);
    
    try {
      const countQuery = `
        SELECT COUNT(*)
        FROM ensayos e
        JOIN ensayos_asignados ea ON e.id = ea.ensayo_id
        WHERE ea.alumno_id = $1 AND ea.completado = false
      `;
      const countResult = await pool.query(countQuery, [alumnoId]);
      const totalItems = parseInt(countResult.rows[0].count);
      const totalPages = Math.ceil(totalItems / limit);

      const dataQuery = `
        SELECT 
          e.id, 
          e.titulo, 
          e.materia, 
          e.tiempo_limite, 
          ea.fecha_limite,
          e.descripcion
        FROM ensayos e
        JOIN ensayos_asignados ea ON e.id = ea.ensayo_id
        WHERE ea.alumno_id = $1 AND ea.completado = false
        ORDER BY ea.fecha_limite ASC
        LIMIT $2 OFFSET $3  -- <-- MODIFICADO
      `;
      
      const { rows } = await pool.query(dataQuery, [alumnoId, limit, offset]);

      return res.json({
        ok: true,
        ensayos: rows,
        totalPages: totalPages,
        currentPage: page,
        totalItems: totalItems
      });

    } catch (err) {
      console.error('Error en GET /api/ensayos (alumno):', err);
      return res.status(500).json({ ok: false, error: 'Error al obtener ensayos' });
    }
  } 
  else if (profesorId) {
    try {
      const { rows } = await pool.query(`
        SELECT 
          e.id, e.titulo, e.descripcion, e.materia, e.tiempo_limite, e.fecha_creacion,
          COUNT(ep.pregunta_id) as num_preguntas,
          COUNT(ea.alumno_id) FILTER (WHERE ea.completado = true) as num_completados
        FROM ensayos e
        LEFT JOIN ensayos_preguntas ep ON e.id = ep.ensayo_id
        LEFT JOIN ensayos_asignados ea ON e.id = ea.ensayo_id
        WHERE e.autor_id = $1
        GROUP BY e.id
        ORDER BY e.fecha_creacion DESC
      `, [profesorId]); 

      return res.json({ ok: true, ensayos: rows });
    } catch (err) {
      console.error('Error en GET /api/ensayos (profesor):', err);
      return res.status(500).json({ ok: false, error: 'Error al obtener ensayos' });
    }
  } else {
    try {
      const { rows } = await pool.query(`
        SELECT 
          e.id, e.titulo, e.descripcion, e.materia, e.tiempo_limite,
          e.fecha_creacion, e.autor_id, COUNT(ep.pregunta_id) as num_preguntas
        FROM ensayos e
        LEFT JOIN ensayos_preguntas ep ON e.id = ep.ensayo_id
        GROUP BY e.id
        ORDER BY e.fecha_creacion DESC
      `);
      return res.json({ ok: true, ensayos: rows });
    } catch (err) {
      console.error('Error en GET /api/ensayos (externo):', err);
      return res.status(500).json({ ok: false, error: 'Error al obtener ensayos' });
    }
  }
});

// Obtener detalles de un ensayo específico
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query(`
      SELECT 
        id, 
        titulo, 
        descripcion, 
        materia, 
        tiempo_limite,
        autor_id
      FROM ensayos
      WHERE id = $1
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ 
        ok: false, 
        error: 'Ensayo no encontrado' 
      });
    }

    return res.json({ 
      ok: true, 
      ensayo: rows[0] 
    });
  } catch (err) {
    console.error(`Error en GET /api/ensayos/${id}:`, err);
    return res.status(500).json({ 
      ok: false, 
      error: 'Error al obtener el ensayo' 
    });
  }
});

// Obtener preguntas de un ensayo con orden correcto
router.get('/:id/preguntas', async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query(`
      SELECT 
        p.id, 
        p.enunciado, 
        p.opcion_a, 
        p.opcion_b, 
        p.opcion_c, 
        p.opcion_d,
        p.correcta,
        p.dificultad,
        ep.orden
      FROM preguntas p
      JOIN ensayos_preguntas ep ON p.id = ep.pregunta_id
      WHERE ep.ensayo_id = $1
      ORDER BY ep.orden ASC
    `, [id]);

    return res.json({ 
      ok: true, 
      preguntas: rows,
      total: rows.length 
    });
  } catch (err) {
    console.error(`Error en GET /api/ensayos/${id}/preguntas:`, err);
    return res.status(500).json({ 
      ok: false, 
      error: 'Error al obtener preguntas' 
    });
  }
});

// Guardar respuestas de un ensayo
router.post('/:id/respuestas', async (req, res) => {
  const { id } = req.params;
  const { alumnoId, respuestas } = req.body;

  // Validaciones
  if (!alumnoId || !respuestas || typeof respuestas !== 'object') {
    return res.status(400).json({ 
      ok: false, 
      error: 'Datos incompletos o inválidos' 
    });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Verificar si el ensayo está asignado al alumno
    const ensayoAsignado = await client.query(
      `SELECT 1 FROM ensayos_asignados 
       WHERE ensayo_id = $1 AND alumno_id = $2 AND completado = false`,
      [id, alumnoId]
    );

    if (ensayoAsignado.rows.length === 0) {
      return res.status(403).json({ 
        ok: false, 
        error: 'Ensayo no asignado o ya completado' 
      });
    }

    // 1. Guardar cada respuesta
    for (const [preguntaId, respuesta] of Object.entries(respuestas)) {
      if (!['a', 'b', 'c', 'd'].includes(respuesta)) {
        throw new Error(`Respuesta inválida para pregunta ${preguntaId}`);
      }

      await client.query(`
        INSERT INTO respuestas_ensayos 
        (ensayo_id, alumno_id, pregunta_id, respuesta_elegida, es_correcta)
        VALUES ($1, $2, $3, $4, (
          SELECT correcta = $4 FROM preguntas WHERE id = $3
        ))
      `, [id, alumnoId, preguntaId, respuesta]);
    }

    // 2. Calcular puntaje
    const { rows: result } = await client.query(`
      SELECT 
        COUNT(*) FILTER (WHERE es_correcta = true) as correctas,
        COUNT(*) as total
      FROM respuestas_ensayos
      WHERE ensayo_id = $1 AND alumno_id = $2
    `, [id, alumnoId]);

    // 3. Guardar resultado general
    await client.query(`
      INSERT INTO resultados_ensayos 
      (ensayo_id, alumno_id, puntaje, total_preguntas)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (ensayo_id, alumno_id) DO UPDATE
      SET puntaje = EXCLUDED.puntaje,
          total_preguntas = EXCLUDED.total_preguntas,
          fecha_completado = NOW(),
          tiempo_empleado = EXCLUDED.tiempo_empleado
    `, [id, alumnoId, result[0].correctas, result[0].total]);

    // 4. Marcar como completado
    await client.query(`
      UPDATE ensayos_asignados
      SET completado = true
      WHERE ensayo_id = $1 AND alumno_id = $2
    `, [id, alumnoId]);

    await client.query('COMMIT');
    return res.json({ 
      ok: true,
      puntaje: result[0].correctas,
      total: result[0].total 
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(`Error en POST /api/ensayos/${id}/respuestas:`, err);
    return res.status(500).json({ 
      ok: false, 
      error: 'Error al guardar respuestas',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  } finally {
    client.release();
  }
});

// Obtener preguntas con respuestas de un alumno para un ensayo
router.get('/:id/preguntas-respuestas', async (req, res) => {
  const { id } = req.params;
  const { alumnoId } = req.query;
  const validation = validateAlumnoId(alumnoId);
  if (!validation.ok) return res.status(400).json(validation);

  try {
    const { rows } = await pool.query(`
      SELECT 
        p.id,
        p.enunciado,
        p.opcion_a,
        p.opcion_b,
        p.opcion_c,
        p.opcion_d,
        p.correcta,
        p.dificultad,
        re.respuesta_elegida,
        re.es_correcta,
        ep.orden
      FROM preguntas p
      JOIN ensayos_preguntas ep ON p.id = ep.pregunta_id
      LEFT JOIN respuestas_ensayos re ON 
        re.pregunta_id = p.id AND 
        re.ensayo_id = $1 AND 
        re.alumno_id = $2
      WHERE ep.ensayo_id = $1
      ORDER BY ep.orden ASC
    `, [id, alumnoId]);

    return res.json({ 
      ok: true, 
      preguntas: rows,
      total: rows.length 
    });
  } catch (err) {
    console.error(`Error en GET /api/ensayos/${id}/preguntas-respuestas:`, err);
    return res.status(500).json({ 
      ok: false, 
      error: 'Error al obtener preguntas' 
    });
  }
});

// Obtener preguntas con % de respuestas correctas
router.get('/:id/preguntas-respuestas-global', async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query(`
      SELECT 
        p.id AS pregunta_id,
        p.enunciado,
        ep.orden,
        COUNT(re.*) AS total_respuestas,
        SUM(CASE WHEN re.es_correcta THEN 1 ELSE 0 END) AS correctas,
        CASE 
          WHEN COUNT(re.*) = 0 THEN 0
          ELSE ROUND(100.0 * SUM(CASE WHEN re.es_correcta THEN 1 ELSE 0 END) / COUNT(re.*), 2)
        END AS porcentaje_correctas
      FROM preguntas p
      JOIN ensayos_preguntas ep ON ep.pregunta_id = p.id
      LEFT JOIN respuestas_ensayos re 
        ON re.pregunta_id = p.id AND re.ensayo_id = ep.ensayo_id
      WHERE ep.ensayo_id = $1
      GROUP BY p.id, p.enunciado, ep.orden
      ORDER BY ep.orden ASC
    `, [id]);

    return res.json({ ok: true, preguntas: rows });
  } catch (err) {
    console.error(`Error en GET /api/ensayos/${id}/preguntas-respuestas-global:`, err);
    return res.status(500).json({ 
      ok: false, 
      error: 'Error al obtener preguntas con porcentaje de aciertos'
    });
  }
});

// Asignar ensayo a alumno
router.post('/asignar', async (req, res) => {
  try {
    const { ensayoId, alumnoId, fechaLimite } = req.body;

    if (!ensayoId || !alumnoId || !fechaLimite) {
      return res.status(400).json({ ok: false, error: 'Faltan datos obligatorios' });
    }

    // Verificar que el ensayo existe y pertenece al profesor
    const { rows: ensayoRows } = await pool.query(
      'SELECT autor_id FROM ensayos WHERE id = $1',
      [ensayoId]
    );

    if (ensayoRows.length === 0) {
      return res.status(404).json({ ok: false, error: 'Ensayo no encontrado' });
    }

    // Verificar que el alumno existe
    const { rows: alumnoRows } = await pool.query(
      'SELECT 1 FROM usuarios WHERE id = $1 AND tipo = $2',
      [alumnoId, 'alumno']
    );

    if (alumnoRows.length === 0) {
      return res.status(404).json({ ok: false, error: 'Alumno no encontrado' });
    }

    // Asignar ensayo
    await pool.query(
      `INSERT INTO ensayos_asignados (ensayo_id, alumno_id, fecha_limite)
       VALUES ($1, $2, $3)
       ON CONFLICT (ensayo_id, alumno_id) DO UPDATE
       SET fecha_limite = EXCLUDED.fecha_limite,
           completado = false`,
      [ensayoId, alumnoId, fechaLimite]
    );

    return res.json({ ok: true });
  } catch (err) {
    console.error('Error en POST /api/ensayos/asignar:', err);
    return res.status(500).json({ ok: false, error: 'Error al asignar ensayo' });
  }
});

export default router;