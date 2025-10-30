import { useSelector, useDispatch } from 'react-redux';

// Auth Hooks
export const useAuth = () => {
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();
  return { auth, dispatch };
};

// Product Hooks
export const useProducts = () => {
  const products = useSelector(state => state.product);
  const dispatch = useDispatch();
  return { products, dispatch };
};

// Cart Hooks
export const useCart = () => {
  const cart = useSelector(state => state.cart);
  const dispatch = useDispatch();
  return { cart, dispatch };
};

// Order Hooks
export const useOrders = () => {
  const orders = useSelector(state => state.order);
  const dispatch = useDispatch();
  return { orders, dispatch };
};

// User Hooks
export const useUsers = () => {
  const users = useSelector(state => state.user);
  const dispatch = useDispatch();
  return { users, dispatch };
};
