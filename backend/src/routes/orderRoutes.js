// backend/src/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getMyOrders,
  getOrder,
  updateOrderStatus,
  deleteOrder,
  cancelOrder // Add this
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

// Protected routes (user) - must be logged in
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrder);
router.patch('/:id/cancel', protect, cancelOrder); // Add cancel route

// Admin routes
router.get('/', protect, admin, getOrders);
router.patch('/:id/status', protect, admin, updateOrderStatus);
router.delete('/:id', protect, admin, deleteOrder);

module.exports = router;