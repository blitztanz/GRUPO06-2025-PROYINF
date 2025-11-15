import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import "./config/passport.js";


import authRouter from './routes/auth.js';
import alumnosRouter from './routes/alumnos.js';
import reportesRouter from './routes/reportes.js';
import preguntasRouter from './routes/preguntas.js';
import notasRouter from './routes/notas.js';
import ensayosRouter from './routes/ensayos.js';
import classroomRoutes from "./routes/classroomrutas.js";

dotenv.config();

const app = express();

app.disable('x-powered-by');

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'mi_secreto',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', 
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 día
  },
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/classroom", classroomRoutes);
app.use("/auth", authRouter);
app.use('/api/alumnos', alumnosRouter);
app.use('/api/reportes', reportesRouter);
app.use('/api/preguntas', preguntasRouter);
app.use('/api/notas', notasRouter);
app.use('/api/ensayos', ensayosRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});