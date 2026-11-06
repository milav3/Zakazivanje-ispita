import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [profesor, setProfesor] = useState(
    JSON.parse(localStorage.getItem('profesor')) || null
  );

  function login(noviToken, noviProfesor) {
    setToken(noviToken);
    setProfesor(noviProfesor);
    localStorage.setItem('token', noviToken);
    localStorage.setItem('profesor', JSON.stringify(noviProfesor));
  }

  function logout() {
    setToken(null);
    setProfesor(null);
    localStorage.removeItem('token');
    localStorage.removeItem('profesor');
  }

  return (
    <AuthContext.Provider value={{ token, profesor, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}