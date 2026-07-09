const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Subcategory = require('../models/SubCategory');
const { protect, admin } = require('../middleware/auth');
 
// =====================
// SUBCATEGORY ROUTES (must come BEFORE /:id routes)
// =====================
 
// @route   GET /api/categories/subcategories
// @access  Public
router.get('/subcategories', async (req, res) => {
  try {
    const subcategories = await Subcategory.find({ isActive: true })
      .populate('category', 'name')
      .sort({ name: 1 });
 
    res.json({ success: true, data: subcategories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
 
// @route   POST /api/categories/subcategories
// @access  Private/Admin
router.post('/subcategories', protect, admin, async (req, res) => {
  try {
    const { name, category, description } = req.body;
 
    if (!name || !String(name).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Subcategory name is required',
      });
    }
 
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Parent category is required',
      });
    }
 
    const parentCategory = await Category.findById(category);
    if (!parentCategory) {
      return res.status(400).json({
        success: false,
        message: 'Selected parent category was not found',
      });
    }
 
    const subcategory = await Subcategory.create({
      name: String(name).trim(),
      category,
      description,
    });
 
    const populatedSubcategory = await Subcategory.findById(subcategory._id).populate('category', 'name');
    res.status(201).json({ success: true, data: populatedSubcategory });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Subcategory name already exists',
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});
 
// @route   DELETE /api/categories/subcategories/:id
// @access  Private/Admin
router.delete('/subcategories/:id', protect, admin, async (req, res) => {
  try {
    const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: 'Subcategory not found',
      });
    }
    res.json({ success: true, message: 'Subcategory deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
 
// =====================
// CATEGORY ROUTES
// =====================
 
// @route   GET /api/categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
 
// @route   POST /api/categories
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, description, icon } = req.body;
 
    if (!name || !String(name).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required',
      });
    }
 
    const category = await Category.create({
      name: String(name).trim(),
      description,
      icon,
    });
 
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category name already exists',
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});
 
// @route   DELETE /api/categories/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }
 
    // Also delete all subcategories under this category
    await Subcategory.deleteMany({ category: req.params.id });
 
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
 
module.exports = router;