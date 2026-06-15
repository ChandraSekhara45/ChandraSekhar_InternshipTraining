import { createSlice } from '@reduxjs/toolkit';

const loadWishlist = () => {
  try {
    const data = localStorage.getItem('wishlist_v2');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: loadWishlist()
  },
  reducers: {
    toggleWishlist: (state, action) => {
      const productId = action.payload;
      const index = state.items.indexOf(productId);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(productId);
      }
      localStorage.setItem('wishlist_v2', JSON.stringify(state.items));
    },
    clearWishlist: (state) => {
      state.items = [];
      localStorage.setItem('wishlist_v2', JSON.stringify([]));
    }
  }
});

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
