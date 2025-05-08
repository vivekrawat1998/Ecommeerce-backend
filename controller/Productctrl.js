const productModel = require('../models/productModel');
const categoryModel = require('../models/categoryModel');
const recentlyViewedProductModel = require('../models/recentlyViewedProductModel');
const mongoose = require('mongoose');

const getAllProducts = async (req, res) => {
    try {
        const {
            page = 1,
            perPage = 10,
            minPrice,
            maxPrice,
            q: searchQuery,
            category,
            sortBy = 'dateCreated',
            sortOrder = 'desc'
        } = req.query;

        const query = {};
        const sort = {};
        // Search functionality
        if (searchQuery) {
            query.$text = { $search: searchQuery };
        }

        // Price filtering
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        // Category filtering
        if (category) {
            query.category = mongoose.Types.ObjectId(category);
        }

        // Sorting
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const totalProducts = await productModel.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / perPage);

        const products = await productModel.find(query)
            .populate('category')
            .sort(sort)
            .skip((page - 1) * perPage)
            .limit(parseInt(perPage));

        res.status(200).json({
            success: true,
            products,
            totalProducts,
            totalPages,
            currentPage: parseInt(page)
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getFeaturedProducts = async (req, res) => {
    try {
        const products = await productModel.find({ isFeatured: true });
        res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id)
            .populate('category');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const createProduct = async (req, res) => {
    try {
        const category = await categoryModel.findById(req.body.category);
        if (!category) {
            return res.status(400).json({
                success: false,
                message: "Invalid category ID"
            });
        }

        const product = await productModel.insertMany(req.body);
        res.status(201).json({
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const product = await productModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await productModel.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getProductsCount = async (req, res) => {
    try {
        const count = await productModel.countDocuments();
        res.status(200).json({
            success: true,
            count
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const searchProducts = async (req, res) => {
    try {
        const searchQuery = req.query.q || '';
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 10;

        const products = await productModel.find(
            { $text: { $search: searchQuery } },
            { score: { $meta: "textScore" } }
        )
            .sort({ score: { $meta: "textScore" } })
            .populate('category')
            .skip((page - 1) * perPage)
            .limit(perPage);

        const totalResults = await productModel.countDocuments(
            { $text: { $search: searchQuery } }
        );

        res.status(200).json({
            success: true,
            products,
            totalResults,
            totalPages: Math.ceil(totalResults / perPage),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getRecentlyViewedProducts = async (req, res) => {
    try {
        const products = await recentlyViewedProductModel.find(req.query)
            .populate('category');

        res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const createRecentlyViewedProduct = async (req, res) => {
    try {
        let existingProduct = await recentlyViewedProductModel.findOne({
            prodId: req.body.prodId
        });

        if (!existingProduct) {
            const product = new recentlyViewedProductModel({
                prodId: req.body.prodId,
                name: req.body.name,
                subCat: req.body.subCat,
                description: req.body.description,
                images: req.body.images,
                brand: req.body.brand,
                price: req.body.price,
                oldPrice: req.body.oldPrice,
                catName: req.body.catName,
                subCatId: req.body.subCatId,
                category: req.body.category,
                countInStock: req.body.countInStock,
                rating: req.body.rating,
                isFeatured: req.body.isFeatured,
                discount: req.body.discount,
                productRam: req.body.productRam,
                productSize: req.body.productSize,
                productWeight: req.body.productWeight,
            });

            await product.save();
        }

        res.status(201).json({
            success: true,
            message: "Recently viewed product processed"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
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
};
