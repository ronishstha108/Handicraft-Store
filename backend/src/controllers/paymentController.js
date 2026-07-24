// backend/src/controllers/paymentController.js
const Transaction = require('../models/Transaction');
const Order = require('../models/Order');
const { initiateKhaltiPayment, lookupKhaltiPayment } = require('../utils/khalti');
 
// ============================================
// KHALTI PAYMENT FUNCTIONS
// ============================================
 
/**
 * Initialize Khalti Payment
 * POST /api/payment/khalti/initiate
 */
const initializeKhaltiPayment = async (req, res) => {
  try {
    const { orderId, total_amount, customer_info } = req.body;
 
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
 
    // Generate unique purchase_order_id
    const purchase_order_id = `ORD_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
 
    // Create transaction record
    const transaction = await Transaction.create({
      orderId: order._id,
      transaction_uuid: purchase_order_id,
      amount: total_amount,
      status: 'INITIATED',
      paymentMethod: 'Khalti',
      pidx: null
    });
 
    // Prepare Khalti payment payload
    const khaltiPayload = {
      amount: Math.round(total_amount * 100), // Convert to paisa
      purchase_order_id: purchase_order_id,
      purchase_order_name: `Order #${orderId}`,
      return_url: process.env.KHALTI_RETURN_URL || `${process.env.FRONTEND_URL}/payment-khalti-callback`,
      website_url: process.env.KHALTI_WEBSITE_URL || process.env.FRONTEND_URL,
      customer_name: customer_info?.name || order.customer?.first_name + ' ' + order.customer?.last_name,
      customer_email: customer_info?.email || order.customer?.email,
      customer_phone: customer_info?.phone || order.customer?.phone
    };
 
    // Initiate Khalti payment
    const khaltiResponse = await initiateKhaltiPayment(khaltiPayload);
 
    if (!khaltiResponse.success) {
      transaction.status = 'FAILED';
      await transaction.save();
 
      return res.status(400).json({
        success: false,
        message: khaltiResponse.error?.detail || 'Khalti payment initiation failed'
      });
    }
 
    // Update transaction with pidx
    transaction.pidx = khaltiResponse.data.pidx;
    transaction.expiresAt = new Date(khaltiResponse.data.expires_at);
    await transaction.save();
 
    res.json({
      success: true,
      data: {
        transaction,
        payment_url: khaltiResponse.data.payment_url,
        pidx: khaltiResponse.data.pidx,
        method: 'khalti'
      }
    });
 
  } catch (error) {
    console.error('Khalti payment initialization error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
 
/**
 * Khalti Payment Callback Handler
 * GET /api/payment/khalti/callback
 */
const khaltiCallback = async (req, res) => {
  try {
    const { pidx, status, transaction_id, amount, mobile, purchase_order_id } = req.query;
 
    console.log('📥 Khalti callback received:', { pidx, status, transaction_id, amount, purchase_order_id });
 
    // Find transaction by pidx
    const transaction = await Transaction.findOne({ pidx });
 
    if (!transaction) {
      console.error('❌ Transaction not found for pidx:', pidx);
      return res.redirect(`${process.env.KHALTI_FAILURE_URL}?error=Transaction not found`);
    }
 
    // If status is Completed, lookup to verify
    if (status === 'Completed') {
      // Lookup payment status
      const lookupResponse = await lookupKhaltiPayment(pidx);
 
      if (!lookupResponse.success) {
        console.error('❌ Khalti lookup failed:', lookupResponse.error);
        transaction.status = 'FAILED';
        await transaction.save();
        return res.redirect(`${process.env.KHALTI_FAILURE_URL}?error=Payment verification failed`);
      }
 
      const lookupData = lookupResponse.data;
 
      // Verify payment status
      if (lookupData.status === 'Completed') {
        // Update transaction
        transaction.status = 'COMPLETE';
        transaction.transaction_code = lookupData.transaction_id || transaction_id;
        transaction.paymentData = lookupData;
        transaction.completedAt = new Date();
        await transaction.save();
 
        // Update order
        await Order.findByIdAndUpdate(transaction.orderId, {
          paymentMethod: 'Khalti',
          paymentStatus: 'Paid',
          status: 'Processing'
        });
 
        // Redirect to success
        return res.redirect(`${process.env.KHALTI_SUCCESS_URL}?orderId=${transaction.orderId}&status=success&transactionId=${lookupData.transaction_id || transaction_id}&pidx=${pidx}`);
      } else {
        // Payment not completed
        transaction.status = lookupData.status === 'Pending' ? 'PENDING' : 'FAILED';
        transaction.paymentData = lookupData;
        await transaction.save();
 
        return res.redirect(`${process.env.KHALTI_FAILURE_URL}?error=Payment ${lookupData.status}`);
      }
    } else {
      // Payment was cancelled or failed
      transaction.status = status === 'User canceled' ? 'USER_CANCELED' : 'FAILED';
      transaction.paymentData = req.query;
      await transaction.save();
 
      return res.redirect(`${process.env.KHALTI_FAILURE_URL}?error=${status || 'Payment failed'}`);
    }
 
  } catch (error) {
    console.error('❌ Khalti callback error:', error);
    res.redirect(`${process.env.KHALTI_FAILURE_URL}?error=Payment processing error`);
  }
};
 
/**
 * Khalti Payment Status Lookup
 * GET /api/payment/khalti/lookup/:pidx
 */
const khaltiLookup = async (req, res) => {
  try {
    const { pidx } = req.params;
 
    const lookupResponse = await lookupKhaltiPayment(pidx);
 
    if (!lookupResponse.success) {
      return res.status(400).json({
        success: false,
        message: lookupResponse.error
      });
    }
 
    // Update transaction status
    const transaction = await Transaction.findOne({ pidx });
    if (transaction) {
      transaction.status = lookupResponse.data.status === 'Completed' ? 'COMPLETE' :
                           lookupResponse.data.status === 'Pending' ? 'PENDING' : 'FAILED';
      transaction.paymentData = lookupResponse.data;
      await transaction.save();
    }
 
    res.json({
      success: true,
      data: lookupResponse.data
    });
 
  } catch (error) {
    console.error('Khalti lookup error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
 
/**
 * Get Transaction Status
 * GET /api/payment/status/:transactionId
 */
const getTransactionStatus = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      $or: [
        { transaction_uuid: req.params.transactionId },
        { pidx: req.params.transactionId }
      ]
    }).populate('orderId');
 
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }
 
    res.json({
      success: true,
      data: {
        status: transaction.status,
        amount: transaction.amount,
        orderId: transaction.orderId?._id,
        transactionCode: transaction.transaction_code,
        paymentMethod: transaction.paymentMethod,
        pidx: transaction.pidx
      }
    });
 
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
 
module.exports = {
  initializeKhaltiPayment,
  khaltiCallback,
  khaltiLookup,
  getTransactionStatus
};