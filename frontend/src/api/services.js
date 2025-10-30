import apiClient from './client';

export const productAPI = {
  getAll: (page = 0, size = 10) => 
    apiClient.get('/products', { params: { page, size } }),
  
  getById: (id) => 
    apiClient.get(`/products/${id}`),
  
  search: (keyword, page = 0, size = 10) => 
    apiClient.get('/products/search', { params: { keyword, page, size } }),
  
  getByCategory: (category, page = 0, size = 10) => 
    apiClient.get(`/products/category/${category}`, { params: { page, size } }),
  
  checkStock: (id, quantity) => 
    apiClient.get(`/products/${id}/check-stock`, { params: { quantity } }),
  
  create: (data) => 
    apiClient.post('/products', data),
  
  update: (id, data) => 
    apiClient.put(`/products/${id}`, data),
  
  delete: (id) => 
    apiClient.delete(`/products/${id}`),
};

export const categoryAPI = {
  getAll: () => 
    apiClient.get('/categories'),
  
  getById: (id) => 
    apiClient.get(`/categories/${id}`),
  
  create: (data) => 
    apiClient.post('/categories', data),
  
  update: (id, data) => 
    apiClient.put(`/categories/${id}`, data),
  
  delete: (id) => 
    apiClient.delete(`/categories/${id}`),
};

export const cartAPI = {
  getCart: () => 
    apiClient.get('/cart'),
  
  addItem: (item) => 
    apiClient.post('/cart/items', item),
  
  updateItem: (productId, quantity) => 
    apiClient.put(`/cart/items/${productId}`, null, { params: { quantity } }),
  
  removeItem: (productId) => 
    apiClient.delete(`/cart/items/${productId}`),
  
  clearCart: () => 
    apiClient.delete('/cart'),
};

export const paymentAPI = {
  create: (data) => 
    apiClient.post('/payments', data),
  
  process: (id) => 
    apiClient.post(`/payments/${id}/process`),
  
  refund: (id) => 
    apiClient.post(`/payments/${id}/refund`),
  
  getById: (id) => 
    apiClient.get(`/payments/${id}`),
  
  getByOrderId: (orderId) => 
    apiClient.get(`/payments/order/${orderId}`),
  
  getUserPayments: () => 
    apiClient.get('/payments'),
};
