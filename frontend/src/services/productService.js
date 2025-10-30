import api from './api';

export const productService = {
  getAllProducts: (page = 0, size = 10) =>
    api.get(`/products?page=${page}&size=${size}`),

  getProductById: (id) =>
    api.get(`/products/${id}`),

  searchProducts: (name, page = 0, size = 10) =>
    api.get(`/products/search?name=${name}&page=${page}&size=${size}`),

  getProductsByCategory: (category, page = 0, size = 10) =>
    api.get(`/products/category/${category}?page=${page}&size=${size}`),

  createProduct: (data) =>
    api.post('/products', data),

  updateProduct: (id, data) =>
    api.put(`/products/${id}`, data),

  deleteProduct: (id) =>
    api.delete(`/products/${id}`),

  deactivateProduct: (id) =>
    api.patch(`/products/${id}/deactivate`),
};
