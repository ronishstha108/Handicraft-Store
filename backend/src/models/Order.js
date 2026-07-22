// backend/src/models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customer: {
    first_name: {
      type: String,
      required: true
    },
    last_name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    }
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,
    price: Number,
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    img: String
  }],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  deliveryCharge: {
    type: Number,
    default: 150,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  itemCount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['Pending', 'Khalti', 'Cash on Delivery'],
    default: 'Pending'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  notes: String,
  orderDate: {
    type: Date,
    default: Date.now
  },
  deliveredAt: Date,
  cancelledAt: Date
}, {
  timestamps: true
});

// Generate order ID before saving (fallback)
orderSchema.pre('save', async function(next) {
  if (!this.orderId) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const count = await this.constructor.countDocuments() + 1;
    this.orderId = `ORD-${year}${month}${day}-${String(count).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);