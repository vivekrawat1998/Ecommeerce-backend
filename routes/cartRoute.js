const authMiddleware = require('../middlewares/authMiddleware');
const cartModel = require('../models/cartModel');
const express = require('express');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
    try {

        const cartList = await cartModel.find(req.query);

        if (!cartList) {
            return res.status(404).json({ success: false, message: "Cart Item Not Found" });
        }

        return res.status(200).json(cartList);
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error" });
    }
});

router.get('/:id', async (req, res) => {
    try {

        const cartItem = await cartModel.findById(req.params.id);

        if (!cartItem) {
            return res.status(404).json({ success: false, message: "Cart Item Not Found By Given Id" });
        }

        return res.status(200).json(cartItem);
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error" });
    }
});


router.post('/add', authMiddleware, async (req, res) => {
    try {

        const cartItem = await cartModel.find({ productId: req.body.productId, userId: req.body.userId });
        if (cartItem.length === 0) {
            let cartList = new cartModel({
                productTitle: req.body.productTitle,
                image: req.body.image,
                price: req.body.price,
                quantity: req.body.quantity,
                productId: req.body.productId,
                userId: req.body.userId,
            });

            if (!cartList) {
                res.status(500).json({
                    error: err,
                    success: false,
                })
            }

            cartList = await cartList.save();

            res.status(201).json({ success: true, message: "Add To Cart successfully!", cartList });

        } else {
            res.status(401).json({
                status: false,
                msg: "Product Already In Cart!"
            })
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error" });
    }
});


router.post('/increaseQuantity', authMiddleware, async (req, res) => {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || typeof quantity !== 'number') {
        return res.status(400).json({ success: false, message: "Invalid input data" });
    }

    try {
        const cartItem = await cartModel.findOne({ userId, productId });

        if (!cartItem) {
            return res.status(404).json({ success: false, message: "Product not found in cart" });
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        res.status(200).json({ success: true, message: "Quantity updated successfully", cartItem });
    } catch (error) {
        console.error("Error updating cart item:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const cartItem = await cartModel.findById(req.params.id);
        if (!cartItem) {
            return res.status(404).json({ success: false, message: "Cart Item Not Found" });
        }

        const deletedCart = await cartModel.findByIdAndDelete(req.params.id);

        if (!deletedCart) {
            res.status(404).json({
                message: "Cart Item Not Deleted!",
                success: false
            })
        };

        return res.status(200).send({ success: true, message: "Cart Item Removed" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error" });
    }
});

router.post('/decreaseQuantity', authMiddleware, async (req, res) => {
    const { userId, cartItemId } = req.body;




    try {
        // Correct: Use findOne to match both _id and userId
        const cartItem = await cartModel.findOne({ _id: cartItemId, userId });

        if (!cartItem) {
            return res.status(404).json({ success: false, message: "Cart Item Not Found" });
        }

        if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;
            await cartItem.save();
            return res.status(200).json({ success: true, message: "Quantity decreased successfully", cartItem });
        } else {
            return res.status(400).json({ success: false, message: "Quantity cannot be less than 1" });
        }
    } catch (error) {
        console.error("❌ Server Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
});


router.post('/remove', authMiddleware, async (req, res) => {

    const { userId, productId } = req.body;

    if (!userId || !productId) {
        return res.status(400).json({ success: false, message: "User ID and Product ID are required" });
    }

    try {
        const cartItem = await cartModel.findOneAndDelete({ userId, productId });

        if (!cartItem) {
            return res.status(404).json({ success: false, message: "Cart item not found" });
        }

        return res.status(200).json({ success: true, message: "Cart item removed successfully" });
    } catch (error) {
        console.error("❌ Error removing cart item:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
});



router.put('/:id', async (req, res) => {
    try {

        const cartList = await cartModel.findByIdAndUpdate(req.params.id, {
            productTitle: req.body.productTitle,
            image: req.body.image,
            rating: req.body.rating,
            price: req.body.price,
            quantity: req.body.quantity,
            subTotal: req.body.subTotal,
            productId: req.body.productId,
            userId: req.body.userId,
            size: req.body.size,
            color: req.body.color,
        }, { new: true });

        if (!cartList) {
            return res.status(500).json({ success: false, message: "Cart Item Not Updated!" });
        }

        res.status(200).json({ success: true, message: "Cart Item updated successfully!", cartList });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error" });
    }
});



module.exports = router;