const path = require("path");
const fs = require("fs");
const asyncHandler = require("express-async-handler");
const {cloudinaryUploadImg, cloudinaryDeleteImg} = require('../utils/cloudinary')

// upload product images
const uploadImages = asyncHandler(async (req, res) => {
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      urls.push(newpath);
      fs.unlinkSync(path);
    }
    const images = urls.map((file) => {
      return file;
    });
    res.json(images);
  } catch (error) {
    throw new Error(error);
  }
});

// delete product images
const deleteImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = cloudinaryDeleteImg(id, "images");
    res.json({
      message: "Deleted",
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { uploadImages, deleteImages };
