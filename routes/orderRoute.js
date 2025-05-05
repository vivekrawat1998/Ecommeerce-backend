const express = require('express');
const orderModel = require('../models/orderModel');

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const perPage = 6;
    const totalPosts = await orderModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return res.status(404).json({ message: "Page not found" });
    }

    const orderList = await orderModel
      .find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!orderList) {
      return res
        .status(404)
        .json({ success: false, message: "Orders Not Found" });
    }

    return res.status(200).json({
      orderList: orderList,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order Not Found" });
    }

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.post("/create", async (req, res) => {
  try {
    let order = new orderModel({
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      pincode: req.body.pincode,
      amount: req.body.amount,
      paymentId: req.body.paymentId,
      email: req.body.email,
      userId: req.body.userId,
      products: req.body.products,
    });

    if (!order) {
      res.status(500).json({
        error: err,
        success: false,
      });
    }

    order = await orderModel.save();

    res.status(201).json(order);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order Not Found" });
    }

    const deletedOrder = await orderModel.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      res.status(404).json({
        message: "Order Not Found!",
        success: false,
      });
    }

    return res.status(200).send({ success: true, message: "Order Deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const order = await orderModel.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        pincode: req.body.pincode,
        amount: req.body.amount,
        paymentId: req.body.paymentId,
        email: req.body.email,
        userId: req.body.userId,
        products: req.body.products,
        status: req.body.status,
      },
      { new: true }
    );

    if (!order) {
      return res
        .status(500)
        .json({ success: false, message: "Order Status Not Updated!" });
    }

    res.status(200).json({
      success: true,
      message: "Order Status updated successfully!",
      order,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
