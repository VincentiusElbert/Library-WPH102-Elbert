import { configureStore } from '@reduxjs/toolkit';
import authSlice from './features/authSlice';
import uiSlice from './features/uiSlice';
import cartSlice from './features/cartSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    ui: uiSlice,
    cart: cartSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;