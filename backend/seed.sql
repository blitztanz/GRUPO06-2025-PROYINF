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


-- Reporte de ejemplo
INSERT INTO reportes (titulo) VALUES ('Reporte inicial');
INSERT INTO reportes_preguntas (reporte_id,pregunta_id) VALUES (1,1),(1,2);
