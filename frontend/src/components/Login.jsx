import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import googleIcon from '../assets/google-icon.png';

export default function Login() {
  const { user, login } = useUser(); // 'user' viene del contexto después de loguearse
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      //ghuardar el id del usuario en localStorage
      localStorage.setItem("profesorId", user.id);

      // ✅ Redirigir según el tipo de usuario
      const route = `/menu_${user.tipo}`;
      navigate(route);
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-xl w-full bg-white p-12 rounded-xl shadow-lg border border-gray-200">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-3">
            Plataforma <span className="text-indigo-600">PAES</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Accede a tu cuenta institucional para continuar
          </p>
        </div>

        <button
          onClick={login}
          className="w-full flex items-center justify-center gap-4 py-4 px-5 border border-indigo-600 rounded-lg shadow-md text-indigo-600 font-semibold text-lg bg-indigo-50 hover:bg-indigo-100 transition duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300"
          aria-label="Continuar con Google"
        >
          <img
            src={googleIcon}
            alt="Google"
            className="w-6 h-6 object-contain"
          />
          <span>Continuar con Google</span>
        </button>
      </div>
    </div>
  );
}
