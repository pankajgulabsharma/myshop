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
const router = express.Router();

router.route("/createProduct").post(createProduct);
router.route("/getProducts").get(getProducts);
router.route("/getProductById/:productId").get(getProductById);
router.route("/updateProductById/:productId").put(updateProductById);
router.route("/deleteProductById/:productId").delete(deleteProductById);
router.route("/getProductCount").get(getProductCount);
router.route("/getFeatured/:count").get(getFeatured);

module.exports = router;
