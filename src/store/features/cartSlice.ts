import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Book {
  id: string;
  title: string;
  author: string;
  cover_image: string;
  stock: number;
  category?: string;
}

interface CartState {
  items: Book[];
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Book>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (!existingItem && action.payload.stock > 0) {
        state.items.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  clearCart, 
  toggleCart, 
  setCartOpen 
} = cartSlice.actions;
export default cartSlice.reducer;