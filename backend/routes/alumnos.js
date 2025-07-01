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
     ORDER BY nombre`  // ← Cambiado de 'id' a 'nombre'
    )
    res.json({ ok: true, alumnos: rows })
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false, error: 'Error al obtener alumnos' })
  }
})

// Obtener cualquier usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, nombre, correo, tipo 
       FROM usuarios 
       WHERE id = $1`,
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });
    }
    
    res.json({ ok: true, usuario: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Error al obtener usuario' });
  }
});

export default router
