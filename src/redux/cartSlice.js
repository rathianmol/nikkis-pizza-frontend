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
            state.totalPrice += parseFloat(action.payload.price);
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
            state.amount-=1;
            state.totalPrice -= parseFloat(action.payload.price);
        }
    }
})

export default cartSlice.reducer;
export const {addToCart, removeFromCart} = cartSlice.actions;