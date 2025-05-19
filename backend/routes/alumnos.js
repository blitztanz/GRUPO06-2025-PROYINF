import { Router } from 'express'
import { pool } from '../db.js'
const router = Router()

// GET /api/alumnos
router.get('/', async (_, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, nombre, correo 
         FROM usuarios 
        WHERE tipo = 'alumno'
     ORDER BY id`
    )
    res.json({ ok: true, alumnos: rows })
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false, error: 'Error al obtener alumnos' })
  }
})

export default router
