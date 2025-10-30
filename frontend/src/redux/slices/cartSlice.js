import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: null,
  items: [],
  loading: false,
  error: null,
  totalPrice: 0,
  totalQuantity: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.cart = action.payload;
      state.error = null;
    },
    setItems: (state, action) => {
      state.items = action.payload;
      // Calculate total price and quantity
      state.totalPrice = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
    },
    addItemToCart: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity || 1;
      } else {
        state.items.push({ ...action.payload, quantity: action.payload.quantity || 1 });
      }
      state.totalPrice = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
    },
    removeItemFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.totalPrice = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
    },
    updateCartItem: (state, action) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
      state.totalPrice = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.cart = null;
      state.totalPrice = 0;
      state.totalQuantity = 0;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setCart,
  setItems,
  addItemToCart,
  removeItemFromCart,
  updateCartItem,
  clearCart,
  setLoading,
  setError,
  clearError,
} = cartSlice.actions;

export default cartSlice.reducer;
