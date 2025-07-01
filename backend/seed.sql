-- seed.sql
-- Usuarios de prueba
INSERT INTO usuarios (tipo,nombre,correo) VALUES
  ('profesor','Ana Pérez','ana@uni.cl'),
  ('alumno','Juan Soto','juan@uni.cl'),
  ('externo','María Ruiz','maria@ext.cl');

-- Preguntas de prueba
INSERT INTO preguntas (enunciado, opcion_a, opcion_b, opcion_c, opcion_d, correcta, autor_id, dificultad, materia) VALUES
  ('¿Capital de Chile?', 'Lima', 'Santiago', 'Buenos Aires', 'La Paz', 'b', 1, '', 'general'),
  ('2+2=?', '3', '4', '5', '6', 'b', 1, '', 'general'),
  ('¿Qué es un organelo?', 'Lo que hacen las plantas verdes', 'Estructuras de las células eucariontes', 'La estructura que le brinda energía a la célula', 'Estructura de bacterias', 'b', 1, 'baja', 'ciencias');

-- Ensayos de prueba
INSERT INTO ensayos (titulo, descripcion, materia, tiempo_limite, autor_id)
VALUES ('Ensayo PAES Matemáticas M1', 'Ensayo de práctica para la prueba de Matemáticas M1', 'Matemáticas',90, 1);

INSERT INTO preguntas (enunciado, opcion_a, opcion_b, opcion_c, opcion_d, correcta, dificultad, materia, autor_id) 
VALUES 
  ('¿Cuál es el valor de x en la ecuación 2x + 5 = 15?', '5', '10', '7.5', '2.5', 'a', 'media', 'Matemáticas', 1),
  ('Si un triángulo tiene ángulos de 45° y 45°, ¿cuál es el tercer ángulo?', '45°', '90°', '60°', '180°', 'b', 'baja', 'Matemáticas', 1),
  ('¿Qué fórmula representa el área de un círculo?', 'πr²', '2πr', 'πd', '4/3πr³', 'a', 'alta', 'Matemáticas', 1);

INSERT INTO ensayos_preguntas (ensayo_id, pregunta_id, orden) 
VALUES 
  (1, 1, 1),  -- Ensayo ID 1, Pregunta ID 1, Orden 1
  (1, 2, 2),
  (1, 3, 3);

INSERT INTO ensayos_asignados (ensayo_id, alumno_id, fecha_limite) 
VALUES (
  1, 
  1, 
  NOW() + INTERVAL '7 days'
);