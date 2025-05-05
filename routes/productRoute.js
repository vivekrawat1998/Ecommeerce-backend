const express = require('express');
const router = express.Router();
const {
    getAllProducts,
    getFeaturedProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsCount,
    searchProducts,
    getRecentlyViewedProducts,
    createRecentlyViewedProduct
} = require('../controller/Productctrl');

router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProductById);
router.post('/create', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.get('/get/count', getProductsCount);
// Recently Viewed Products
router.get('/recentlyViewed', getRecentlyViewedProducts);
router.post('/recentlyViewed', createRecentlyViewedProduct);

module.exports = router;
