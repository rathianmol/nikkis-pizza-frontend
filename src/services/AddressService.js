const baseURL = 'http://localhost:8000/api/address/user';

// Helper function to get auth headers
const getAuthHeaders = (token) => {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

// GET - Retrieve user's address
export const get = async (token) => {
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
        message: data.message || 'Failed to retrieve address',
        error: data.error || null,
      };
    }
  } catch (error) {
    console.error('Get address failed:', error);
    return {
      success: false,
      message: 'Network error. Please check your connection.',
      error: error.message,
    };
  }
};

// POST - Create new address
export const post = async (token, addressData) => {
  try {
    const response = await fetch(`${baseURL}/`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({
        address_line_1: addressData.address_line_1,
        address_line_2: addressData.address_line_2 || null,
        city: addressData.city,
        state: addressData.state,
        postal_code: addressData.postal_code,
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
        message: data.message || 'Failed to create address',
        error: data.error || null,
        errors: data.errors || null, // Validation errors
      };
    }
  } catch (error) {
    console.error('Create address failed:', error);
    return {
      success: false,
      message: 'Network error. Please check your connection.',
      error: error.message,
    };
  }
};

// PUT - Update existing address
export const put = async (token, addressData) => {
  try {
    const response = await fetch(`${baseURL}/`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify({
        address_line_1: addressData.address_line_1,
        address_line_2: addressData.address_line_2 || null,
        city: addressData.city,
        state: addressData.state,
        postal_code: addressData.postal_code,
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
        message: data.message || 'Failed to update address',
        error: data.error || null,
        errors: data.errors || null, // Validation errors
      };
    }
  } catch (error) {
    console.error('Update address failed:', error);
    return {
      success: false,
      message: 'Network error. Please check your connection.',
      error: error.message,
    };
  }
};

// DELETE - Delete user's address
export const del = async (token) => {
  try {
    const response = await fetch(`${baseURL}/`, {
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
        message: data.message || 'Failed to delete address',
        error: data.error || null,
      };
    }
  } catch (error) {
    console.error('Delete address failed:', error);
    return {
      success: false,
      message: 'Network error. Please check your connection.',
      error: error.message,
    };
  }
};

// Optional: Export all functions as an object for convenience
// export default {
//   get,
//   post,
//   put,
//   del,
// };