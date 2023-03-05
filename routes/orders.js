const express = require("express");
const {
  getOrders,
  createOrder,
  getOrderById,
  updateOrder,
  deleteOrderById,
  getTotalSales,
  getOrderCount,
} = require("../controllers/ordersController");
const { isAuthenticatedUser } = require("../middlewares/auth");
const router = express.Router();

router.route("/").get(getOrders);
router.route("/").post(isAuthenticatedUser, createOrder);
router.route("/:orderId").get(getOrderById);
router.route("/:orderId").put(updateOrder);
router.route("/:orderId").delete(deleteOrderById);
router.route("/get/totalsales").get(getTotalSales);
router.route("/get/count").get(getOrderCount);

module.exports = router;
