const express = require("express");
const {
  getAllOrderItems,
  getOrderItemsById,
} = require("../controllers/orderItemsController");
const router = express.Router();

router.route("/").get(getAllOrderItems);
router.route("/:orderItemsId").get(getOrderItemsById);
// router.route("/").post(createCategory);
// router.route("/:orderItemsId").delete(deleteCategoryById);
// router.route("/:categoryId").put(updateCategory);

module.exports = router;
