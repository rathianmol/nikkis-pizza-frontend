import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartItems: [],
    amount: 0,
    totalPrice: 0.00,
    orderType: 'pickup', // 'pickup' or 'delivery'
    paymentMethod: 'cash', // 'cash' or 'card'
    deliveryAddress: null, // Will store address object when delivery is selected
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart : (state, action) => {
            state.cartItems.push(action.payload);
            state.amount+=1;
            state.totalPrice = Math.round((state.totalPrice + parseFloat(action.payload.price)) * 100) / 100;
        },
        removeFromCart: (state, action) => {          
            const itemToRemove = state.cartItems.find((item) => item.id === action.payload);
            
            if (itemToRemove) {
                // Remove the item
                state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
                state.amount -= 1;
                state.totalPrice = Math.round((state.totalPrice - parseFloat(itemToRemove.price)) * 100) / 100;
            }
        },
        emptyCart: (state, action) => {
            state.cartItems = [];
            state.amount = 0;
            state.totalPrice = 0.00;
            state.orderType = 'pickup';
            state.paymentMethod = 'cash';
            state.deliveryAddress = null;
        },
        setOrderType: (state, action) => {
            state.orderType = action.payload;
            // Clear delivery address if switching to pickup
            if (action.payload === 'pickup') {
                state.deliveryAddress = null;
            }
        },
        setPaymentMethod: (state, action) => {
            state.paymentMethod = action.payload;
        },
        setDeliveryAddress: (state, action) => {
            state.deliveryAddress = action.payload;
        }
    }
})

export default cartSlice.reducer;
export const {
    addToCart, 
    removeFromCart, 
    emptyCart, 
    setOrderType, 
    setPaymentMethod, 
    setDeliveryAddress
} = cartSlice.actions;