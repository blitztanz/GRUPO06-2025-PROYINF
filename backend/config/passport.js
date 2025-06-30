import passport from 'passport';
import { pool } from '../db.js';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    done(null, rows[0]);
  } catch (err) {
    done(err, null);
  }
});