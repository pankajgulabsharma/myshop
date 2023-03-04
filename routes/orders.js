const express = require("express");
const {
  getOrders,
  createOrder,
  getOrderById,
} = require("../controllers/ordersController");
const router = express.Router();

router.route("/").get(getOrders);
router.route("/").post(createOrder);
router.route("/:orderId").get(getOrderById);

module.exports = router;
