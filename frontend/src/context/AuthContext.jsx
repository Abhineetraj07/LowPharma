import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // If this is a fresh browser session (tab/window was closed or server restarted),
    // clear auth and send user to landing page
    if (!sessionStorage.getItem('session_active')) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      sessionStorage.setItem('session_active', 'true');
      return null;
    }

    try {
      const saved = localStorage.getItem('user');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      if (!parsed.access_token || !parsed.role) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        return null;
      }
      return parsed;
    } catch {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return null;
    }
  });

  const login = (userData) => {
    localStorage.setItem('token', userData.access_token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
