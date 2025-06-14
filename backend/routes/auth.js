import { Router } from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { pool } from '../db.js';

const router = Router();

// Configura Passport con Google OAuth2
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:4000/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    const nombre = profile.displayName;
    const googleId = profile.id;

    // Busca usuario por email
    const { rows } = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [email]);
    let usuario;

    if (rows.length === 0) {
      // Si no existe, crea nuevo usuario con tipo 'externo' o lo que prefieras
      const insertRes = await pool.query(
        'INSERT INTO usuarios (nombre, correo, tipo, google_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [nombre, email, 'externo', googleId]
      );
      usuario = insertRes.rows[0];
    } else {
      usuario = rows[0];
      // Opcional: actualizar google_id si no está o ha cambiado
      if (!usuario.google_id) {
        await pool.query('UPDATE usuarios SET google_id = $1 WHERE id = $2', [googleId, usuario.id]);
      }
    }

    return done(null, usuario);
  } catch (error) {
    return done(error, null);
  }
}));

// Serializa el usuario para la sesión (usa id)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserializa usuario (busca en DB por id)
passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query('SELECT id, nombre, correo, tipo FROM usuarios WHERE id = $1', [id]);
    if (rows.length === 0) {
      return done(null, false);
    }
    done(null, rows[0]);
  } catch (error) {
    done(error, null);
  }
});

// Ruta para iniciar login con Google
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback que recibe Google y termina autenticación
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Aquí puedes redirigir al frontend o enviar token si usas JWT
    res.redirect('http://localhost:3000'); // o donde esté tu frontend
  }
);

// Tus rutas existentes (las puedes mantener sin cambios)
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

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, nombre, correo 
         FROM usuarios 
        WHERE tipo = 'alumno'
        ORDER BY nombre`
    );
    return res.json({ ok: true, alumnos: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: 'Error al obtener alumnos' });
  }
});

export default router;
