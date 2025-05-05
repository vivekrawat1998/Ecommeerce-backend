const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  getCategoryCount,
  getSubcategoryCount,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryProducts,
  getProductsWithSubcategories,
  getProductsByCategorySlug
} = require('../controller/CategoryCtrl');

// Category Routes
router.get('/', getAllCategories);
router.get('/get/count', getCategoryCount);
router.get('/subCat/get/count', getSubcategoryCount);
router.get('/:id', getCategoryById);
router.post('/create', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

// Product Routes
router.get('/:categoryId/products', getCategoryProducts);
router.get('/slug/:slug/products', getProductsByCategorySlug);
router.get('/:categoryId/products-with-subcategories', getProductsWithSubcategories);

module.exports = router;
