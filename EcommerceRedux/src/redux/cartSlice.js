 import { createSlice } from '@reduxjs/toolkit';

const loadCart = () => {
  try {
    const data = localStorage.getItem('cart_v2');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

const saveCart = (items) => {
  localStorage.setItem('cart_v2', JSON.stringify(items));
};

const PROMO_CODES = {
  'MINIMALIST10': 10,
  'BLACKFRIDAY': 20,
  'PREMIUM50': 50
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCart(),
    promoCode: '',
    discountPercent: 0,
    promoError: ''
  },
  reducers: {
    addToCart: (state, action) => {
      const { id, name, price, image, category } = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ id, name, price, image, category, quantity: 1 });
      }
      saveCart(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveCart(state.items);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.quantity = Math.max(1, quantity);
      }
      saveCart(state.items);
    },
    applyPromoCode: (state, action) => {
      const code = action.payload.trim().toUpperCase();
      if (PROMO_CODES[code] !== undefined) {
        state.promoCode = code;
        state.discountPercent = PROMO_CODES[code];
        state.promoError = '';
      } else {
        state.promoError = 'Invalid promotional code';
      }
    },
    removePromoCode: (state) => {
      state.promoCode = '';
      state.discountPercent = 0;
      state.promoError = '';
    },
    clearCart: (state) => {
      state.items = [];
      state.promoCode = '';
      state.discountPercent = 0;
      state.promoError = '';
      saveCart([]);
    }
  }
});

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  applyPromoCode, 
  removePromoCode, 
  clearCart 
} = cartSlice.actions;

export default cartSlice.reducer;
