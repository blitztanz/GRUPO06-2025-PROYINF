-- usuarios
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(20) NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(100) UNIQUE NOT NULL
);

-- preguntas
CREATE TABLE preguntas (
  id SERIAL PRIMARY KEY,
  enunciado TEXT NOT NULL,
  opcion_a VARCHAR(255) NOT NULL,
  opcion_b VARCHAR(255) NOT NULL,
  opcion_c VARCHAR(255) NOT NULL,
  opcion_d VARCHAR(255) NOT NULL,
  correcta CHAR(1) NOT NULL CHECK (correcta IN ('a','b','c','d')),  -- Validación para solo estas letras
  dificultad VARCHAR(20) NOT NULL,  -- Agrego columna dificultad como texto corto
  materia VARCHAR(100) NOT NULL,    -- También parece que usas materia, agrego aquí
  autor_id INTEGER NOT NULL,
  FOREIGN KEY (autor_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- reportes
CREATE TABLE reportes (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL
);

-- tabla para relacionar reportes y preguntas (muchos a muchos)
CREATE TABLE reportes_preguntas (
  reporte_id INTEGER NOT NULL,
  pregunta_id INTEGER NOT NULL,
  PRIMARY KEY (reporte_id, pregunta_id),
  FOREIGN KEY (reporte_id) REFERENCES reportes(id) ON DELETE CASCADE,
  FOREIGN KEY (pregunta_id) REFERENCES preguntas(id) ON DELETE CASCADE
);
