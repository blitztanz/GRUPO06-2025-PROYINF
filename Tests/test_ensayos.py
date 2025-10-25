import unittest
import requests
import time

BASE_URL = "http://localhost:3000/api/ensayos"

class TestEnsayosEndpoint(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        """Configuración inicial - datos de prueba"""
        print("\n=== INICIANDO PRUEBAS ENDPOINT /api/ensayos ===")
        cls.autor_valido_id = 2  # ID de autor que existe
        cls.timestamp = str(int(time.time()))  # Para hacer datos únicos
        
    def test_crear_ensayo_valido(self):
        """
        Caso 3: Crear ensayo con datos válidos
        Clase de equivalencia: Todos los campos requeridos presentes y válidos
        """
        print("Ejecutando: Crear ensayo válido")
        
        # INPUT - Datos completos y válidos
        nuevo_ensayo = {
            "titulo": f"Ensayo sobre historia {self.timestamp}",
            "descripcion": "Analizar hechos históricos importantes del siglo XX",
            "materia": "Historia",
            "tiempo_limite": 45,
            "autor_id": self.autor_valido_id
        }
        
        # EJECUCIÓN
        response = requests.post(BASE_URL, json=nuevo_ensayo)
        
        # VERIFICACIONES ESPECÍFICAS
        self.assertEqual(response.status_code, 201,
                        f"El status code debería ser 201, pero fue {response.status_code}")
        
        data = response.json()
        
        self.assertTrue(data["ok"], "La propiedad 'ok' debería ser True")
        self.assertIn("id", data, "El response debería contener 'id' del ensayo creado")
        self.assertIn("mensaje", data, "El response debería contener 'mensaje'")
        
        ensayo_id = data["id"]
        self.assertIsInstance(ensayo_id, (int, str), "El ID del ensayo debería ser numérico o string")

        mensaje = data["mensaje"]
        self.assertIsInstance(mensaje, str, "El mensaje debería ser string")
        self.assertIn("creado", mensaje.lower(), "El mensaje debería confirmar la creación")
        
        print(f"✓ Ensayo creado exitosamente - ID: {ensayo_id}")

    def test_crear_ensayo_invalido(self):
        """
        Caso 4: Crear ensayo con datos faltantes
        Clase de equivalencia: Campos requeridos faltantes
        Resultado esperado: Error 400 con mensaje descriptivo
        """
        print("Ejecutando: Crear ensayo inválido")
        
        # INPUT Datos incompletos 
        ensayo_invalido = {
            "titulo": "Ensayo sin campos requeridos",
            # Faltan: materia, tiempo_limite, autor_id
        }
        
        # EJECUCIÓN
        response = requests.post(BASE_URL, json=ensayo_invalido)
        
        # VERIFICACIONES ESPECÍFICAS
        self.assertEqual(response.status_code, 400,
                        f"El status code debería ser 400, pero fue {response.status_code}")
        
        data = response.json()
        
        self.assertFalse(data["ok"], "La propiedad 'ok' debería ser False")
        self.assertIn("error", data, "El response debería contener 'error'")
        
        error_msg = data["error"]
        self.assertIsInstance(error_msg, str, "El error debería ser string")
        self.assertGreater(len(error_msg), 0, "El mensaje de error no debería estar vacío")
        
        error_lower = error_msg.lower()
        possible_errors = ["faltan", "requerido", "obligatorio", "campo", "invalid"]
        has_meaningful_error = any(error in error_lower for error in possible_errors)
        self.assertTrue(has_meaningful_error, 
                       f"El mensaje de error debería indicar qué campo falta. Mensaje: {error_msg}")
        
        print(f"✓ Correcto: Ensayo rechazado - {error_msg}")

    @classmethod
    def tearDownClass(cls):
        """Limpieza después de pruebas"""
        print("=== FINALIZANDO PRUEBAS ENDPOINT /api/ensayos ===")