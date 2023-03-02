const express = require("express");
const router = express.Router();
const {
  getAllCategories,
  createCategory,
  deleteCategoryById,
  getCategoryById,
  updateCategory,
} = require("../controllers/categoriesController");

router.route("/getAllCategories").get(getAllCategories);
router.route("/createCategory").post(createCategory);
router.route("/deleteCategoryById/:categoryId").delete(deleteCategoryById);
router.route("/getCategoryById/:categoryId").get(getCategoryById);
router.route("/updateCategory/:categoryId").put(updateCategory);

module.exports = router;
