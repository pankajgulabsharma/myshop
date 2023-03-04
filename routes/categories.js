const express = require("express");
const router = express.Router();
const {
  getAllCategories,
  createCategory,
  deleteCategoryById,
  getCategoryById,
  updateCategory,
} = require("../controllers/categoriesController");

router.route("/").get(getAllCategories);
router.route("/").post(createCategory);
router.route("/:categoryId").delete(deleteCategoryById);
router.route("/:categoryId").get(getCategoryById);
router.route("/:categoryId").put(updateCategory);

module.exports = router;
