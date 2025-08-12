import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartItems: [],
    amount: 0,
    totalPrice: 0.00,
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
        }
    }
})

export default cartSlice.reducer;
export const {addToCart, removeFromCart, emptyCart} = cartSlice.actions;