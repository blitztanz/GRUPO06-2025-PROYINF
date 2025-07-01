import { Router } from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { pool } from '../db.js';

const router = Router();

// ======================
// ESTRATEGIA DE GOOGLE
// ======================
passport.use('google', new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const { id, displayName, emails, photos } = profile;
    const email = emails[0].value;
    const dominio = email.split('@')[1];

    // Determina el tipo de usuario
    let tipo = 'alumno';
    if (dominio.includes('profesor.') || dominio.includes('docente.')) {
      tipo = 'profesor';
    } else if (dominio.includes('externo.')) {
      tipo = 'externo';
    }

    // Primero intenta obtener el usuario existente
    const { rows: existingUsers } = await pool.query(
      'SELECT * FROM usuarios WHERE correo = $1', 
      [email]
    );

    let user;
    if (existingUsers.length > 0) {
      // Usuario existe, actualiza datos si es necesario
      user = existingUsers[0];
      await pool.query(
        'UPDATE usuarios SET google_id = $1, avatar_url = $2 WHERE id = $3',
        [id, photos[0]?.value, user.id]
      );
    } else {
      // Usuario nuevo, inserta
      const { rows } = await pool.query(
        `INSERT INTO usuarios (nombre, correo, tipo, google_id, avatar_url)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [displayName, email, tipo, id, photos[0]?.value]
      );
      user = rows[0];
    }

    done(null, user);
  } catch (error) {
    done(error);
  }
}));

// ======================
// RUTAS
// ======================

// Google Login
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google Callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Redirige dinámicamente según el tipo
    const tipo = req.user.tipo;
    let redirectUrl = '/menu_alumno'; // Valor por defecto
    
    if (tipo === 'profesor') {
      redirectUrl = '/menu_profesor';
    } else if (tipo === 'externo') {
      redirectUrl = '/menu_externo';
    }
    
    res.redirect(`http://localhost:3000${redirectUrl}`);
  }
);

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy(err => {  // Destruye la sesión
    if (err) {
      return res.status(500).json({ error: 'Error al cerrar sesión' });
    }
    res.clearCookie('connect.sid'); // Limpia la cookie de sesión
    res.status(200).json({ success: true });
  });
});

// Datos del usuario logueado
router.get('/user', (req, res) => {
  res.json(req.user || null);
});

export default router;