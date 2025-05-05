const express = require("express");
const subCatModel =  require("../models/subCatModel");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // code for pagination
    const page = parseInt(req.query.page) || 1;
    const perPage = req.query.perPage;
    const totalPosts = await subCatModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    let subCategoryList = [];

    if (page > totalPages) {
      return res.status(404).json({ message: "Page not found" });
    }

    if (req.query.page !== undefined && req.query.perPage !== undefined) {
      subCategoryList = await subCatModel
        .find()
        .populate("category")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();
    } else {
      subCategoryList = await subCatModel.find().populate("category");
    }

    if (!subCategoryList) {
      res.status(500).json({ success: false });
    }

    return res.status(200).json({
      subCategoryList: subCategoryList,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const subCategory = await subCatModel
      .findById(req.params.id)
      .populate("category");
    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: "Category With Given Id Is Not Found",
      });
    }

    return res.status(200).json(subCategory);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.post("/create", async (req, res) => {
  try {
    let subCategory = new subCatModel({
      category: req.body.category,
      subCat: req.body.subCat,
    });

    if (!subCategory) {
      return res
        .status(500)
        .json({ error: "Category creation failed", success: false });
    }

    subCategory = await subCategory.save();
    res.status(201).json({
      success: true,
      message: "Sub Category created successfully!",
      subCategory,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleteSubCategory = await subCatModel.findByIdAndDelete(
      req.params.id
    );

    if (!deleteSubCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Sub Category Not Found" });
    }

    return res
      .status(200)
      .send({ success: true, message: "Sub Category Deleted Successfully!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const subCategory = await subCatModel.findByIdAndUpdate(
      id,
      { category: req.body.category, subCat: req.body.subCat },
      { new: true }
    );

    if (!category) {
      return res
        .status(500)
        .json({ success: false, message: "Sub Category Not Updated!" });
    }

    res.status(200).json({
      success: true,
      message: "Sub Category updated successfully!",
      subCategory,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
