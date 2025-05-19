-- seed.sql
-- Usuarios de prueba
INSERT INTO usuarios (tipo,nombre,correo) VALUES
  ('profesor','Ana Pérez','ana@uni.cl'),
  ('alumno','Juan Soto','juan@uni.cl'),
  ('externo','María Ruiz','maria@ext.cl');

-- Preguntas de prueba
INSERT INTO preguntas (enunciado,opcion_a,opcion_b,opcion_c,opcion_d,correcta,autor_id) VALUES
  ('¿Capital de Chile?','Lima','Santiago','Buenos Aires','La Paz','B',1),
  ('2+2=?','3','4','5','6','B',1);

-- Reporte de ejemplo
INSERT INTO reportes (titulo) VALUES ('Reporte inicial');
INSERT INTO reportes_preguntas (reporte_id,pregunta_id) VALUES (1,1),(1,2);
