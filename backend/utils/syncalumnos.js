// backend/utils/syncalumnos.js
import { google } from "googleapis";
import { pool } from "../db.js";
import { getAccessTokenFromRefresh } from "./googleclassroom.js";

export async function syncAlumnos(userId) {
  try {
    // 1️⃣ Obtener el refresh token del profesor
    const token = await getAccessTokenFromRefresh(userId);
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: token });

    const classroom = google.classroom({ version: "v1", auth: oauth2Client });

    // 2️⃣ Obtener los cursos del profesor desde la BD
    const { rows: cursos } = await pool.query(
      "SELECT id, id_classroom FROM cursos WHERE profesor_id = $1",
      [userId]
    );

    let totalAlumnos = 0;

    // 3️⃣ Recorrer cada curso y traer a sus alumnos
    for (const curso of cursos) {
      const res = await classroom.courses.students.list({
        courseId: curso.id_classroom,
      });

      const alumnos = res.data.students || [];

      for (const alumno of alumnos) {
        const nombre = alumno.profile.name.fullName;
        const email = alumno.profile.emailAddress;
        const googleId = alumno.userId;
        const avatar = alumno.profile.photoUrl;

        // 4️⃣ Insertar alumno si no existe
        const result = await pool.query(
          `INSERT INTO usuarios (nombre, correo, tipo, google_id, avatar_url)
           VALUES ($1, $2, 'alumno', $3, $4)
           ON CONFLICT (correo) DO UPDATE SET
             google_id = EXCLUDED.google_id,
             avatar_url = EXCLUDED.avatar_url
           RETURNING id`,
          [nombre, email, googleId, avatar]
        );

        const alumnoId = result.rows[0].id;

        // 5️⃣ Vincularlo al curso
        await pool.query(
          `INSERT INTO cursos_alumnos (curso_id, alumno_id)
           VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [curso.id, alumnoId]
        );

        totalAlumnos++;
      }
    }

    console.log(`✅ Sincronización completada: ${totalAlumnos} alumnos`);
    return { mensaje: "Alumnos sincronizados correctamente", totalAlumnos };
  } catch (error) {
    console.error("❌ Error al sincronizar alumnos:", error);
    throw error;
  }
}
