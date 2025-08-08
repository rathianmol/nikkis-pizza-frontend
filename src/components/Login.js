import { useState, useContext } from "react";
import { Eye, EyeOff, Mail, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from '../contexts/AuthContext';

function Login() {

    const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Use the register method from auth context
    const result = await login(formData);
    
    if (result.success) {
      console.log("Login successful:", result.data);
      setSubmitSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          email: "",
          password: "",
        });
        setSubmitSuccess(false);
        // Optionally redirect to dashboard since user is now logged in
        // navigate('/dashboard');
      }, 3000);
    } else {
      // Handle errors returned from auth context
      setErrors(result.errors);
    }
    
    setIsSubmitting(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Nikki's Pizza</h2>
          <p className="text-gray-600">You have been logged in successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nikki's Pizza</h1>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </div>

        <div className="space-y-6">
          {/* General Error Message */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center text-red-600">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">{errors.general}</span>
              </div>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                  errors.email ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                }`}
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.email}
              </div>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                // value={formData.password}
                value={formData.password}
                // onChange={handleChange}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                  errors.password ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                }`}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.password}
              </div>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium hover:underline">
              Forgot your password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            // onClick={handleSubmit}
            onClick={handleSubmit}
            // disabled={isSubmitting}
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg transform hover:scale-105"
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Signing In...
              </div>
            ) : (
              "Sign In"
            )}
          </button>

          {/* Divider */}
 

          {/* Social Login Buttons */}
        </div>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <button className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline">
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;