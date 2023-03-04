const express = require("express");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  getProductCount,
  getFeatured,
} = require("../controllers/productController.js");
const {
  isAuthenticatedUser,
  authorizeRole,
} = require("../middlewares/auth.js");
const router = express.Router();

router.route("/").post(isAuthenticatedUser, createProduct);
router.route("/").get(getProducts);
router.route("/:productId").get(getProductById);
router
  .route("/:productId")
  .put(isAuthenticatedUser, authorizeRole("admin"), updateProductById);
router.route("/:productId").delete(isAuthenticatedUser, deleteProductById);
router.route("/get/productcount").get(getProductCount);
router.route("/get/featured/:count").get(getFeatured);

module.exports = router;
