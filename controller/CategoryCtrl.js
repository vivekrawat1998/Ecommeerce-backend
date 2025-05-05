const Category = require('../models/categoryModel');
const Product = require('../models/productModel');
const mongoose = require('mongoose');

// Helper: Generate Unique Slug
const generateSlug = async (name) => {
  let slug = require('slugify')(name, { lower: true, strict: true });
  let counter = 1;
  while (await Category.findOne({ slug })) {
    slug = `${slug}-${counter++}`;
  }
  return slug;
};

// Helper: Build Category Tree
const buildCategoryTree = (categories, parentId = null) => {
  return categories
    .filter(cat => String(cat.parentId) === String(parentId))
    .map(cat => ({
      ...cat.toObject(),
      children: buildCategoryTree(categories, cat._id)
    }));
};

// Get All Categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(buildCategoryTree(categories));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Category Count
exports.getCategoryCount = async (req, res) => {
  try {
    const count = await Category.countDocuments({ parentId: undefined });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Subcategory Count
exports.getSubcategoryCount = async (req, res) => {
  try {
    const count = await Category.countDocuments({ parentId: { $ne: undefined } });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Single Category
exports.getCategoryById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Category
exports.createCategory = async (req, res) => {
  try {
    const { name, parentId } = req.body;
    const slug = await generateSlug(name);
    const category = await Category.create({ ...req.body, slug });
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update Category
exports.updateCategory = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.status(200).json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Category Products
exports.getCategoryProducts = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const products = await Product.find({ category: categoryId });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Products with Subcategories
exports.getProductsWithSubcategories = async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    const getAllChildIds = async (parentId) => {
      const children = await Category.find({ parentId });
      let ids = [parentId];
      for (const child of children) {
        ids = ids.concat(await getAllChildIds(child._id));
      }
      return ids;
    };

    const categoryIds = await getAllChildIds(categoryId);
    const products = await Product.find({ category: { $in: categoryIds } });
    
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Add this new controller method
exports.getProductsByCategorySlug = async (req, res) => {
    try {
      const category = await Category.findOne({ slug: req.params.slug });
      if (!category) {
        return res.status(404).json({ 
          success: false,
          error: 'Category not found' 
        });
      }
  
      const products = await Product.find({ category: category._id });
      
      res.status(200).json({
        success: true,
        products
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  };
  