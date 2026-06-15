import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: [],
  reducers: {
    addNotification: {
      reducer: (state, action) => {
        state.push(action.payload);
      },
      prepare: (payload) => {
        const id = Math.random().toString(36).substring(2, 9);
        return { payload: { id, text: payload.text, type: payload.type || 'info' } };
      }
    },
    removeNotification: (state, action) => {
      return state.filter(notification => notification.id !== action.payload);
    }
  }
});

export const { addNotification, removeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
