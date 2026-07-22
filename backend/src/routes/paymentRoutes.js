// backend/src/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const {
  initializeKhaltiPayment,
  khaltiCallback,
  khaltiLookup,
  getTransactionStatus
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

// ============================================
// Khalti Routes
// ============================================
router.post('/khalti/initiate', protect, initializeKhaltiPayment);
router.get('/khalti/callback', khaltiCallback);
router.get('/khalti/lookup/:pidx', protect, khaltiLookup);

// ============================================
// Common Routes
// ============================================
router.get('/status/:transactionId', protect, getTransactionStatus);

module.exports = router;
