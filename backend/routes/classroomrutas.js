// backend/routes/classroomrutas.js
import express from "express";
import { google } from "googleapis";
import { pool } from "../db.js";
import { getAuthenticatedClient } from "../utils/googleclassroom.js";
import { syncCursos } from "../controllers/classroomcontroller.js";
import { syncAlumnos } from "../utils/syncalumnos.js";
//import { obtenerCursosConAlumnos } from "../controllers/classroomcontroller.js";


const router = express.Router();

// 🔹 Sincroniza cursos del profesor usando su refresh_token
router.get("/sync-cursos/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // 1️⃣ Buscar al profesor en la BD
    const { rows } = await pool.query(
      "SELECT id, nombre, tipo, refresh_token FROM usuarios WHERE id = $1",
      [userId]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "Usuario no encontrado" });

    const user = rows[0];

    if (user.tipo !== "profesor")
      return res.status(403).json({ error: "Solo los profesores pueden sincronizar cursos" });

    if (!user.refresh_token)
      return res.status(400).json({ error: "No se encontró refresh_token en la BD" });

    // 2️⃣ Obtener cliente autenticado con refresh_token
    const auth = await getAuthenticatedClient(user.refresh_token);

    // 3️⃣ Llamar a la API de Google Classroom
    const classroom = google.classroom({ version: "v1", auth });
    const response = await classroom.courses.list({ courseStates: ["ACTIVE"] });

    const cursos = response.data.courses || [];

    //guardar los cursos
    for (const curso of cursos) {
      await pool.query(
        `INSERT INTO cursos (id_classroom, nombre, profesor_id)
        VALUES ($1, $2, $3)
        ON CONFLICT (id_classroom) DO NOTHING`,
        [curso.id, curso.name, user.id]
      );
    }

    console.log(`✅ ${cursos.length} cursos sincronizados para ${user.nombre}`);
    res.json({ cursos });

  } catch (error) {
    console.error("❌ Error al sincronizar cursos:", error.response?.data || error.message || error);
    res.status(500).json({ error: "Error al sincronizar cursos" });
  }
});

router.get("/sync-cursos/:profesorId", syncCursos);

router.get("/sync-alumnos/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const resultado = await syncAlumnos(userId);
    res.json(resultado);
  } catch (error) {
    console.error("Error al sincronizar alumnos:", error);
    res.status(500).json({ error: "Error al sincronizar alumnos" });
  }
});

router.post("/sync", async (req, res) => {
  try {
    const userId = req.user.id;
    const resultado = await syncAlumnos(userId);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para listar cursos con alumnos
//router.get("/cursos-con-alumnos/:profesorId", obtenerCursosConAlumnos);


export default router;
