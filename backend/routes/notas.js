import { Router } from 'express'
import { pool }  from '../db.js'
const router = Router()

// GET /api/notas?alumnoId
router.get('/', async (req, res) => {
  const alumnoId = Number.parseInt(req.query.alumnoId, 10)
  if (!alumnoId) return res.status(400).json({ ok:false, error:'Falta alumnoId' })
  try {
    const { rows } = await pool.query(`
      SELECT n.reporte_id, n.valor, r.titulo, r.creado
        FROM notas n
   LEFT JOIN reportes r ON r.id = n.reporte_id
       WHERE n.alumno_id = $1
    ORDER BY r.creado DESC
    `, [alumnoId])
    return res.json({ ok:true, notas: rows })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok:false, error:'Error al obtener notas' })
  }
})

// POST /api/notas
router.post('/', async (req, res) => {
  const { alumnoId, reporteId, valor } = req.body
  if (!alumnoId || !reporteId || valor == null)
    return res.status(400).json({ ok:false, error:'Datos incompletos' })
  try {
    const { rows } = await pool.query(`
      INSERT INTO notas (alumno_id, reporte_id, valor)
      VALUES ($1,$2,$3)
      ON CONFLICT (alumno_id,reporte_id) DO UPDATE
        SET valor = EXCLUDED.valor
      RETURNING alumno_id, reporte_id, valor
    `, [alumnoId, reporteId, valor])
    return res.json({ ok:true, nota: rows[0] })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok:false, error:'Error al guardar nota' })
  }
})

export default router
