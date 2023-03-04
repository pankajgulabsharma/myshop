const Order = require("../models/ordersModel.js");

exports.getOrders = async (req, res, next) => {
  try {
    const order = await Order.find({});
    if (!order) {
      res.json({
        success: false,
        message: "Not a single Order available",
      });
    }
    res.json({
      success: true,
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
