

const bannerModel = require("../models/bannerModel");
const express = require('express');
const imageModel = require('../models/imageModel');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const multer = require('multer')
const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

let imagesArr = [];
let slideEditId;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|webp|png|gif|mp4|mov|avi|pdf/;
  const extname = filetypes.test(file.originalname.toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(
      new Error(
        "Error: File upload only supports the following filetypes - " +
          filetypes
      )
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

router.post("/upload", upload.array("files"), async (req, res) => {
  imagesArr = [];

  try {
    for (let i = 0; i < req?.files?.length; i++) {
      const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: false,
      };

      const img = await cloudinary.uploader.upload(
        req.file[i].path,
        options,
        function (error, result) {
          imagesArr.push(result.secure_url);
          fs.unlinkSync(`uploads/${req.files[i].filename}`);
        }
      );
    }

    let imagesUploaded = new imageModel({ images: imagesArr });
    imagesUploaded = await imagesUploaded.save();

    return res.status(200).json(imagesArr);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    // Pagination

    const bannerImagesList = await bannerModel.find();

    if (!bannerImagesList) {
      return res
        .status(404)
        .json({ success: false, message: "Images Not Found" });
    }

    return res.status(200).json(bannerImagesList);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  slideEditId = req.params.id;
  try {
    const bannerImage = await bannerModel.findById(req.params.id);
    if (!bannerImage) {
      return res
        .status(404)
        .json({ success: false, message: "Banner Image Not Found" });
    }

    return res.status(200).json(bannerImage);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.post("/create", async (req, res) => {
  try {
    const newEntry = bannerModel.create(req.body);

    if (!newEntry) {
      return res
        .status(500)
        .json({ success: false, message: "Invalid Credentials" });
    }

    res.status(201).json({
      success: true,
      message: "Banner created successfully!",
      newEntry,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {

    const deletedImg = await bannerModel.findByIdAndDelete(req.params.id);
    if (!deletedImg) {
      res.status(404).json({
        message: "Image Not Found!",
        success: false,
      });
    }

    return res.status(200).send({ success: true, message: "Image Deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updateImage = await bannerModel.findByIdAndUpdate(
      req.params.id,
      {
        images: req.body.images,
      },
      { new: true }
    );

    if (!updateImage) {
      return res
        .status(500)
        .json({ success: false, message: "Image Not Updated!" });
    }

    res.status(200).json({
      success: true,
      message: "Image updated successfully!",
      updateImage,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});


module.exports = router;