const authMiddleware = require('../middlewares/authMiddleware');
const wishmodel = require('../models/whishlistModel');
const express = require('express');

const router = express.Router();

router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const wishlist = await wishmodel.find({ userId });

    if (!wishlist || wishlist.length === 0) {
      return res.status(404).json({ success: false, message: "No wish Items Found for this User" });
    }

    return res.status(200).json({ success: true, wishlist });
  } catch (error) {
    console.error("Error fetching cart for user:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get('/:id', async (req, res) => {
  try {

    const wishItem = await wishmodel.findById(req.params.id);

    if (!wishItem) {
      return res.status(404).json({ success: false, message: "Cart Item Not Found By Given Id" });
    }

    return res.status(200).json(wishItem);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});


router.post('/add', authMiddleware, async (req, res) => {
  try {

    const wishItem = await wishmodel.find({ productId: req.body.productId, userId: req.body.userId });
    if (wishItem.length === 0) {
      let wishList = new wishmodel({
        title: req.body.title,
        image: req.body.image,
        price: req.body.price,
        productId: req.body.productId,
        userId: req.body.userId,
      });

      if (!wishList) {
        res.status(500).json({
          error: err,
          success: false,
        })
      }

      wishList = await wishList.save();

      res.status(201).json({ success: true, message: "Add To Cart successfully!", wishList });

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
    const wishItem = await wishmodel.findOne({ userId, productId });

    if (!wishItem) {
      return res.status(404).json({ success: false, message: "Product not found in cart" });
    }

    wishItem.quantity = quantity;
    await wishItem.save();

    res.status(200).json({ success: true, message: "Quantity updated successfully", wishItem });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const wishItem = await wishmodel.findById(req.params.id);
    if (!wishItem) {
      return res.status(404).json({ success: false, message: "Cart Item Not Found" });
    }

    const deletedCart = await wishmodel.findByIdAndDelete(req.params.id);

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
  const { userId, wishItemId } = req.body;
  try {
    // Correct: Use findOne to match both _id and userId
    const wishItem = await wishmodel.findOne({ _id: wishItemId, userId });

    if (!wishItem) {
      return res.status(404).json({ success: false, message: "Cart Item Not Found" });
    }

    if (wishItem.quantity > 1) {
      wishItem.quantity -= 1;
      await wishItem.save();
      return res.status(200).json({ success: true, message: "Quantity decreased successfully", wishItem });
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
    const wishItem = await wishmodel.findOneAndDelete({ userId, productId });

    if (!wishItem) {
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

    const wishList = await wishmodel.findByIdAndUpdate(req.params.id, {
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

    if (!wishList) {
      return res.status(500).json({ success: false, message: "Cart Item Not Updated!" });
    }

    res.status(200).json({ success: true, message: "Cart Item updated successfully!", wishList });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});



module.exports = router;