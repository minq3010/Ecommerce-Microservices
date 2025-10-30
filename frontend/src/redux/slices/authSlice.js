import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isVerified: false, // Track if token has been verified
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { user, token } = action.payload;
      console.log('📝 authSlice.login called');
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.isVerified = true; // Mark as verified on login
      state.error = null;
      // Only update localStorage after successful Redux update
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      localStorage.setItem('lastAction', 'login-' + new Date().toISOString());
      console.log('✅ authSlice: User logged in');
    },
    logout: (state) => {
      console.log('📝 authSlice.logout called - REASON:', new Error().stack);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isVerified = false; // Reset verification status
      state.error = null;
      localStorage.setItem('lastAction', 'logout-' + new Date().toISOString());
      console.log('✅ authSlice: User logged out');
    },
    setUser: (state, action) => {
      localStorage.setItem('user', JSON.stringify(action.payload));
      state.user = action.payload;
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
    verificationCompleted: (state) => {
      state.isVerified = true;
    },
  },
});

export const { login, logout, setUser, setLoading, setError, clearError, verificationCompleted } = authSlice.actions;

export default authSlice.reducer;
