// backend/src/utils/khalti.js
const axios = require('axios');

/**
 * Khalti API Configuration
 */
const KHALTI_CONFIG = {
  sandbox: {
    baseUrl: 'https://dev.khalti.com/api/v2/',
    secretKey: process.env.KHALTI_SANDBOX_SECRET_KEY || 'test_secret_key_1234567890'
  },
  production: {
    baseUrl: 'https://khalti.com/api/v2/',
    secretKey: process.env.KHALTI_LIVE_SECRET_KEY
  }
};

/**
 * Get Khalti configuration based on environment
 */
const getKhaltiConfig = () => {
  const env = process.env.KHALTI_ENVIRONMENT || 'sandbox';
  return KHALTI_CONFIG[env] || KHALTI_CONFIG.sandbox;
};

/**
 * Initialize Khalti Payment
 * @param {Object} paymentData - Payment details
 * @returns {Promise} - Khalti API response
 */
const initiateKhaltiPayment = async (paymentData) => {
  try {
    const config = getKhaltiConfig();
    
    const payload = {
      return_url: paymentData.return_url || process.env.KHALTI_RETURN_URL,
      website_url: paymentData.website_url || process.env.KHALTI_WEBSITE_URL,
      amount: Math.round(paymentData.amount), // Amount in paisa (1 NPR = 100 paisa)
      purchase_order_id: paymentData.purchase_order_id,
      purchase_order_name: paymentData.purchase_order_name || 'Order Payment',
      customer_info: {
        name: paymentData.customer_name || '',
        email: paymentData.customer_email || '',
        phone: paymentData.customer_phone || ''
      }
    };

    // Add amount breakdown if provided
    if (paymentData.amount_breakdown) {
      payload.amount_breakdown = paymentData.amount_breakdown;
    }

    // Add product details if provided
    if (paymentData.product_details) {
      payload.product_details = paymentData.product_details;
    }

    console.log('📤 Initiating Khalti payment with payload:', payload);

    const response = await axios.post(
      `${config.baseUrl}epayment/initiate/`,
      payload,
      {
        headers: {
          'Authorization': `Key ${config.secretKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Khalti payment initiated:', response.data);

    return {
      success: true,
      data: response.data
    };

  } catch (error) {
    console.error('❌ Khalti payment initiation error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
};

/**
 * Lookup Khalti Payment Status
 * @param {string} pidx - Payment identifier from Khalti
 * @returns {Promise} - Khalti API response
 */
const lookupKhaltiPayment = async (pidx) => {
  try {
    const config = getKhaltiConfig();

    const response = await axios.post(
      `${config.baseUrl}epayment/lookup/`,
      { pidx },
      {
        headers: {
          'Authorization': `Key ${config.secretKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Khalti lookup response:', response.data);

    return {
      success: true,
      data: response.data
    };

  } catch (error) {
    console.error('❌ Khalti lookup error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
};

module.exports = { initiateKhaltiPayment, lookupKhaltiPayment, getKhaltiConfig };