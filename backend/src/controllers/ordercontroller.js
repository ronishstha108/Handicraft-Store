// backend/src/controllers/orderController.js
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// Generate Order ID helper function
const generateOrderId = async () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const count = await Order.countDocuments() + 1;
  return `ORD-${year}${month}${day}-${String(count).padStart(4, '0')}`;
};

// @desc    Create order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    console.log("📦 Creating order for user:", req.user.id);
    
    const orderData = req.body;
    orderData.user = req.user.id;
    
    // Generate order ID
    orderData.orderId = await generateOrderId();
    
    console.log("📦 Order data with ID:", orderData);

    // Validate products and update stock
    for (const item of orderData.items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.name} not found`
        });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
        });
      }
      
      // Update stock
      product.stock -= item.quantity;
      await product.save();
      
      // Update product name and price from database (ensure consistency)
      item.name = product.name;
      item.price = product.price;
      item.img = product.img;
    }

    // Create order
    const order = await Order.create(orderData);
    console.log("✅ Order created successfully:", order.orderId);

    // Update user stats
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { 
        totalOrders: 1,
        totalSpent: orderData.total
      }
    });

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('❌ Create order error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Cancel order (by customer)
// @route   PATCH /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;
    
    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order
    if (order.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this order'
      });
    }

    // Check if order can be cancelled (only Processing or Shipped)
    if (order.status === 'Delivered') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a delivered order'
      });
    }

    if (order.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Order is already cancelled'
      });
    }

    // Update order status to Cancelled
    order.status = 'Cancelled';
    order.cancelledAt = new Date();
    await order.save();

    // Restore stock for all items
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    // Update user stats (reduce total orders and spent)
    await User.findByIdAndUpdate(userId, {
      $inc: { 
        totalOrders: -1,
        totalSpent: -order.total
      }
    });

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    console.error('❌ Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const filter = {};
    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const orders = await Order.find(filter)
      .populate('user', 'first_name last_name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'first_name last_name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order or is admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update order status (admin)
// @route   PATCH /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update status
    order.status = status;
    if (status === 'Delivered') {
      order.deliveredAt = new Date();
    }
    if (status === 'Cancelled') {
      order.cancelledAt = new Date();
      // Restore stock if cancelled
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity }
        });
      }
    }

    await order.save();

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Restore stock if order is not delivered
    if (order.status !== 'Delivered') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity }
        });
      }
    }

    await order.deleteOne();

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getMyOrders,
  getOrder,
  updateOrderStatus,
  deleteOrder,
  cancelOrder // Export cancelOrder
};