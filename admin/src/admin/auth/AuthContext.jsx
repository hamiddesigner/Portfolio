import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { authAPI } from '../../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Check authentication status on mount
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      // Verify token with backend
      authAPI.verify()
        .then((data) => {
          setIsAuthenticated(true);
          setUser(data.user);
        })
        .catch(() => {
          // Invalid token, clear it
          localStorage.removeItem('admin_token');
          setIsAuthenticated(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const data = await authAPI.login(username, password);
      
      if (data.success && data.token) {
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('loginTime', new Date().toISOString());
        setIsAuthenticated(true);
        setUser(data.user);
        toast.success('Successfully logged in!');
        return true;
      } else {
        toast.error('Login failed. Please try again.');
        return false;
      }
    } catch (error) {
      toast.error(error.message || 'Incorrect credentials. Please try again.');
      return false;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('loginTime');
    toast.success('Successfully logged out');
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export default AuthContext;
