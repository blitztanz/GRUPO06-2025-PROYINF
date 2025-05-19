import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import alumnosRouter from './routes/alumnos.js'
import reportesRouter from './routes/reportes.js'
import preguntasRouter from './routes/preguntas.js'
import notasRouter     from './routes/notas.js'

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', authRouter);
app.use('/api/alumnos', alumnosRouter)
app.use('/api/reportes', reportesRouter)
app.use('/api/preguntas', preguntasRouter)
app.use('/api/notas',     notasRouter)


const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`API corriendo en http://localhost:${PORT}`)
);

