import unittest
import requests

BASE_URL = "http://localhost:3000/api/alumnos"

class TestAlumnosEndpoint(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        """Configuración inicial - datos de prueba"""
        print("\n=== INICIANDO PRUEBAS ENDPOINT /api/alumnos ===")
        cls.alumno_existente_id = 1  # ID que sabemos existe
        cls.alumno_inexistente_id = 9999  # ID que sabemos NO existe
        
    def test_get_alumno_existente(self):
        """
        Caso 1: Obtener alumno existente
        Clase de equivalencia: ID válido y existente
        """
        print("Ejecutando: Obtener alumno existente")
        
        # INPUT
        alumno_id = self.alumno_existente_id
        
        # EJECUCIÓN
        response = requests.get(f"{BASE_URL}/{alumno_id}")
        
        # VERIFICACIONES ESPECÍFICAS
        self.assertEqual(response.status_code, 200, 
                        f"El status code debería ser 200, pero fue {response.status_code}")
        
        data = response.json()
        
        self.assertTrue(data["ok"], "La propiedad 'ok' debería ser True")
        self.assertIn("usuario", data, "El response debería contener 'usuario'")
        
        usuario = data["usuario"]
        self.assertIn("id", usuario, "El usuario debería tener 'id'")
        self.assertIn("nombre", usuario, "El usuario debería tener 'nombre'")
        self.assertIn("email", usuario, "El usuario debería tener 'email'")
        
        self.assertIsInstance(usuario["id"], (int, str), "El ID debería ser numérico o string")
        self.assertIsInstance(usuario["nombre"], str, "El nombre debería ser string")
        
        print(f"✓ Alumno {alumno_id} obtenido correctamente: {usuario.get('nombre', 'N/A')}")

    def test_get_alumno_inexistente(self):
        """
        Caso 2: Obtener alumno inexistente  
        Clase de equivalencia: ID válido pero no existente
        Valor frontera: ID muy alto
        """
        print("Ejecutando: Obtener alumno inexistente")
        
        # INPUT
        alumno_id = self.alumno_inexistente_id
        
        # EJECUCIÓN
        response = requests.get(f"{BASE_URL}/{alumno_id}")
        
        # VERIFICACIONES ESPECÍFICAS
        self.assertEqual(response.status_code, 404,
                        f"El status code debería ser 404, pero fue {response.status_code}")
        
        data = response.json()
        
        self.assertFalse(data["ok"], "La propiedad 'ok' debería ser False")
        self.assertIn("error", data, "El response debería contener 'error'")
        
        error_msg = data["error"]
        self.assertIsInstance(error_msg, str, "El error debería ser string")
        self.assertGreater(len(error_msg), 0, "El mensaje de error no debería estar vacío")
        
        print(f"✓ Correcto: Alumno {alumno_id} no encontrado - {error_msg}")

    @classmethod
    def tearDownClass(cls):
        """Limpieza después de pruebas"""
        print("=== FINALIZANDO PRUEBAS ENDPOINT /api/alumnos ===")