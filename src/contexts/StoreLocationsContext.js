// import { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import {
//   getStoreLocations,
//   getStoreLocationById,
//   getPrimaryStoreLocation,
//   createStoreLocation,
//   updateStoreLocation,
//   deleteStoreLocation,
// } from '../services/StoreLocationsService';

// const StoreLocationContext = createContext();

// export const StoreLocationsProvider = ({ children }) => {
//   const [storeLocations, setStoreLocations] = useState([]);
//   const [primaryLocation, setPrimaryLocation] = useState(null);
//   const [selectedLocation, setSelectedLocation] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch all store locations on mount
//   const fetchStoreLocations = useCallback(async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await getStoreLocations();
      
//       if (response.success) {
//         setStoreLocations(response.data);
        
//         // Find and set primary location
//         const primary = response.data.find(location => location.is_primary);
//         if (primary) {
//           setPrimaryLocation(primary);
//         }
//       } else {
//         setError(response.message);
//       }
//     } catch (err) {
//       setError('Failed to load store locations');
//       console.error('Error fetching store locations:', err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Fetch single location by ID
//   const fetchLocationById = useCallback(async (locationId) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await getStoreLocationById(locationId);
      
//       if (response.success) {
//         setSelectedLocation(response.data);
//         return response.data;
//       } else {
//         setError(response.message);
//         return null;
//       }
//     } catch (err) {
//       setError('Failed to load store location');
//       console.error('Error fetching store location:', err);
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Fetch primary location
//   const fetchPrimaryLocation = useCallback(async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await getPrimaryStoreLocation();
      
//       if (response.success) {
//         setPrimaryLocation(response.data);
//         return response.data;
//       } else {
//         setError(response.message);
//         return null;
//       }
//     } catch (err) {
//       setError('Failed to load primary store location');
//       console.error('Error fetching primary location:', err);
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Create new store location (Admin)
//   const addStoreLocation = async (token, locationData) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await createStoreLocation(token, locationData);
      
//       if (response.success) {
//         // Refresh the list
//         await fetchStoreLocations();
//         return { success: true, data: response.data };
//       } else {
//         setError(response.message);
//         return { success: false, message: response.message, errors: response.errors };
//       }
//     } catch (err) {
//       setError('Failed to create store location');
//       console.error('Error creating store location:', err);
//       return { success: false, message: 'Network error' };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update store location (Admin)
//   const editStoreLocation = async (token, locationId, locationData) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await updateStoreLocation(token, locationId, locationData);
      
//       if (response.success) {
//         // Update local state
//         setStoreLocations(prev => 
//           prev.map(loc => loc.id === locationId ? response.data : loc)
//         );
        
//         // Update primary if needed
//         if (response.data.is_primary) {
//           setPrimaryLocation(response.data);
//         }
        
//         return { success: true, data: response.data };
//       } else {
//         setError(response.message);
//         return { success: false, message: response.message, errors: response.errors };
//       }
//     } catch (err) {
//       setError('Failed to update store location');
//       console.error('Error updating store location:', err);
//       return { success: false, message: 'Network error' };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete store location (Admin)
//   const removeStoreLocation = async (token, locationId) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await deleteStoreLocation(token, locationId);
      
//       if (response.success) {
//         // Remove from local state
//         setStoreLocations(prev => prev.filter(loc => loc.id !== locationId));
        
//         // Clear primary if it was deleted
//         if (primaryLocation?.id === locationId) {
//           setPrimaryLocation(null);
//         }
        
//         return { success: true };
//       } else {
//         setError(response.message);
//         return { success: false, message: response.message };
//       }
//     } catch (err) {
//       setError('Failed to delete store location');
//       console.error('Error deleting store location:', err);
//       return { success: false, message: 'Network error' };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Get active store locations only
//   const getActiveLocations = useCallback(() => {
//     return storeLocations.filter(location => location.is_active);
//   }, [storeLocations]);

//   // Get hours for a specific day
//   const getHoursForDay = useCallback((location, day) => {
//     const dayLower = day.toLowerCase();
//     return location[`${dayLower}_hours`] || 'Closed';
//   }, []);

//   // Check if store is open now (you can enhance this with actual time checking)
//   const isStoreOpen = useCallback((location) => {
//     // This is a simple check - you'd want to implement actual time logic
//     return location.is_active;
//   }, []);

//   // Initial load
//   useEffect(() => {
//     fetchStoreLocations();
//   }, [fetchStoreLocations]);

//   const value = {
//     // State
//     storeLocations,
//     primaryLocation,
//     selectedLocation,
//     loading,
//     error,
    
//     // Actions
//     fetchStoreLocations,
//     fetchLocationById,
//     fetchPrimaryLocation,
//     addStoreLocation,
//     editStoreLocation,
//     removeStoreLocation,
//     setSelectedLocation,
    
//     // Helpers
//     getActiveLocations,
//     getHoursForDay,
//     isStoreOpen,
//   };

//   return (
//     <StoreLocationContext.Provider value={value}>
//       {children}
//     </StoreLocationContext.Provider>
//   );
// };

// export const useStoreLocation = () => {
//   const context = useContext(StoreLocationContext);
//   if (!context) {
//     throw new Error('useStoreLocation must be used within StoreLocationProvider');
//   }
//   return context;
// };


import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getStoreLocations,
  getStoreLocationById,
  getPrimaryStoreLocation,
  createStoreLocation,
  updateStoreLocation,
  deleteStoreLocation,
} from '../services/StoreLocationsService';

const StoreLocationContext = createContext();

