const express = require("express");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  getProductCount,
  getFeatured,
  productGalleryImages,
} = require("../controllers/productController.js");
const {
  isAuthenticatedUser,
  authorizeRole,
} = require("../middlewares/auth.js");
const router = express.Router();
const multer = require("multer");

// This is the meme type which is standard for all file upload like for pdf  application/pdf
const FILE_TYPE_MAP = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    // console.log("file.originalname", file.originalname);
    const fileName = file.originalname
      .replace(" ", "-")
      .substring(0, file.originalname.lastIndexOf("."));
    const extention = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extention}`);
  },
});
const uploadOption = multer({ storage: storage });

//Create the Product
router.route("/").post(
  isAuthenticatedUser,
  uploadOption.single("image"), //here image is image selection field name in postman (Body->form-data)
  createProduct
);
router.route("/gallery-images/:productId").put(
  isAuthenticatedUser,
  uploadOption.array("images", 10), //here images is image selection field name in postman (Body->form-data)
  productGalleryImages
);
router.route("/").get(getProducts);
router.route("/:productId").get(getProductById);
router
  .route("/:productId")
  .put(isAuthenticatedUser, authorizeRole("admin"), updateProductById);
router.route("/:productId").delete(isAuthenticatedUser, deleteProductById);
router.route("/get/productcount").get(getProductCount);
router.route("/get/featured/:count").get(getFeatured);

module.exports = router;
