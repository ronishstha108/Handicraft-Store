const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  description: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Subcategory', subcategorySchema);