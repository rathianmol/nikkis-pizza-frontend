import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { post, put } from '../services/AddressService';

export default function UserAddress() {
    const { isAuthenticated, token, user, updateUserContextAddress } = useAuth();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        postal_code: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [existingAddress, setExistingAddress] = useState(null);
    const[hasExistingAddress, setHasExistingAddress] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Initially, check to see if the user already has an address.
    // This component is using both store and update protocols; re-usable.
  useEffect(() => {
    // Check if user has complete address
    if (user?.address && 
        user.address.id && 
        user.address.address_line_1 && 
        user.address.city && 
        user.address.state && 
        user.address.postal_code) {
      
      // Set existing address
      setExistingAddress(user.address);
      setHasExistingAddress(true);
      
      // Populate form data with existing address
      setFormData({
        address_line_1: user.address.address_line_1 || '',
        address_line_2: user.address.address_line_2 || '',
        city: user.address.city || '',
        state: user.address.state || '',
        postal_code: user.address.postal_code || '',
      });
    } else {
      // No complete address found
      setExistingAddress(null);
      // Keep form data as empty (or you could clear it here)
    }
  }, []);

    const isFormValid = formData.address_line_1.trim() && 
        formData.city.trim() && 
        formData.state.trim() && 
        formData.postal_code.trim();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear messages when user starts typing
        if (error) setError(null);
        if (success) setSuccess(null);
    };

    const handleSubmit = async () => {
        if (!isFormValid) return;
        
        setIsLoading(true);
        setError(null);
        setSuccess(null);
        
        try {
            let result;
            
            if (hasExistingAddress) {
                // Update existing address
                result = await put(token, formData);
            } else {
                // Create new address
                result = await post(token, formData);
            }

            if (result.success) {
                // debugger
                setSuccess(result.message);
                setExistingAddress(result.data);
                
                // update user address
                updateUserContextAddress(formData);

                // Navigate to pizzas page after 1.5 seconds
                setTimeout(() => {
                    navigate('/pizzas');
                }, 2000);
            } else {
                setError(result.message);
                
                // Handle validation errors
                if (result.errors) {
                    console.log('Validation errors:', result.errors);
                }
            }
        } catch (error) {
            console.error('Error saving address:', error);
            setError('Failed to save address. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSkip = () => {
        navigate('/pizzas');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        {hasExistingAddress ? 'Update Delivery Address' : 'Delivery Address'}
                    </h2>
                    <p className="text-gray-600">For food delivery purposes, please provide your address.</p>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                        <div className="flex">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {success}
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        <div className="flex">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label htmlFor="address_line_1" className="block text-sm font-medium text-gray-700 mb-1">
                            Street Address *
                        </label>
                        <input
                            type="text"
                            id="address_line_1"
                            name="address_line_1"
                            value={formData.address_line_1}
                            onChange={handleInputChange}
                            placeholder="123 Main Street"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="address_line_2" className="block text-sm font-medium text-gray-700 mb-1">
                            Apartment, Suite, etc.
                        </label>
                        <input
                            type="text"
                            id="address_line_2"
                            name="address_line_2"
                            value={formData.address_line_2}
                            onChange={handleInputChange}
                            placeholder="Apt 4B (optional)"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                City *
                            </label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                placeholder="New York"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                                State *
                            </label>
                            <input
                                type="text"
                                id="state"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                placeholder="NY"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-1">
                                ZIP Code *
                            </label>
                            <input
                                type="text"
                                id="postal_code"
                                name="postal_code"
                                value={formData.postal_code}
                                onChange={handleInputChange}
                                placeholder="10001"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="flex flex-col space-y-3 pt-6">
                        <button
                            onClick={handleSubmit}
                            disabled={!isFormValid || isLoading}
                            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {hasExistingAddress ? 'Updating...' : 'Saving...'}
                                </>
                            ) : (
                                hasExistingAddress ? 'Update Address' : 'Save Address'
                            )}
                        </button>
                        
                        <button
                            onClick={handleSkip}
                            className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                            Skip for now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}