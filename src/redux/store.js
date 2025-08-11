import { configureStore } from '@reduxjs/toolkit';
// import cartSlice from './cartSlice';
import cartReducer from './cartSlice';

const store = configureStore({
    // reducer: {
    //     cart: cartSlice
    // }
    
    // reducer: cartSlice

    reducer: {
        cart: cartReducer, 
    },
});

export default store;