const baseURL = 'http://localhost:8000/api/orders';

// Helper function to get auth headers
const getAuthHeaders = (token) => {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};


// POST - Create new address
export const postOrder = async (token, orderData) => {
  try {
    const response = await fetch(`${baseURL}/`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({
        cartItems: orderData.cartItems,
        amount: orderData.amount,
        totalPrice: orderData.totalPrice,
        orderType: orderData.orderType,
        paymentMethod: orderData.paymentMethod,
        deliveryAddress: orderData.deliveryAddress,
        cardInfo: orderData.cardInfo,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: data.success,
        data: data.data,
        message: data.message,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to create order.',
        error: data.error || null,
        errors: data.errors || null, // Validation errors
      };
    }
  } catch (error) {
    console.error('Create order failed:', error);
    return {
      success: false,
      message: 'Network error. Please check your connection.',
      error: error.message,
    };
  }
};