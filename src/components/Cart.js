import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { removeFromCart, updateQuantity, clearCart } from '../redux/cartSlice';
import { removeFromCart } from '../redux/cartSlice';

export default function Cart() {
//   const cartItems = useSelector(state => state.cart.cart);
// const cartItems = useSelector(state => state.cart.items);
// 

const { cartItems, totalPrice, amount } = useSelector((store) => store.cart);

console.log("inside cart component - dumping cartItems var:");
console.log(cartItems);

  const dispatch = useDispatch();
  
  // Form states
  const [contactInfo, setContactInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  });
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expirationDate: '',
    securityCode: '',
    billingZipCode: ''
  });

  // Mock user authentication state (replace with actual auth logic)
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  // Calculate total
  // const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = cartItems.reduce((sum, item) => sum + (item.price), 0);

  const handleRemoveFromCart = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity > 0) {
    //   dispatch(updateQuantity({ itemId, quantity: newQuantity }));
    }
  };

  const handleContactInfoChange = (field, value) => {
    setContactInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaymentInfoChange = (field, value) => {
    setPaymentInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!isUserLoggedIn) {
      if (!contactInfo.firstName || !contactInfo.lastName || !contactInfo.email || !contactInfo.phoneNumber) {
        alert('Please fill in all contact information fields.');
        return;
      }
    }
    
    if (!paymentInfo.cardNumber || !paymentInfo.expirationDate || !paymentInfo.securityCode || !paymentInfo.billingZipCode) {
      alert('Please fill in all payment information fields.');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    // Process order (replace with actual API call)
    console.log('Order placed:', {
      items: cartItems,
      contactInfo: isUserLoggedIn ? null : contactInfo,
      paymentInfo,
      total
    });

    // alert(`Order placed successfully! Total: $${total.toFixed(2)}`);
    // dispatch(clearCart());
    
    // Reset forms
    setContactInfo({ firstName: '', lastName: '', email: '', phoneNumber: '' });
    setPaymentInfo({ cardNumber: '', expirationDate: '', securityCode: '', billingZipCode: '' });
  };

  const formatCardNumber = (value) => {
    // Remove all non-numeric characters
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    // Add spaces every 4 digits
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
    // Remove all non-numeric characters
    const v = value.replace(/\D/g, '');
    // Add slash after 2 digits
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

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
                //   src={`http://localhost:8000/storage/${item.pizza.image}`}
                //   alt={item.pizza.title}
                  className="w-16 h-16 object-cover rounded-md"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=64&h=64&fit=crop";
                  }}
                />
                <div>
                  {/* <h3 className="font-medium text-gray-900">{item.pizza.title}</h3> */}
                  {/* <p className="text-sm text-gray-600">Size: {item.selectedSize}</p> */}
                  <p className="text-sm text-gray-600">Size: {item.size}</p>
                  <p className="text-sm text-green-600 font-medium">${item.price}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                </div> */}
                
                <div className="text-right min-w-[80px]">
                  <p className="font-medium text-gray-900">
                    ${item.price}
                  </p>
                </div>
                
                <button
                  onClick={() => handleRemoveFromCart(item.id)}
                  // onClick={() => dispatch(removeFromCart({id: item.id}))}
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
            <div className="flex justify-between text-xl font-bold text-gray-900">
              <span>Total: ${total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Form */}
      <form onSubmit={handlePlaceOrder} className="space-y-8">
        {/* Contact Information (only if not logged in) */}
        {!isUserLoggedIn && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  value={contactInfo.firstName}
                  onChange={(e) => handleContactInfoChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={contactInfo.lastName}
                  onChange={(e) => handleContactInfoChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => handleContactInfoChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Call-back Number *
                </label>
                <input
                  type="tel"
                  value={contactInfo.phoneNumber}
                  onChange={(e) => handleContactInfoChange('phoneNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Payment Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Information</h2>
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

        {/* Place Order Button */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors"
          >
            Place Your Order - ${total}
          </button>
          
          {/* Debug toggle for testing (remove in production) */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsUserLoggedIn(!isUserLoggedIn)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {isUserLoggedIn ? 'Simulate Logged Out' : 'Simulate Logged In'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}