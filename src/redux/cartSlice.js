import { createSlice } from "@reduxjs/toolkit";

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
        addToCart : (state, action) => {
            state.cartItems.push(action.payload);
            state.amount+=1;
            state.totalPrice = Math.round((state.totalPrice + parseFloat(action.payload.price)) * 100) / 100;
            saveCartToStorage(state);
        },
        removeFromCart: (state, action) => {          
            const itemToRemove = state.cartItems.find((item) => item.id === action.payload);
            
            if (itemToRemove) {
                // Remove the item
                state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
                state.amount -= 1;
                state.totalPrice = Math.round((state.totalPrice - parseFloat(itemToRemove.price)) * 100) / 100;
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
            saveCartToStorage(state);
        },
        setOrderType: (state, action) => {
            state.orderType = action.payload;
            // Clear delivery address if switching to pickup
            if (action.payload === 'pickup') {
            state.deliveryAddress = null;
            }
            saveCartToStorage(state);
        },
        setPaymentMethod: (state, action) => {
            state.paymentMethod = action.payload;
            if (action.payload === 'card') {
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
        // Optional: Clear localStorage
        // clearCartStorage: (state) => {
        //     localStorage.removeItem('pizzaCart');
        //     Object.assign(state, {
        //         cartItems: [],
        //         amount: 0,
        //         totalPrice: 0.00,
        //         orderType: 'pickup',
        //         paymentMethod: 'cash',
        //         cardInfo: null,
        //         deliveryAddress: null,
        //     });
        // }
    }
})

export default cartSlice.reducer;
export const {
    addToCart, 
    removeFromCart, 
    emptyCart, 
    setOrderType, 
    setPaymentMethod, 
    setDeliveryAddress,
    setCardInfo,
} = cartSlice.actions;


/**
 * sample payload:
 * 
 * {
  "cartItems": [
    {
      "id": "3-Small-1756238120041",
      "pizzaId": 3,
      "title": "Margherita Pizza",
      "image": "pizzas/margherita-pizza.png",
      "size": "Small",
      "price": "7.99"
    },
    {
      "id": "2-Small-1756146975716",
      "pizzaId": 2,
      "title": "Wild Mushroom Pizza",
      "image": "pizzas/mushroom-pizza.png",
      "size": "Small",
      "price": "9.99"
    }
  ],
  "amount": 2,
  "totalPrice": 17.98,
  "orderType": "delivery",
  "paymentMethod": "card",
  "deliveryAddress": {
    "id": 1,
    "address_line_1": "123 Customer One Lane",
    "address_line_2": "Apt 1224",
    "city": "Burbank",
    "state": "CA",
    "postal_code": "90210"
  },
  "cardInfo": {
    "cardNumber": "1234 5678 9012 3456",
    "expirationDate": "11/30",
    "securityCode": "123",
    "billingZipCode": "90210"
  },
  "status": "pending"
}
 */