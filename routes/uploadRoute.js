const express = require("express");
const router = express.Router();
const {
  uploadPhoto,
  clientImgResize,
} = require("../middlewares/uploadImages");
const { uploadImages, deleteImages } = require("../controller/uploadCtrl");

// upload image for product
router.post(
  "/",
  uploadPhoto.array("images", 10),
  clientImgResize,
  uploadImages
);

// delete image for product
router.delete("/delete-img/:id", deleteImages);

module.exports = router;
