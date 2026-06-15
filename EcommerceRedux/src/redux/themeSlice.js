import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) return savedTheme;
  return 'dark'; // Premium dark mode by default
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: getInitialTheme()
  },
  reducers: {
    toggleTheme: (state) => {
      const nextMode = state.mode === 'dark' ? 'light' : 'dark';
      state.mode = nextMode;
      localStorage.setItem('theme', nextMode);
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
      localStorage.setItem('theme', action.payload);
    }
  }
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
