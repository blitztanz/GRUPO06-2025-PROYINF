import { Router } from 'express'
import { pool }  from '../db.js'
const router = Router()

// GET /api/reportes          → lista todos los reportes
router.get('/', async (_, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, titulo, creado FROM reportes ORDER BY creado DESC`
    )
    res.json({ ok: true, reportes: rows })
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false, error: 'Error al obtener reportes' })
  }
})

// GET /api/reportes/:id      → detalles (incluye preguntas)
router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const { rows } = await pool.query(
      `SELECT p.id, p.enunciado, p.opcion_a, p.opcion_b, p.opcion_c, p.opcion_d, p.correcta
         FROM reportes_preguntas rp
    INNER JOIN preguntas p ON p.id = rp.pregunta_id
        WHERE rp.reporte_id = $1`,
      [id]
    )
    res.json({ ok: true, preguntas: rows })
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false, error: 'Error al cargar reporte' })
  }
})

// POST /api/reportes         → crea un reporte con preguntas
// { titulo: string, preguntaIds: number[] }
router.post('/', async (req, res) => {
  const { titulo, preguntaIds } = req.body
  if (!titulo || !Array.isArray(preguntaIds) || preguntaIds.length === 0)
    return res.status(400).json({ ok: false, error: 'Datos incompletos' })

  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const { rows } = await client.query(
      `INSERT INTO reportes (titulo) VALUES ($1) RETURNING id, creado`,
      [titulo]
    )
    const reporteId = rows[0].id

    const insertValues = preguntaIds
      .map((_, i) => `($1, $${i+2})`).join(',')
    const params = [reporteId, ...preguntaIds]
    await client.query(
      `INSERT INTO reportes_preguntas (reporte_id, pregunta_id) VALUES ${insertValues}`,
      params
    )

    await client.query('COMMIT')
    res.status(201).json({ ok: true, reporte: { id: reporteId, titulo, creado: rows[0].creado } })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error(err)
    res.status(500).json({ ok: false, error: 'Error al crear reporte' })
  } finally {
    client.release()
  }
})

export default router
