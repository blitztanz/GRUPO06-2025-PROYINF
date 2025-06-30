// frontend/src/context/UserContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  // Verifica la sesión al cargar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('http://localhost:4000/auth/user', { 
          credentials: 'include' 
        });
        const userData = await res.json();
        if (userData) setUser(userData);
      } catch (error) {
        console.error("Error verificando sesión:", error);
      }
    };
    checkAuth();
  }, []);

  const login = () => {
    window.open('http://localhost:4000/auth/google', '_self');
  };

  const logout = async () => {
    try {
      const response = await fetch('http://localhost:4000/auth/logout', {
        method: 'POST',
        credentials: 'include' // Importante para las cookies
      });
      
      if (!response.ok) throw new Error('Error en la respuesta del servidor');
      setUser(null); // Limpia el estado del usuario
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Puedes mostrar una notificación al usuario aquí
    }
  };

  return (
    <UserContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}