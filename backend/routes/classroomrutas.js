import express from "express";
import { google } from "googleapis";
import { pool } from "../db.js";
import { getAuthenticatedClient } from "../utils/googleclassroom.js";

const router = express.Router();

// Sincroniza cursos y alumnos del profesor
router.get("/sync-cursos/:profesorId", async (req, res) => {
  try {
    const { profesorId } = req.params;

    // Traer datos del profesor
    const { rows } = await pool.query(
      "SELECT id, nombre, tipo, refresh_token FROM usuarios WHERE id = $1",
      [profesorId]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "Usuario no encontrado" });

    const user = rows[0];
    if (user.tipo !== "profesor")
      return res.status(403).json({ error: "Solo los profesores pueden sincronizar cursos" });

    if (!user.refresh_token)
      return res.status(400).json({ error: "No se encontró refresh_token en la BD" });

    const auth = await getAuthenticatedClient(user.refresh_token);
    const classroom = google.classroom({ version: "v1", auth });

    // Obtener cursos activos
    const response = await classroom.courses.list({ courseStates: ["ACTIVE"] });
    const cursosGoogle = response.data.courses || [];

    if (cursosGoogle.length === 0) {
      return res.json({ mensaje: "No hay cursos activos", cursos: [] });
    }

    const cursos = [];

    for (const curso of cursosGoogle) {
      // Insertar curso en DB
      await pool.query(
        `INSERT INTO cursos (id_classroom, nombre, seccion, profesor_id)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id_classroom) DO NOTHING`,
        [curso.id, curso.name, curso.section || null, user.id]
      );

      // Inicializamos alumnos como array vacío
      let alumnos = [];

      // Intentamos sincronizar alumnos
      try {
        const resAlumnos = await classroom.courses.students.list({ courseId: curso.id });
        alumnos = (resAlumnos.data.students || []).map(a => ({
          id: a.userId,
          nombre: a.profile.name.fullName,
          email: a.profile.emailAddress
        }));

        // Insertar alumnos en DB
        for (const alumno of alumnos) {
          const result = await pool.query(
            `INSERT INTO usuarios (nombre, correo, tipo, google_id)
             VALUES ($1, $2, 'alumno', $3)
             ON CONFLICT (correo) DO UPDATE SET google_id = EXCLUDED.google_id
             RETURNING id`,
            [alumno.nombre, alumno.email, alumno.id]
          );
          const alumnoId = result.rows[0].id;

          await pool.query(
            `INSERT INTO cursos_alumnos (curso_id, alumno_id)
             VALUES ($1, $2)
             ON CONFLICT DO NOTHING`,
            [curso.id, alumnoId]
          );
        }
      } catch (err) {
        console.error(`Error sincronizando alumnos del curso ${curso.name}:`, err);
        // alumnos queda como []
      }

      cursos.push({ id: curso.id, name: curso.name, alumnos });
    }

    console.log(`✅ ${cursos.length} cursos sincronizados para ${user.nombre}`);
    res.json({ mensaje: "Cursos y alumnos sincronizados", cursos });

  } catch (error) {
    console.error("❌ Error al sincronizar cursos:", error.response?.data || error.message || error);
    res.status(500).json({ error: "Error al sincronizar cursos" });
  }
});

export default router;
