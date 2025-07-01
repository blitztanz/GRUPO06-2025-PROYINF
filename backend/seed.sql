-- seed.sql
-- Usuarios de prueba
INSERT INTO usuarios (tipo, nombre, correo, google_id, avatar_url) VALUES
('alumno', 'Juan Pérez', 'juan.perez@alumno.edu', 'google123', 'https://example.com/avatars/juan.jpg'),
('profesor', 'María González', 'maria.gonzalez@profesor.edu', 'google456', 'https://example.com/avatars/maria.jpg'),
('externo', 'Carlos Rojas', 'carlos.rojas@externo.org', 'google789', 'https://example.com/avatars/carlos.jpg');

-- Preguntas de prueba
INSERT INTO preguntas (enunciado, opcion_a, opcion_b, opcion_c, opcion_d, correcta, dificultad, materia, autor_id) VALUES 
('Cuanto es 15 mas 27?', '32', '42', '38', '45', 'b', 'baja', 'matematicas', 2),
('Resuelve: 3x + 5 = 20', 'x = 3', 'x = 5', 'x = 7', 'x = 9', 'b', 'media', 'matematicas', 2),
('Area de un cuadrado de lado 5 cm', '20 cm2', '25 cm2', '30 cm2', '10 cm2', 'b', 'baja', 'matematicas', 2),
('Sujeto en: El chico juega en el parque', 'juega', 'El chico', 'en el parque', 'parque', 'b', 'baja', 'lenguaje', 2),
('Sinonimo de feliz', 'Triste', 'Alegre', 'Enojado', 'Aburrido', 'b', 'baja', 'lenguaje', 2),
('Autor de Don Quijote de la Mancha', 'Gabriel Garcia Marquez', 'Miguel de Cervantes', 'Pablo Neruda', 'Federico Garcia Lorca', 'b', 'media', 'lenguaje', 2),
('Planeta conocido como planeta rojo', 'Venus', 'Marte', 'Jupiter', 'Saturno', 'b', 'baja', 'ciencias', 2),
('Gas que necesitan las plantas para fotosintesis', 'Oxigeno', 'Nitrogeno', 'Dioxido de carbono', 'Hidrogeno', 'c', 'media', 'ciencias', 2),
('Elemento quimico con simbolo Fe', 'Fluor', 'Fosforo', 'Hierro', 'Francio', 'c', 'media', 'ciencias', 2);

-- Ensayos de prueba
INSERT INTO ensayos (titulo, descripcion, materia, tiempo_limite, autor_id) VALUES
('Ensayo PAES Matematicas', 'Preguntas basicas de matematicas para preparacion PAES', 'matematicas', 45, 2);

INSERT INTO ensayos (titulo, descripcion, materia, tiempo_limite, autor_id) VALUES
('Ensayo PAES Lenguaje', 'Comprension lectora y gramatica basica', 'lenguaje', 40, 2);

INSERT INTO ensayos (titulo, descripcion, materia, tiempo_limite, autor_id) VALUES
('Ensayo PAES Ciencias', 'Conceptos basicos de ciencias naturales', 'ciencias', 50, 2);

-- Relación entre ensayos y preguntas
INSERT INTO ensayos_preguntas (ensayo_id, pregunta_id, orden) VALUES
(1, 1, 1), (1, 2, 2), (1, 3, 3);

INSERT INTO ensayos_preguntas (ensayo_id, pregunta_id, orden) VALUES
(2, 4, 1), (2, 5, 2), (2, 6, 3);

INSERT INTO ensayos_preguntas (ensayo_id, pregunta_id, orden) VALUES
(3, 7, 1), (3, 8, 2), (3, 9, 3);

-- Asignación de ensayos a alumnos
INSERT INTO ensayos_asignados (ensayo_id, alumno_id, fecha_limite) VALUES
(1, 1, NOW() + INTERVAL '7 days'),  
(2, 1, NOW() + INTERVAL '7 days'),  
(3, 1, NOW() + INTERVAL '7 days');