import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user/token on load
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');
    
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);


  const login = async (loginId, password) => {
    const res = await api.post('/auth/login', { loginId, password });

    const { accessToken, refreshToken, data } = res.data;
    
    // Save to local storage
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
        await api.post('/auth/logout');
    } catch (e) {
        console.error("Logout error", e);
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
