// backend/src/models/Order.js
const mongoose = require('mongoose');

// Tiny internal model used purely to hand out atomically-incrementing
// sequence numbers (one counter per day, keyed by _id like "order-260725").
// $inc via findOneAndUpdate is atomic at the database level, so two
// concurrent checkouts can never be handed the same number — and unlike
// counting existing Order documents, this never goes "backwards" if an
// order is later deleted. Defined inline here (not a separate file) since
// it only exists to support order ID generation below.
const Counter = mongoose.models.Counter || mongoose.model('Counter', new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
}));

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
      required: false
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
orderSchema.pre('validate', async function(next) {
  if (!this.orderId) {
    try {
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      const counterId = `order-${year}${month}${day}`;
      const counter = await Counter.findOneAndUpdate(
        { _id: counterId },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );

      this.orderId = `ORD-${year}${month}${day}-${String(counter.seq).padStart(4, '0')}`;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);