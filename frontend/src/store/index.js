import { create } from 'zustand';

export const useCartStore = create((set) => ({
  cart: null,
  loading: false,
  
  setCart: (cart) => set({ cart }),
  setLoading: (loading) => set({ loading }),
  
  addItem: (item) => set((state) => {
    if (!state.cart) return state;
    const existingItem = state.cart.items.find(i => i.productId === item.productId);
    
    if (existingItem) {
      return {
        cart: {
          ...state.cart,
          items: state.cart.items.map(i =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        }
      };
    } else {
      return {
        cart: {
          ...state.cart,
          items: [...state.cart.items, item]
        }
      };
    }
  }),
  
  removeItem: (productId) => set((state) => {
    if (!state.cart) return state;
    return {
      cart: {
        ...state.cart,
        items: state.cart.items.filter(i => i.productId !== productId)
      }
    };
  }),
  
  clearCart: () => set({ cart: null }),
}));

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  
  setUser: (user) => set({ user }),
  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
}));
