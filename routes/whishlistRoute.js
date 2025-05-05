const express = require("express");
const whishlistModel = require("../models/whishlistModel");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const myList = await whishlistModel.find(req.query);

    if (!myList) {
      return res
        .status(404)
        .json({ success: false, message: "Wishlist Item Not Found" });
    }

    return res.status(200).json(myList);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const myListitem = await whishlistModel.findById(req.params.id);

    if (!myListitem) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Wishlist Item Not Found By Given Id",
        });
    }

    return res.status(200).json(myListitem);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.post("/add", async (req, res) => {
  try {
    const mylistItem = await whishlistModel.find({
      productId: req.body.productId,
      userId: req.body.userId,
    });
    if (mylistItem.length === 0) {
      let myList = new whishlistModel({
        productTitle: req.body.productTitle,
        image: req.body.image,
        rating: req.body.rating,
        price: req.body.price,
        productId: req.body.productId,
        userId: req.body.userId,
      });

      if (!myList) {
        res.status(500).json({
          error: err,
          success: false,
        });
      }

      myList = await myList.save();

      res
        .status(201)
        .json({
          success: true,
          message: "Add To Wishlist successfully!",
          myList,
        });
    } else {
      res.status(401).json({
        status: false,
        msg: "Product Already In Wishlist!",
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const mylistItem = await whishlistModel.findById(req.params.id);
    if (!mylistItem) {
      return res
        .status(404)
        .json({ success: false, message: "Wishlist Item Not Found" });
    }

    const deletedWishlist = await whishlistModel.findByIdAndDelete(
      req.params.id
    );

    if (!deletedWishlist) {
      res.status(404).json({
        message: "Wishlist Item Not Deleted!",
        success: false,
      });
    }

    return res
      .status(200)
      .send({ success: true, message: "Wishlist Item Removed" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
