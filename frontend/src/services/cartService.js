import api from './api';

export const cartService = {
  getCart: () =>
    api.get('/carts'),

  addItem: (data) =>
    api.post('/carts/items', data),

  removeItem: (productId) =>
    api.delete(`/carts/items/${productId}`),

  updateItemQuantity: (productId, quantity) =>
    api.put(`/carts/items/${productId}?quantity=${quantity}`),

  clearCart: () =>
    api.delete('/carts'),
};
