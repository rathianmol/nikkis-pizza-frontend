import { createContext, useContext, useState} from 'react';

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
  const [token, setToken] = useState(localStorage.getItem('auth_token'));
  // Role, Address contained within user object.
  const [user, setUser] = useState(() => {
  const savedUser = localStorage.getItem('auth_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  

  const register = async (userData) => {
    // debugger
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

      console.log("dumping 'data': ");
      console.log(data);
        // Store token and user data from your API response structure
        localStorage.setItem('auth_token', (data.token));
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user); // This contains the full user object with roles
        
        return { 
          success: true, 
          data: {
            message: data.message,
            user: data.user,
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
    console.log('inside auth-context-login: ');
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
      console.log("dumping 'data': ");
      console.log(data);

      if (response.ok) {
        // Store token and user data
        console.log('setting the token, user and local storage auth-token');
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        console.log(data.token);
        console.log(data.user);
        
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

  const logout = (navigate) => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('cart');
    setToken(null);
    setUser(null);
  };


  const updateUserContextAddress = (addressFormData) => {
    // debugger
    if (!user) return;
    
    const updatedUser = {
      ...user,
      address: {
        ...user.address, // Preserve existing address properties (like id)
        ...addressFormData // Override with new form data
      }
    };
    
    setUser(updatedUser);
    localStorage.setItem('auth_user', JSON.stringify(updatedUser));
  }

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
    updateUserContextAddress,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
