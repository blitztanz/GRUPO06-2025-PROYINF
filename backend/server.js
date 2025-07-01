import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';

import './config/passport.js';  // Solo importa para ejecutar config

// Rutas
import authRouter from './routes/auth.js';
import alumnosRouter from './routes/alumnos.js';
import reportesRouter from './routes/reportes.js';
import preguntasRouter from './routes/preguntas.js';
import notasRouter from './routes/notas.js';
import ensayosRouter from './routes/ensayos.js';

dotenv.config();

const app = express();

// CORS: habilita cookies entre frontend y backend
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());

// Sesiones
app.use(session({
  secret: process.env.SESSION_SECRET || 'mi_secreto',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,       // true en producción con HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 día
  },
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Rutas
app.use('/auth', authRouter);
app.use('/api/alumnos', alumnosRouter);
app.use('/api/reportes', reportesRouter);
app.use('/api/preguntas', preguntasRouter);
app.use('/api/notas', notasRouter);
app.use('/api/ensayos', ensayosRouter);

// Puerto
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});
