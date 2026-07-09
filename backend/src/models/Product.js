const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    index: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    index: true
  },
  subcategory: {
    type: String,
    required: [true, 'Subcategory is required'],
    index: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  stock: {
    type: Number,
    required: [true, 'Stock is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  img: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true,
    // More flexible validation - just check it's a valid URL
    validate: {
      validator: function(v) {
        // Allow any valid HTTPS URL
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Please enter a valid image URL'
    }
  },
  images: [{
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        // Allow any valid HTTPS URL
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Please enter a valid image URL'
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Text index for search
productSchema.index({ 
  name: 'text', 
  description: 'text',
  category: 'text',
  subcategory: 'text'
});

module.exports = mongoose.model('Product', productSchema);