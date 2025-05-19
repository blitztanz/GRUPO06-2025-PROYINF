import { Router } from 'express';
import { pool } from '../db.js';
const router = Router();

router.get('/login', async (req, res) => {
  const { tipo } = req.query;
  if (!['profesor','alumno','externo'].includes(tipo)) {
    return res.status(400).json({ ok: false, error: 'Tipo inválido' });
  }
  try {
    const { rows } = await pool.query(
      'SELECT id, nombre, correo FROM usuarios WHERE tipo = $1',
      [tipo]
    );
    return res.json({ ok: true, usuarios: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: 'Error en BD' });
  }
});

// GET /api/alumnos
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, nombre, correo 
         FROM usuarios 
        WHERE tipo = 'alumno'
        ORDER BY nombre`
    )
    return res.json({ ok: true, alumnos: rows })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok: false, error: 'Error al obtener alumnos' })
  }
})


export default router;
