// frontend/src/services/paymentService.js
import apiClient from '../api/client';

export const paymentService = {
  // ============================================
  // Khalti Payment
  // ============================================

  initializeKhaltiPayment: async (orderId, totalAmount, customerInfo) => {
    try {
      const response = await apiClient.post('/payment/khalti/initiate', {
        orderId,
        total_amount: totalAmount,
        customer_info: customerInfo
      });
      return response.data;
    } catch (error) {
      console.error('Khalti payment initialization error:', error);
      throw error;
    }
  },

  redirectToKhalti: (paymentUrl) => {
    window.location.href = paymentUrl;
  },

  // ============================================
  // Common Functions
  // ============================================

  getTransactionStatus: async (transactionId) => {
    const response = await apiClient.get(`/payment/status/${transactionId}`);
    return response.data;
  },

  lookupKhaltiPayment: async (pidx) => {
    const response = await apiClient.get(`/payment/khalti/lookup/${pidx}`);
    return response.data;
  }
};
