// backend/src/models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  transaction_uuid: {
    type: String,
    required: true,
    unique: true
  },
  transaction_code: {
    type: String,
    unique: true,
    sparse: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETE', 'FAILED', 'REFUNDED', 'INITIATED', 'EXPIRED', 'USER_CANCELED'],
    default: 'PENDING'
  },
  paymentMethod: {
    type: String,
    enum: ['Khalti'],
    default: 'Khalti'
  },
  paymentData: {
    type: Object,
    default: {}
  },
  pidx: {
    type: String,
    unique: true,
    sparse: true
  },
  verifiedAt: Date,
  completedAt: Date,
  expiresAt: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
