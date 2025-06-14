import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';

// Importa tu configuración de passport con GoogleStrategy
import './config/passport.js'; // IMPORTANTE: solo importa el archivo para ejecutar la configuración

// Importa rutas
import authRouter from './routes/auth.js';
import authGoogleRouter from './routes/authGoogle.js';  // rutas para /auth/google
import alumnosRouter from './routes/alumnos.js';
import reportesRouter from './routes/reportes.js';
import preguntasRouter from './routes/preguntas.js';
import notasRouter from './routes/notas.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',  // URL de tu frontend React
  credentials: true,                 // Para que se puedan enviar cookies y sesiones
}));

app.use(express.json());

// Configurar sesión antes de Passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'un-secreto-muy-secreto',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // true si usas HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 día
  }
}));

// Inicializar Passport y sesión
app.use(passport.initialize());
app.use(passport.session());

// Rutas
app.use('/auth', authRouter);        // tus rutas de auth normales
app.use('/auth', authGoogleRouter);  // rutas /auth/google y callback
app.use('/api/alumnos', alumnosRouter);
app.use('/api/reportes', reportesRouter);
app.use('/api/preguntas', preguntasRouter);
app.use('/api/notas', notasRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});