export const StoreLocationsProvider = ({ children }) => {
  const [storeLocations, setStoreLocations] = useState([]);
  const [primaryLocation, setPrimaryLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all store locations on mount
  const fetchStoreLocations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getStoreLocations();
      
      if (response.success) {
        setStoreLocations(response.data);
        
        // Find and set primary location
        const primary = response.data.find(location => location.is_primary);
        if (primary) {
          setPrimaryLocation(primary);
          // Auto-select primary location if nothing is selected yet
          if (!selectedLocation) {
            setSelectedLocation(primary.id);
          }
        } else if (response.data.length > 0 && !selectedLocation) {
          // If no primary but locations exist, select the first one
          setSelectedLocation(response.data[0].id);
        }
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to load store locations');
      console.error('Error fetching store locations:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedLocation]);

  // Fetch single location by ID
  const fetchLocationById = useCallback(async (locationId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getStoreLocationById(locationId);
      
      if (response.success) {
        return response.data;
      } else {
        setError(response.message);
        return null;
      }
    } catch (err) {
      setError('Failed to load store location');
      console.error('Error fetching store location:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch primary location
  const fetchPrimaryLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getPrimaryStoreLocation();
      
      if (response.success) {
        setPrimaryLocation(response.data);
        return response.data;
      } else {
        setError(response.message);
        return null;
      }
    } catch (err) {
      setError('Failed to load primary store location');
      console.error('Error fetching primary location:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new store location (Admin)
  const addStoreLocation = async (token, locationData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await createStoreLocation(token, locationData);
      
      if (response.success) {
        // Add to local state immediately for optimistic UI
        setStoreLocations(prev => [...prev, response.data]);
        
        // Update primary if this is the new primary
        if (response.data.is_primary) {
          setPrimaryLocation(response.data);
        }
        
        // If this is the first location, auto-select it
        if (storeLocations.length === 0) {
          setSelectedLocation(response.data.id);
        }
        
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, message: response.message, errors: response.errors };
      }
    } catch (err) {
      setError('Failed to create store location');
      console.error('Error creating store location:', err);
      return { success: false, message: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  // Update store location (Admin)
  const editStoreLocation = async (token, locationId, locationData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await updateStoreLocation(token, locationId, locationData);
      
      if (response.success) {
        // Update local state
        setStoreLocations(prev => 
          prev.map(loc => loc.id === locationId ? response.data : loc)
        );
        
        // Update primary if needed
        if (response.data.is_primary) {
          setPrimaryLocation(response.data);
        }
        
        return { success: true, data: response.data };
      } else {
        setError(response.message);
        return { success: false, message: response.message, errors: response.errors };
      }
    } catch (err) {
      setError('Failed to update store location');
      console.error('Error updating store location:', err);
      return { success: false, message: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  // Delete store location (Admin)
  const removeStoreLocation = async (token, locationId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await deleteStoreLocation(token, locationId);
      
      if (response.success) {
        // Remove from local state
        setStoreLocations(prev => prev.filter(loc => loc.id !== locationId));
        
        // Clear primary if it was deleted
        if (primaryLocation?.id === locationId) {
          setPrimaryLocation(null);
        }
        
        // Clear selected if it was deleted and select another
        if (selectedLocation === locationId) {
          const remainingLocations = storeLocations.filter(loc => loc.id !== locationId);
          if (remainingLocations.length > 0) {
            const newPrimary = remainingLocations.find(loc => loc.is_primary);
            setSelectedLocation(newPrimary?.id || remainingLocations[0].id);
          } else {
            setSelectedLocation(null);
          }
        }
        
        return { success: true };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (err) {
      setError('Failed to delete store location');
      console.error('Error deleting store location:', err);
      return { success: false, message: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  // Get active store locations only
  const getActiveLocations = useCallback(() => {
    return storeLocations.filter(location => location.is_active);
  }, [storeLocations]);

  // Get the currently selected location object
  const getSelectedLocationObject = useCallback(() => {
    return storeLocations.find(loc => loc.id === selectedLocation) || null;
  }, [storeLocations, selectedLocation]);

  // Get primary location object (helper method)
  const getPrimaryLocation = useCallback(() => {
    return primaryLocation || storeLocations.find(loc => loc.is_primary) || storeLocations[0] || null;
  }, [primaryLocation, storeLocations]);

  // Get hours for a specific day
  const getHoursForDay = useCallback((location, day) => {
    const dayLower = day.toLowerCase();
    return location[`${dayLower}_hours`] || 'Closed';
  }, []);

  // Check if store is open now (you can enhance this with actual time checking)
  const isStoreOpen = useCallback((location) => {
    // This is a simple check - you'd want to implement actual time logic
    return location.is_active;
  }, []);

  // Get location by ID from local state (no API call)
  const getLocationById = useCallback((locationId) => {
    return storeLocations.find(loc => loc.id === locationId) || null;
  }, [storeLocations]);

  // Initial load
  useEffect(() => {
    fetchStoreLocations();
  }, [fetchStoreLocations]);

  const value = {
    // State
    storeLocations,
    primaryLocation,
    selectedLocation,
    loading,
    error,
    
    // Setters
    setSelectedLocation,
    
    // Actions (API calls)
    fetchStoreLocations,
    fetchLocationById,
    fetchPrimaryLocation,
    addStoreLocation,
    editStoreLocation,
    removeStoreLocation,
    
    // Helpers (no API calls)
    getActiveLocations,
    getSelectedLocationObject,
    getPrimaryLocation,
    getLocationById,
    getHoursForDay,
    isStoreOpen,
  };

  return (
    <StoreLocationContext.Provider value={value}>
      {children}
    </StoreLocationContext.Provider>
  );
};

// Custom hook to use the context
export const useStoreLocation = () => {
  const context = useContext(StoreLocationContext);
  if (!context) {
    throw new Error('useStoreLocation must be used within StoreLocationProvider');
  }
  return context;
};

// Alternative export for consistency with other patterns
export const useStoreLocations = useStoreLocation;