const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Admin routes
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.patch('/:id/stock', protect, admin, updateStock);

module.exports = router;