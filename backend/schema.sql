-- usuarios
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('externo', 'profesor', 'alumno')),
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(100) UNIQUE NOT NULL,
  google_id TEXT UNIQUE,
  avatar_url TEXT
);

-- preguntas
CREATE TABLE preguntas (
  id SERIAL PRIMARY KEY,
  enunciado TEXT NOT NULL,
  opcion_a VARCHAR(255) NOT NULL,
  opcion_b VARCHAR(255) NOT NULL,
  opcion_c VARCHAR(255) NOT NULL,
  opcion_d VARCHAR(255) NOT NULL,
  correcta CHAR(1) NOT NULL CHECK (correcta IN ('a','b','c','d')),
  dificultad VARCHAR(20) NOT NULL CHECK (dificultad IN ('baja', 'media', 'alta')),
  materia VARCHAR(100) NOT NULL,
  autor_id INTEGER NOT NULL,
  FOREIGN KEY (autor_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla para ensayos
CREATE TABLE ensayos (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  materia VARCHAR(100) NOT NULL,
  tiempo_limite INTEGER, -- en minutos
  autor_id INTEGER NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (autor_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE ensayos_preguntas (
  ensayo_id INTEGER NOT NULL,
  pregunta_id INTEGER NOT NULL,
  orden INTEGER NOT NULL,  -- Para definir el orden de las preguntas
  PRIMARY KEY (ensayo_id, pregunta_id),
  FOREIGN KEY (ensayo_id) REFERENCES ensayos(id) ON DELETE CASCADE,
  FOREIGN KEY (pregunta_id) REFERENCES preguntas(id) ON DELETE CASCADE
);

-- Tabla para asignar ensayos a alumnos
CREATE TABLE ensayos_asignados (
  ensayo_id INTEGER NOT NULL,
  alumno_id INTEGER NOT NULL,
  fecha_asignacion TIMESTAMP DEFAULT NOW(),
  fecha_limite TIMESTAMP,
  completado BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (ensayo_id, alumno_id),
  FOREIGN KEY (ensayo_id) REFERENCES ensayos(id) ON DELETE CASCADE,
  FOREIGN KEY (alumno_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla para registrar respuestas de ensayos
CREATE TABLE respuestas_ensayos (
  id SERIAL PRIMARY KEY,
  ensayo_id INTEGER NOT NULL,
  alumno_id INTEGER NOT NULL,
  pregunta_id INTEGER NOT NULL,
  respuesta_elegida CHAR(1) CHECK (respuesta_elegida IN ('a','b','c','d')),
  es_correcta BOOLEAN,
  fecha_respuesta TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (ensayo_id) REFERENCES ensayos(id) ON DELETE CASCADE,
  FOREIGN KEY (alumno_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (pregunta_id) REFERENCES preguntas(id) ON DELETE CASCADE
);

-- Tabla para resultados de ensayos
CREATE TABLE resultados_ensayos (
  ensayo_id INTEGER NOT NULL,
  alumno_id INTEGER NOT NULL,
  puntaje INTEGER NOT NULL,
  total_preguntas INTEGER NOT NULL,
  fecha_completado TIMESTAMP DEFAULT NOW(),
  tiempo_empleado INTEGER, -- en segundos
  PRIMARY KEY (ensayo_id, alumno_id),
  FOREIGN KEY (ensayo_id) REFERENCES ensayos(id) ON DELETE CASCADE,
  FOREIGN KEY (alumno_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
