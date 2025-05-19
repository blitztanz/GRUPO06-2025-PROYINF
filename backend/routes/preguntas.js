import { Router } from 'express'
import { pool }  from '../db.js'
const router = Router()

// GET /api/preguntas
router.get('/', async (_, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, enunciado, opcion_a, opcion_b, opcion_c, opcion_d, correcta, autor_id FROM preguntas ORDER BY id'
    )
    return res.json({ ok: true, preguntas: rows })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok: false, error: 'Error al obtener preguntas' })
  }
})

export default router
