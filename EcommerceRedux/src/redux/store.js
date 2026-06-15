import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';
import cartReducer from './cartSlice';
import wishlistReducer from './wishlistSlice';
import notificationReducer from './notificationSlice';
import themeReducer from './themeSlice';

const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    notifications: notificationReducer,
    theme: themeReducer
  }
});

export default store;
