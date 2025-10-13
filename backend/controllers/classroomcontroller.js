import { google } from "googleapis";
import { pool } from "../db.js";

export const syncCursos = async (req, res) => {
  const { profesorId } = req.params;

  try {
    //buscar tokens en la tabla usuarios
    const result = await pool.query(
      "SELECT access_token, refresh_token, tipo FROM usuarios WHERE id = $1",
      [profesorId]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Usuario no encontrado" });

    const { access_token, refresh_token, tipo } = result.rows[0];

    if (tipo !== "profesor")
      return res.status(403).json({ error: "El usuario no es un profesor" });

    if (!refresh_token)
      return res.status(400).json({ error: "El usuario no tiene refresh token" });

    //configurar cliente OAuth2
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      access_token,
      refresh_token,
    });

    const classroom = google.classroom({ version: "v1", auth: oauth2Client });

    //obtener cursos del Classroom del profesor
    const response = await classroom.courses.list();
    const cursos = response.data.courses || [];

    //guardarlos en la tabla cursos y traer alumnos
    for (const curso of cursos) {
      //guardar curso en BD
      await pool.query(
        `INSERT INTO cursos (id_classroom, nombre, profesor_id, seccion)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id_classroom) DO NOTHING`,
        [curso.id, curso.name, profesorId, curso.section || null]
      );

      //obtener alumnos del curso con manejo de errores
      try {
        const alumnosResp = await classroom.courses.students.list({
          courseId: curso.id,
        });

        for (const alumno of curso.alumnos) {
          // Verificamos si el alumno ya existe en usuarios
          const userRes = await pool.query(
            "SELECT id FROM usuarios WHERE email = $1",
            [alumno.email]
          );

          let alumnoId;
          if (userRes.rows.length === 0) {
            // Si no existe, lo insertamos
            const insertRes = await pool.query(
              `INSERT INTO usuarios (nombre, email, tipo)
              VALUES ($1, $2, 'alumno')
              RETURNING id`,
              [alumno.nombre, alumno.email]
            );
            alumnoId = insertRes.rows[0].id;
          } else {
            alumnoId = userRes.rows[0].id;
          }

          // Asociar al alumno con el curso
          await pool.query(
            `INSERT INTO cursos_alumnos (curso_id, alumno_id)
            VALUES (
              (SELECT id FROM cursos WHERE id_classroom = $1),
              $2,
              $3,
              $4
            )
            ON CONFLICT (curso_id, email) DO NOTHING`,
            [curso.id, alumnoId, alumno.email, alumno.nombre]
          );
        }

        curso.alumnos =
          alumnosResp.data.students?.map((s) => ({
            id: s.userId,
            nombre: s.profile.name.fullName,
            email: s.profile.emailAddress,
          })) || [];
      } catch (err) {
        console.error(
          `Error al obtener alumnos del curso ${curso.name} (${curso.id}):`,
          err.message
        );
        curso.alumnos = [];
      }
    }

    //respuesta final
    res.json({
      mensaje: `✅ ${cursos.length} cursos sincronizados`,
      cursos,
    });
  } catch (error) {
    console.error("Error al sincronizar cursos:", error);
    res.status(500).json({ error: "Error al sincronizar cursos" });
  }
};
