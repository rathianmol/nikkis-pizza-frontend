import { createSlice } from "@reduxjs/toolkit";

// Helper function to calculate item total (base + addons)
const calculateItemTotal = (item) => {
  let total = parseFloat(item.basePrice);
  if (item.addons && item.addons.length > 0) {
    item.addons.forEach(addon => {
      total += parseFloat(addon.price);
    });
  }
  return Math.round(total * 100) / 100;
};

// Load initial state from localStorage
const loadCartFromStorage = () => {
  let initialState = {
    cartItems: [],
    amount: 0,
    totalPrice: 0.00,
    orderType: 'pickup',
    paymentMethod: 'cash',
    cardInfo: null,
    deliveryAddress: null,
  };
  
  try {
    const serializedCart = localStorage.getItem('cart');
    if (serializedCart === null) {
      return initialState;
    }
    return JSON.parse(serializedCart);
  } catch (error) {
    console.warn('Could not load cart from localStorage:', error);
    return initialState;
  }
};

// Save to localStorage helper
const saveCartToStorage = (state) => {
  try {
    localStorage.setItem('cart', JSON.stringify(state));
  } catch (error) {
    console.warn('Could not save cart to localStorage:', error);
  }
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      // Recalculate price to ensure accuracy
      const itemPrice = calculateItemTotal(newItem);
      newItem.price = itemPrice.toFixed(2);
      
      state.cartItems.push(newItem);
      state.amount += 1;
      state.totalPrice = Math.round((state.totalPrice + itemPrice) * 100) / 100;
      saveCartToStorage(state);
    },
    
    removeFromCart: (state, action) => {
      const itemToRemove = state.cartItems.find((item) => item.id === action.payload);
      
      if (itemToRemove) {
        state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
        state.amount -= 1;
        state.totalPrice = Math.round((state.totalPrice - parseFloat(itemToRemove.price)) * 100) / 100;
        saveCartToStorage(state);
      }
    },
    
    updateCartItem: (state, action) => {
      const { id, updates } = action.payload;
      const itemIndex = state.cartItems.findIndex((item) => item.id === id);
      
      if (itemIndex !== -1) {
        const oldPrice = parseFloat(state.cartItems[itemIndex].price);
        state.cartItems[itemIndex] = { ...state.cartItems[itemIndex], ...updates };
        
        // Recalculate item price if addons changed
        const newPrice = calculateItemTotal(state.cartItems[itemIndex]);
        state.cartItems[itemIndex].price = newPrice.toFixed(2);
        
        // Update total price
        state.totalPrice = Math.round((state.totalPrice - oldPrice + newPrice) * 100) / 100;
        saveCartToStorage(state);
      }
    },
    
    emptyCart: (state, action) => {
      state.cartItems = [];
      state.amount = 0;
      state.totalPrice = 0.00;
      state.orderType = 'pickup';
      state.paymentMethod = 'cash';
      state.deliveryAddress = null;
      state.cardInfo = null;
      
      if (action.payload === 'logout') {
        localStorage.removeItem('cart');
      } else {
        saveCartToStorage(state);
      }
    },
    
    setOrderType: (state, action) => {
      state.orderType = action.payload;
      if (action.payload === 'pickup') {
        state.deliveryAddress = null;
      }
      saveCartToStorage(state);
    },
    
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      if (action.payload === 'cash') {
        state.cardInfo = null;
      }
      saveCartToStorage(state);
    },
    
    setDeliveryAddress: (state, action) => {
      state.deliveryAddress = action.payload;
      saveCartToStorage(state);
    },
    
    setCardInfo: (state, action) => {
      state.cardInfo = action.payload;
      saveCartToStorage(state);
    },
  }
});

export default cartSlice.reducer;
export const {
  addToCart,
  removeFromCart,
  updateCartItem,
  emptyCart,
  setOrderType,
  setPaymentMethod,
  setDeliveryAddress,
  setCardInfo,
} = cartSlice.actions;

/**
 * Updated cart item structure:
 * {
 *   id: "3-medium-1756238120041",  // menuItemId-size-timestamp
 *   menuItemId: 3,
 *   categoryId: 1,
 *   title: "Margherita Pizza",
 *   slug: "margherita",
 *   description: "Classic pizza with tomato sauce and mozzarella",
 *   image: "pizzas/margherita-pizza.png",
 *   size: "medium",
 *   price: "274.00",  // Calculated total (base + addons)
 *   basePrice: "229.00",  // Base price for the size
 *   addons: [
 *     {
 *       addonId: 1,
 *       addonName: "Extra Cheese",
 *       size: "medium",
 *       price: "45.00"
 *     }
 *   ]
 * }
 * 
 * Complete cart state:
 * {
 *   cartItems: [...],
 *   amount: 2,
 *   totalPrice: 548.00,
 *   orderType: "delivery",
 *   paymentMethod: "card",
 *   deliveryAddress: {
 *     id: 1,
 *     address_line_1: "123 Main St",
 *     address_line_2: "Apt 4B",
 *     city: "Mumbai",
 *     state: "Maharashtra",
 *     postal_code: "400001"
 *   },
 *   cardInfo: {
 *     cardNumber: "1234 5678 9012 3456",
 *     expirationDate: "12/25",
 *     securityCode: "123",
 *     billingZipCode: "400001"
 *   }
 * }
 */