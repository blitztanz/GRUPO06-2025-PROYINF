import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

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

  const login = useCallback(() => {
    window.open('http://localhost:4000/auth/google', '_self');
  }, []); 

  const logout = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:4000/auth/logout', {
        method: 'POST',
        credentials: 'include' 
      });
      
      if (!response.ok) throw new Error('Error en la respuesta del servidor');
      setUser(null); 
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }, [setUser]); 

  const contextValue = useMemo(() => ({
    user,
    login,
    logout,
    setUser
  }), [user, login, logout]);

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired
};