import api from './api';

export const orderService = {
  createOrder: (data) =>
    api.post('/orders', data),

  getOrder: (id) =>
    api.get(`/orders/${id}`),

  getUserOrders: (page = 0, size = 10) =>
    api.get(`/orders?page=${page}&size=${size}`),

  getAllOrders: (page = 0, size = 10) =>
    api.get(`/orders/admin/all?page=${page}&size=${size}`),

  getOrdersByStatus: (status) =>
    api.get(`/orders/admin/status/${status}`),

  updateOrderStatus: (id, status) =>
    api.put(`/orders/${id}`, { status }),

  cancelOrder: (id) =>
    api.put(`/orders/${id}/cancel`, {}),
};
