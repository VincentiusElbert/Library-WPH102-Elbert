import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  searchQuery: string;
  selectedCategory: string;
  isSearchOpen: boolean;
  currentPage: number;
}

const initialState: UiState = {
  searchQuery: '',
  selectedCategory: '',
  isSearchOpen: false,
  currentPage: 1,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setSearchOpen: (state, action: PayloadAction<boolean>) => {
      state.isSearchOpen = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    resetFilters: (state) => {
      state.searchQuery = '';
      state.selectedCategory = '';
      state.currentPage = 1;
    },
  },
});

export const { 
  setSearchQuery, 
  setSelectedCategory, 
  setSearchOpen, 
  setCurrentPage, 
  resetFilters 
} = uiSlice.actions;
export default uiSlice.reducer;