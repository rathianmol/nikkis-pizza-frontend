import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartItems: [],
    amount: 5,
    totalPrice: 0,
    // isLoading: true,
};

const cartSlice = createSlice({
    name: 'cart',
    // initialState: {
    //     items: []
    // },
    initialState,
    reducers: {
        addToCart : (state, action) => {
            console.log('inside cart slice - add to cart');
            // console.log(state);
            // console.log(action);
            console.log('dumping payload - ');
            // state.items.push(action.payload);
            state.cartItems.push(action.payload);
            // console.log(state.items);
            console.log('dumping .cartItems.length - ');
            console.log(state.cartItems.length);
            console.log('dumping cartItems after .push call - ');
            console.log(state.cartItems);
        },
        removeFromCart: (state, action) => {
            console.log('inside remove from cart');
            console.log('dumping payload: ');
            console.log(action.payload);
            console.log('dumping cart items length: ');
            state.cartItems= state.cartItems.filter((item) => item.id !== action.payload.id);
            console.log(state.cartItems.length);

        }
    }
})

export default cartSlice.reducer;
export const {addToCart, removeFromCart} = cartSlice.actions;