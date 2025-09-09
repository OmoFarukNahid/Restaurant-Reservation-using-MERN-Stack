// authState.jsx
import { useState, createContext, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get(
          'http://localhost:4000/api/v1/auth/check',
          { withCredentials: true }
        );
        if (data?.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.log('Not authenticated');
      }
    };
    checkAuth();
  }, []);

  const register = async (name, email, password) => {
    try {
      const { data } = await axios.post(
        'http://localhost:4000/api/v1/auth/register',
        { name, email, password },
        { withCredentials: true }
      );
      setUser(data.user);
      toast.success(data.message);
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(
        'http://localhost:4000/api/v1/auth/login',
        { email, password },
        { withCredentials: true }
      );
      setUser(data.user);
      toast.success(data.message);
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        'http://localhost:4000/api/v1/auth/logout',
        {},
        { withCredentials: true }
      );
      setUser(null);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}