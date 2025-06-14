// backend/config/passport.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { pool } from '../db.js';  // tu conexión a PostgreSQL

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
  try {
    // Buscar usuario en BD por google_id
    const googleId = profile.id;
    const email = profile.emails[0].value;
    const nombre = profile.displayName;
    const avatar = profile.photos[0].value;

    const { rows } = await pool.query('SELECT * FROM usuarios WHERE google_id = $1', [googleId]);

    if (rows.length > 0) {
      // Usuario existe
      return done(null, rows[0]);
    } else {
      // Crear usuario nuevo
      const insertQuery = `INSERT INTO usuarios (tipo, nombre, correo, google_id, avatar_url) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
      const tipo = 'externo'; // o define la lógica para tipo aquí
      const { rows: newUser } = await pool.query(insertQuery, [tipo, nombre, email, googleId, avatar]);
      return done(null, newUser[0]);
    }
  } catch (err) {
    return done(err, null);
  }
}));

// Serializar usuario para sesión (puedes adaptar según cómo manejes sesiones)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    if (rows.length > 0) done(null, rows[0]);
    else done(null, false);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
