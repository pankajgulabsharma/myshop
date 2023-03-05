const mongoose = require("mongoose");
const OrderItems = require("../models/orderItemsModel.js");

//get all orderItems
exports.getAllOrderItems = async (req, res, next) => {
  try {
    let orderItems = await OrderItems.find({});
    if (!orderItems) {
      return res.json({
        success: false,
        message: "Not a single orderItems available",
      });
    }
    res.json({
      success: true,
      orderItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get orderItems by id
exports.getOrderItemsById = async (req, res, next) => {
  try {
    let orderItems = await OrderItems.findById(req.params.orderItemsId);
    if (!orderItems) {
      return res.status(404).json({
        success: false,
        message: "orderItems with this id is not present",
      });
    }
    res.status(200).json({
      success: true,
      orderItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
