import { Router } from "express";
import passport from "passport";

const router = Router();

// 🔹 Redirige al login de Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/classroom.courses.readonly",
      "https://www.googleapis.com/auth/classroom.rosters.readonly",
    ],
    accessType: "offline",
    prompt: "consent",
  })
);

// 🔹 Callback de Google
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const tipo = req.user.tipo;
    let redirectUrl = "/menu_alumno";
    if (tipo === "profesor") redirectUrl = "/menu_profesor";
    else if (tipo === "externo") redirectUrl = "/menu_externo";

    res.redirect(`http://localhost:3000${redirectUrl}`);
  }
);

// 🔹 Logout
router.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: "Error al cerrar sesión" });
    res.clearCookie("connect.sid");
    res.status(200).json({ success: true });
  });
});

// 🔹 Usuario actual
router.get("/user", (req, res) => {
  res.json(req.user || null);
});

export default router;
