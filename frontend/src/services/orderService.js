// frontend/src/services/orderService.js
import apiClient from '../api/client';

export const orderService = {
  // Create order
  createOrder: async (orderData) => {
    try {
      console.log("📦 Creating order with data:", orderData);
      const response = await apiClient.post('/orders', orderData);
      console.log("📡 Order created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating order:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
      throw error;
    }
  },

  // Cancel order (customer)
  cancelOrder: async (orderId) => {
    try {
      console.log("❌ Cancelling order:", orderId);
      const response = await apiClient.patch(`/orders/${orderId}/cancel`);
      console.log("📡 Order cancelled:", response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error cancelling order:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get all orders (admin)
  getOrders: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await apiClient.get(`/orders?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      const savedOrders = localStorage.getItem("orderHistory");
      return { data: savedOrders ? JSON.parse(savedOrders) : [] };
    }
  },

  // Get my orders (user)
  getMyOrders: async () => {
    try {
      const response = await apiClient.get('/orders/my-orders');
      return response.data;
    } catch (error) {
      console.error('Error fetching my orders:', error);
      const savedOrders = localStorage.getItem("orderHistory");
      return { data: savedOrders ? JSON.parse(savedOrders) : [] };
    }
  },

  // Get single order
  getOrder: async (id) => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  // Update order status (admin)
  updateOrderStatus: async (id, status) => {
    const response = await apiClient.patch(`/orders/${id}/status`, { status });
    return response.data;
  },

  // Delete order (admin)
  deleteOrder: async (id) => {
    const response = await apiClient.delete(`/orders/${id}`);
    return response.data;
  }
};