import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import { pool } from "../db.js";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: [
        "profile",
        "email",
        "https://www.googleapis.com/auth/classroom.courses.readonly",
        "https://www.googleapis.com/auth/classroom.rosters.readonly",
      ],
      accessType: "offline", // 🔹 Necesario para obtener refresh_token
      prompt: "consent",     // 🔹 Fuerza a Google a devolverlo siempre
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id, displayName, emails, photos } = profile;
        const email = emails[0].value;
        const dominio = email.split("@")[1];

        // Determinar tipo
        let tipo = "alumno";
        if (dominio.includes("profesor.") || dominio.includes("docente.")) tipo = "profesor";
        else if (dominio.includes("externo.")) tipo = "externo";

        // Buscar usuario existente
        const { rows: existingUsers } = await pool.query(
          "SELECT * FROM usuarios WHERE correo = $1",
          [email]
        );

        let user;
        if (existingUsers.length > 0) {
          user = existingUsers[0];
          await pool.query(
            `UPDATE usuarios 
             SET google_id = $1, avatar_url = $2, refresh_token = COALESCE($3, refresh_token)
             WHERE id = $4`,
            [id, photos[0]?.value, refreshToken, user.id]
          );
        } else {
          const { rows } = await pool.query(
            `INSERT INTO usuarios (nombre, correo, tipo, google_id, avatar_url, refresh_token)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [displayName, email, tipo, id, photos[0]?.value, refreshToken || null]
          );
          user = rows[0];
        }

        user.accessToken = accessToken;
        console.log("✅ Usuario autenticado:", user.nombre, "-", tipo);
        return done(null, user);
      } catch (error) {
        console.error("❌ Error al autenticar usuario:", error);
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM usuarios WHERE id = $1", [id]);
    done(null, rows[0]);
  } catch (err) {
    done(err, null);
  }
});

export default passport;