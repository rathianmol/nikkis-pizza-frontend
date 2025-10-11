import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, setOrderType, setPaymentMethod, setDeliveryAddress, emptyCart, setCardInfo } from '../redux/cartSlice';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { postOrder } from '../services/OrderService';
import { CheckCircle } from "lucide-react";

export default function Cart() {
  const navigate = useNavigate();
  const { isAuthenticated, user, token } = useAuth();
  const { cartItems, totalPrice, amount, orderType, paymentMethod, deliveryAddress, cardInfo } = useSelector((store) => store.cart);
  const [orderSubmitSuccess, setOrderSubmitSuccess] = useState(false);
  console.log("inside cart component - dumping cartItems var:");
  console.log(cartItems);

  const dispatch = useDispatch();
  
  // Form states
  // const [contactInfo, setContactInfo] = useState({
  //   firstName: '',
  //   lastName: '',
  //   email: '',
  //   phoneNumber: ''
  // });
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expirationDate: '',
    securityCode: '',
    billingZipCode: ''
  });

  // Address form state
  const [addressForm, setAddressForm] = useState({
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
  });

  // Address message state
  const [addressMessage, setAddressMessage] = useState({ type: '', text: '' });

  // Initialize address form with user's address if available
  useState(() => {
    if (user?.address && orderType === 'delivery') {
      setAddressForm({
        address_line_1: user.address.address_line_1 || '',
        address_line_2: user.address.address_line_2 || '',
        city: user.address.city || '',
        state: user.address.state || '',
        postal_code: user.address.postal_code || ''
      });
      dispatch(setDeliveryAddress(user.address));
    }
  }, [user?.address, orderType]);

  const handleRemoveFromCart = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  // const handleContactInfoChange = (field, value) => {
  //   setContactInfo(prev => ({
  //     ...prev,
  //     [field]: value
  //   }));
  // };

  const handlePaymentInfoChange = (field, value) => {
    setPaymentInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressChange = (field, value) => {
    setAddressForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEmptyCart = () => {
    if (window.confirm('Are you sure you want to empty your cart?')) {
      dispatch(emptyCart());
      setPaymentInfo({ cardNumber: '', expirationDate: '', securityCode: '', billingZipCode: '' });
      setAddressForm({ address_line_1: '', address_line_2: '', city: '', state: '', postal_code: '' });
      setAddressMessage({ type: '', text: '' });
    }
  };

  const handleOrderTypeChange = (type) => {
    dispatch(setOrderType(type));
    if (type === 'pickup') {
      setAddressForm({ address_line_1: '', address_line_2: '', city: '', state: '', postal_code: '' });
      setAddressMessage({ type: '', text: '' });
    } else if (type === 'delivery' && user?.address) {
      // Auto-fill with user's address if available
      setAddressForm({
        address_line_1: user.address.address_line_1 || '',
        address_line_2: user.address.address_line_2 || '',
        city: user.address.city || '',
        state: user.address.state || '',
        postal_code: user.address.postal_code || ''
      });
      dispatch(setDeliveryAddress(user.address));
    }
  };

  const handlePaymentMethodChange = (method) => {
    dispatch(setPaymentMethod(method));
    if (method === 'cash') {
      // setAddressForm({ address_line_1: '', address_line_2: '', city: '', state: '', postal_code: '' });
      // setAddressMessage({ type: '', text: '' });
      setPaymentInfo({cardNumber: '', expirationDate: '', securityCode: '', billingZipCode: ''});
      dispatch(setCardInfo(paymentInfo));

    } else if (method === 'card' && Object.values(paymentInfo).every(value => value.trim() !== '')) {
      // Auto-fill with user's address if available
      dispatch(setCardInfo(paymentInfo));
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    
    // TODO
    // try {
    //   // Call your address service here
    //   // const response = await addressService.createAddress(addressForm);
      
    //   // Mock success for now
    //   const savedAddress = { ...addressForm, id: Date.now() };
      
    //   dispatch(setDeliveryAddress(savedAddress));
    //   setAddressMessage({ type: 'success', text: 'Address saved successfully!' });
      
    //   // Auto-fill form with saved address data
    //   setAddressForm(savedAddress);
      
    // } catch (error) {
    //   setAddressMessage({ type: 'error', text: 'Failed to save address. Please try again.' });
    // }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    // Prepare order data for backend
    const orderData = {
      cartItems: cartItems,
      amount,
      orderType,
      paymentMethod,
      deliveryAddress: orderType === 'delivery' ? deliveryAddress : null,
      totalPrice,
      cardInfo: paymentMethod === 'card' ? paymentInfo : null,
      status: 'pending',
    };

     try {
      let result;

      // if (updatingOrder) {
          // user will have option to update order (under given time constraint), post order creation.
      // }
      result = await postOrder(token, orderData);

      if (result.success) {
          // debugger
          setOrderSubmitSuccess(true);
          // setSuccess(result.message); set-order-success?

          // Reset forms
          setAddressForm({ address_line_1: '', address_line_2: '', city: '', state: '', postal_code: '' });
          setPaymentInfo({ cardNumber: '', expirationDate: '', securityCode: '', billingZipCode: '' });
          setAddressMessage({ type: '', text: '' });
          // dispatch(emptyCart());
          // alert(`Order placed successfully! Total: $${totalPrice}`);
          // Navigate to user's orders page after 1.5 seconds.
          setTimeout(() => {
              setOrderSubmitSuccess(false);
              // navigate('/{user}/orders');
              navigate('/'); // for now, navigate back to landing page post-order success response.
          }, 2000);

          dispatch(emptyCart());
        } else {
            // setError(result.message);
            // Handle validation errors
            if (result.errors) {
                console.log('Validation errors:', result.errors);
            }
        }
    } catch (error) {
      alert(`Error saving order: ${error}.`);
      console.error('Error saving order:', error);
      // setError('Failed to save order. Please try again.');
    }

    // // Process order (replace with actual API call)
    // console.log('Order data to be sent to Laravel backend:', orderData);

    // alert(`Order placed successfully! Total: $${totalPrice}`);
    

  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpirationDate = (value) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  // Validation function to check if order can be placed
  const isOrderValid = () => {
    // Must have items in cart
    if (cartItems.length === 0) return false;

    // Must have order type selected
    if (!orderType) return false;

    // If delivery, must have valid address
    if (orderType === 'delivery') {
      const addressValid = addressForm.address_line_1 && 
                          addressForm.city && 
                          addressForm.state && 
                          addressForm.postal_code;
      if (!addressValid) return false;
    }

    // Must have payment method selected
    if (!paymentMethod) return false;

    // If card payment, must have valid card info
    if (paymentMethod === 'card') {
      const cardValid = paymentInfo.cardNumber && 
                       paymentInfo.expirationDate && 
                       paymentInfo.securityCode && 
                       paymentInfo.billingZipCode;
      if (!cardValid) return false;
    }

    return true;
  };

    // Function to check if address form is incomplete
  const isAddressIncomplete = () => {
    return !addressForm.address_line_1 || 
           !addressForm.city || 
           !addressForm.state || 
           !addressForm.postal_code;
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-xl text-gray-600">Please log in to view your cart</p>
          <p className="text-gray-500 mt-2">You need to be logged in to add items to your cart</p>
          <div className="mt-6 space-x-4">
            <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-block transition duration-200">
              Log In
            </Link>
          </div>
        </div>
      </div>
    );
  }
  if (orderSubmitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Nikki's Pizza</h2>
          <p className="text-gray-600">Your order has been successfully placed.</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-xl text-gray-600">Your cart is empty</p>
          <p className="text-gray-500 mt-2">Add some delicious pizzas to get started!</p>
        </div>
      </div>
    );
  }



  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
      
      {/* Cart Items */}
      <div className="bg-white rounded-lg shadow-md mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
          
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b border-gray-200 py-4 last:border-b-0">
              <div className="flex items-center space-x-4">
                <img
                  src={`http://localhost:8000/storage/${item.image}`}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded-md"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=64&h=64&fit=crop";
                  }}
                />
                <div>
                  <h3 className="font-medium text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600">Size: {item.size}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-right min-w-[80px]">
                  <p className="font-medium text-gray-900">
                    ${item.price}
                  </p>
                </div>
                
                <button
                  onClick={() => handleRemoveFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center text-xl font-bold text-gray-900">
              <span>Total: ${totalPrice}</span>
              <button
                onClick={handleEmptyCart}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Empty Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Order Form */}
      <form onSubmit={handlePlaceOrder} className="space-y-8">
        
        {/* Order Type Toggle */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Type</h2>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => handleOrderTypeChange('pickup')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                orderType === 'pickup'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Pickup
            </button>
            <button
              type="button"
              onClick={() => handleOrderTypeChange('delivery')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                orderType === 'delivery'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Delivery
            </button>
          </div>
        </div>

        {/* Delivery Address Form */}
        {orderType === 'delivery' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Address</h2>
            {user?.address && <h4 className="text-m font-semibold text-gray-900 mb-4">Update Current Address?</h4>}
            {/* Address message */}
            {addressMessage.text && (
              <div className={`mb-4 p-3 rounded-md ${
                addressMessage.type === 'success' 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {addressMessage.text}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  id="address_line_1"
                  name="address_line_1"
                  value={addressForm.address_line_1}
                  onChange={(e) => handleAddressChange('address_line_1', e.target.value)}
                  placeholder="123 Main Street"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apartment, Suite, etc.
                </label>
                <input
                  type="text"
                  id="address_line_2"
                  name="address_line_2"
                  value={addressForm.address_line_2}
                  onChange={(e) => handleAddressChange('address_line_2', e.target.value)}
                  placeholder="Apt 4B (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={addressForm.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  placeholder="Your City"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  value={addressForm.state}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                  placeholder="ST"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  value={addressForm.postal_code}
                  onChange={(e) => handleAddressChange('postal_code', e.target.value)}
                  placeholder="12345"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <button
              type="button"
              onClick={handleAddressSubmit}
              // disabled={!isAddressIncomplete()}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              // className={`mt-4 px-6 py-2 rounded-lg text-white font-medium transition-colors ${
              //   isAddressIncomplete()
              //     ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
              //     : 'bg-gray-400 cursor-not-allowed'
              // }`}

            >
              Save Address
              {/* {!isAddressIncomplete() ? 'Update Address' : "Save Address" } */}
            </button>
          </div>
        )}

        {/* Payment Method Toggle */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => handlePaymentMethodChange('cash')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                paymentMethod === 'cash'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Cash
            </button>
            <button
              type="button"
              onClick={() => handlePaymentMethodChange('card')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                paymentMethod === 'card'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Card
            </button>
          </div>

          {/* Cash Payment Message */}
          {paymentMethod === 'cash' && (
            <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-md border border-green-200">
              <p className="font-medium">Cash Payment Selected</p>
              <p className="text-sm mt-1">You will pay with cash when you {orderType === 'pickup' ? 'pick up' : 'receive'} your order.</p>
            </div>
          )}
        </div>

        {/* Card Payment Information */}
        {paymentMethod === 'card' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Card Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number *
                </label>
                <input
                  type="text"
                  value={paymentInfo.cardNumber}
                  onChange={(e) => handlePaymentInfoChange('cardNumber', formatCardNumber(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiration Date *
                </label>
                <input
                  type="text"
                  value={paymentInfo.expirationDate}
                  onChange={(e) => handlePaymentInfoChange('expirationDate', formatExpirationDate(e.target.value))}
                  placeholder="MM/YY"
                  maxLength="5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Security Code *
                </label>
                <input
                  type="text"
                  value={paymentInfo.securityCode}
                  onChange={(e) => handlePaymentInfoChange('securityCode', e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="123"
                  maxLength="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Billing ZIP Code *
                </label>
                <input
                  type="text"
                  value={paymentInfo.billingZipCode}
                  onChange={(e) => handlePaymentInfoChange('billingZipCode', e.target.value)}
                  placeholder="12345"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Place Order Button */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <button
            type="submit"
            disabled={!isOrderValid()}
            className={`w-full font-bold py-4 px-6 rounded-lg text-lg transition-colors ${
              isOrderValid()
                ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Place Your Order
          </button>
          {!isOrderValid() && (
            <p className="text-sm text-gray-500 mt-2 text-center">
              Please complete all required fields to place your order
            </p>
          )}
        </div>
      </form>
    </div>
  );
}