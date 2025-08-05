import {createContext, useState} from 'react';

export const AuthContext = createContext();

function AuthProvider({children}) {
    // const[user, setuser] = useState(null);

    // const isAuthenticated = () => {
    //     if(user!=null) return true;
    //     else return false;
    // }


    /**
     * Start: Register Component Auth handling.
     */
    const [registerFormData, setRegisterFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    // const [registerShowPassword, setRegisterShowPassword] = useState(false);
    // const [registerShowConfirmPassword, setRegisterShowConfirmPassword] = useState(false);
    const [registerErrors, setRegisterErrors] = useState({});
    const [registerIsSubmitting, setRegisterIsSubmitting] = useState(false);
    const [registerSubmitSuccess, setRegisterSubmitSuccess] = useState(false);

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsSubmitting(true); // ??
        
        // Simulate API call
        try {
        const response = await fetch('http://localhost:8000/api/register', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            // Add CSRF token if needed
            // 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
            },
            body: JSON.stringify({
            name: registerFormData.name,
            email: registerFormData.email,
            password: registerFormData.password,
            password_confirmation: registerFormData.confirmPassword, // Laravel expects this field name
            }),
        });

        const data = await response.json();

        if (response.ok) {
            // Registration successful
            console.log("Registration successful:", data);
            setRegisterSubmitSuccess(true); // ??
            
            // Reset form after success
            setTimeout(() => {
            setRegisterFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: ""
            });
            setRegisterSubmitSuccess(false);
            }, 3000);
            
        } else {
            // Handle validation errors from Laravel
            if (data.errors) {
            setRegisterErrors(data.errors);
            } else {
            // Handle other errors
            setRegisterErrors({ general: data.message || 'Registration failed. Please try again.' });
            }
        }
        
        } catch (error) {
        console.error("Registration failed:", error);
        setRegisterErrors({ general: 'Network error. Please check your connection and try again.' });
        } finally {
        setRegisterIsSubmitting(false);
        }
    };
    /**
     * End: Register Component Auth handling.
     */

    // *********************************************************************
    
    /**
     * Start: Login Component Auth handling.
     */
    const [loginFormData, setLoginFormData] = useState({
        email: "",
        password: "",
    });

    // const [loginShowPassword, setLoginShowPassword] = useState(false);
    const [loginErrors, setLoginErrors] = useState({});
    const [loginIsSubmitting, setLoginIsSubmitting] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (loginErrors[name]) {
      setLoginErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

    const validateLoginForm = () => {
    const newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!loginFormData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(loginFormData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!loginFormData.password) {
      newErrors.password = "Password is required";
    }

    setLoginErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        if (!validateLoginForm()) return;

        setLoginIsSubmitting(true);
        
        try {
        const response = await fetch('http://localhost:8000/api/login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            },
            body: JSON.stringify({
            email: loginFormData.email,
            password: loginFormData.password,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            // Login successful
            console.log("Login successful:", data);
            
            // Store token if provided
            if (data.token) {
            localStorage.setItem('auth_token', data.token);
            }
            
            setLoginSuccess(true);
            
            // Reset form after success
            setTimeout(() => {
            setLoginFormData({
                email: "",
                password: ""
            });
            setLoginSuccess(false);
            // Here you would typically redirect to dashboard
            // window.location.href = '/dashboard';
            }, 2000);
            
        } else {
            // Handle validation errors from Laravel
            if (data.errors) {
            setLoginErrors(data.errors);
            } else {
            // Handle other errors
            setLoginErrors({ general: data.message || 'Login failed. Please check your credentials.' });
            }
        }
        
        } catch (error) {
        console.error("Login failed:", error);
        setLoginErrors({ general: 'Network error. Please check your connection and try again.' });
        } finally {
        setLoginIsSubmitting(false);
        }
    };
    /**
     * End: Login Component Auth handling.
     */
    return (
        <AuthContext.Provider
            // value={{user, setUser}}
            value={{loginFormData, setLoginFormData, loginErrors, setLoginErrors, loginIsSubmitting, setLoginIsSubmitting, loginSuccess, setLoginSuccess, handleLoginChange, validateLoginForm, handleLoginSubmit,
                    registerFormData, setRegisterFormData, registerErrors, setRegisterErrors, registerIsSubmitting, setRegisterIsSubmitting, registerSubmitSuccess, setRegisterSubmitSuccess
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export {AuthProvider};