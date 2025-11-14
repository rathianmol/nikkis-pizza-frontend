// services/storeLocationService.js

const baseURL = 'http://localhost:8000/api/store-locations';

// Helper function to get auth headers
const getAuthHeaders = (token) => {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

// GET - Retrieve all store locations (public)
export const getStoreLocations = async () => {
  try {
    const response = await fetch(`${baseURL}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
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
        message: data.message || 'Failed to retrieve store locations.',
        error: data.error || null,
      };
    }
  } catch (error) {
    console.error('Get store locations failed:', error);
    return {
      success: false,
      message: 'Network error. Please check your connection.',
      error: error.message,
    };
  }
};

// GET - Retrieve single store location by ID
export const getStoreLocationById = async (locationId) => {
  try {
    const response = await fetch(`${baseURL}/${locationId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
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
        message: data.message || 'Failed to retrieve store location.',
        error: data.error || null,
      };
    }
  } catch (error) {
    console.error('Get store location failed:', error);
    return {
      success: false,
      message: 'Network error. Please check your connection.',
      error: error.message,
    };
  }
};

// GET - Retrieve primary store location
export const getPrimaryStoreLocation = async () => {
  try {
    const response = await fetch(`${baseURL}/primary`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
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
        message: data.message || 'Failed to retrieve primary store location.',
        error: data.error || null,
      };
    }
  } catch (error) {
    console.error('Get primary store location failed:', error);
    return {
      success: false,
      message: 'Network error. Please check your connection.',
      error: error.message,
    };
  }
};

// POST - Create new store location (Admin only)
export const createStoreLocation = async (token, locationData) => {
  try {
    const response = await fetch(`${baseURL}`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(locationData),
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
        message: data.message || 'Failed to create store location.',
        error: data.error || null,
        errors: data.errors || null,
      };
    }
  } catch (error) {
    console.error('Create store location failed:', error);
    return {
      success: false,
      message: 'Network error. Please check your connection.',
      error: error.message,
    };
  }
};

// PUT - Update store location (Admin only)
export const updateStoreLocation = async (token, locationId, locationData) => {
  try {
    const response = await fetch(`${baseURL}/${locationId}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(locationData),
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
        message: data.message || 'Failed to update store location.',
        error: data.error || null,
        errors: data.errors || null,
      };
    }
  } catch (error) {
    console.error('Update store location failed:', error);
    return {
      success: false,
      message: 'Network error. Please check your connection.',
      error: error.message,
    };
  }
};

// DELETE - Delete store location (Admin only)
export const deleteStoreLocation = async (token, locationId) => {
  try {
    const response = await fetch(`${baseURL}/${locationId}`, {
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
        message: data.message || 'Failed to delete store location.',
        error: data.error || null,
      };
    }
  } catch (error) {
    console.error('Delete store location failed:', error);
    return {
      success: false,
      message: 'Network error. Please check your connection.',
      error: error.message,
    };
  }
};