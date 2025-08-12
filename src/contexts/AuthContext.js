import { createContext, useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { emptyCart } from '../redux/cartSlice';

const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('auth_token'));
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const register = async (userData) => {
    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          password_confirmation: userData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user data from your API response structure
        localStorage.setItem('auth_token', data.token);
        setToken(data.token);
        setUser(data.user); // This contains the full user object with roles
        
        return { 
          success: true, 
          data: {
            message: data.message,
            user: data.user,
            role: data.role
          }
        };
      } else {
        return { 
          success: false, 
          errors: data.errors || { general: data.message || 'Registration failed' }
        };
      }
    } catch (error) {
      console.error('Registration failed:', error);
      return { 
        success: false, 
        errors: { general: 'Network error. Please check your connection.' } 
      };
    }
  };

  const login = async (credentials) => {
    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user data
        localStorage.setItem('auth_token', data.token);
        setToken(data.token);
        setUser(data.user);
        
        return { success: true, data };
      } else {
        return { 
          success: false, 
          errors: data.errors || { general: data.message || 'Login failed' }
        };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        errors: { general: 'Network error. Please check your connection.' } 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);

    dispatch(emptyCart());
    navigate('/');
  };

  // Helper function to get user role
  const getUserRole = () => {
    if (!user || !user.roles || user.roles.length === 0) return null;
    return user.roles[0].name; // Assuming user has one primary role
  };

  // Helper function to check if user has specific role
  const hasRole = (roleName) => {
    if (!user || !user.roles) return false;
    return user.roles.some(role => role.name === roleName);
  };

  const value = {
    // State
    user,
    token,
    isAuthenticated: !!token && !!user,
    
    // Methods
    login,
    register,
    logout,
    
    // Helper methods
    getUserRole,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
