const Order = require("../models/ordersModel.js");
const OrderItems = require("../models/orderItemsModel.js");
const { default: mongoose } = require("mongoose");

exports.getOrders = async (req, res, next) => {
  try {
    const order = await Order.find({})
      .populate({
        path: "user",
        select: "name",
      })
      .sort({ dateOrdered: -1 });

    if (!order) {
      res.json({
        success: false,
        message: "Not a single Order available",
      });
    }
    res.json({
      success: true,
      orders: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shopingAddress1,
      shopingAddress2,
      city,
      zipcode,
      country,
      phone,
      status,
      taxPrice,
      shippingPrice,
      totalPrice,
      user,
    } = req.body;

    let orderItemsIds = Promise.all(
      // it returns[Promise<pending>,Promise<pending>] so to solve this we are using Promise.all()
      orderItems.map(async (orderItem) => {
        let newOrderItem = await OrderItems(orderItem).save();
        return newOrderItem._id;
      })
    );

    let orderItemsIdsResolver = await orderItemsIds; //still we are getting one [Promise<pending>] so we need to wait here
    let order = new Order({
      orderItems: orderItemsIdsResolver,
      shopingAddress1,
      shopingAddress2,
      city,
      zipcode,
      country,
      phone,
      status,
      taxPrice,
      shippingPrice,
      totalPrice,
      user,
    });
    order = await order.save();
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "order cannot be created" });
    }
    res.status(201).json({
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

//Get single order by id
exports.getOrderById = async (req, res, next) => {
  try {
    //isValidObjectId() is use to validate Object or not
    if (!mongoose.isValidObjectId(req.params.orderId)) {
      return res.status(400).json({
        success: false,
        message: `Invalid Order Id ${req.params.orderId} found`,
      });
    }
    const order = await Order.findById(req.params.orderId)
      .populate("user", "name")
      .populate({
        path: "orderItems",
        populate: { path: "product", populate: "category" },
      });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order with id ${req.params.orderId} is not found`,
      });
    }
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
