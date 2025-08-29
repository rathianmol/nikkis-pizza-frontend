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


// DELETE - Delete user's order.
export const deleteOrder = async (token, orderId) => {
  try {
    const response = await fetch(`${baseURL}/${orderId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: data.success,
        message: data.message,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to delete order.',
        error: data.error || null,
      };
    }
  } catch (error) {
    console.error('Delete order failed:', error);
    return {
      success: false,
      message: 'Network error. Please check your connection.',
      error: error.message,
    };
  }
};


// PUT - Update existing user order.
export const updateOrder = async (token, orderData) => {
  try {
    const response = await fetch(`${baseURL}/${orderData.id}`, {
      method: 'PUT',
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
        message: data.message || 'Failed to update order.',
        error: data.error || null,
        errors: data.errors || null, // Validation errors
      };
    }
  } catch (error) {
    console.error('Update order failed:', error);
    return {
      success: false,
      message: 'Network error. Please check your connection.',
      error: error.message,
    };
  }
};


// GET - Retrieve orders. OrderController - index.
export const getOrders = async (token) => { // index
  try {
    const response = await fetch(`${baseURL}/`, {
      method: 'GET',
      headers: getAuthHeaders(token),
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
        message: data.message || 'Failed to retrieve orders.',
        error: data.error || null,
      };
    }
  } catch (error) {
    console.error('Get orders failed:', error);
    return {
      success: false,
      message: 'Network error. Please check your connection.',
      error: error.message,
    };
  }
};

// GET - Retrieve order. Route::get('/{order}', [OrderController::class, 'show']);
export const getOrderById = async (token, orderId) => {
  try {
    const response = await fetch(`${baseURL}/${orderId}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
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
        message: data.message || 'Failed to retrieve order.',
        error: data.error || null,
      };
    }
  } catch (error) {
    console.error('Get order failed:', error);
    return {
      success: false,
      message: 'Network error. Please check your connection.',
      error: error.message,
    };
  }
};