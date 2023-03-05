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
      user,
    } = req.body;

    let orderItemsIds = await Promise.all(
      // it returns[Promise<pending>,Promise<pending>] so to solve this we are using Promise.all()
      orderItems.map(async (orderItem) => {
        let newOrderItem = await OrderItems(orderItem).save();
        return newOrderItem._id;
      })
    );
    let totalPrices = await Promise.all(
      orderItemsIds.map(async (orderItemId) => {
        let orderItem = await OrderItems.findById(orderItemId).populate(
          "product",
          "price"
        );
        let totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice;
      })
    );

    let totalPrice = totalPrices.reduce((a, b) => a + b, 0);
    let order = new Order({
      orderItems: orderItemsIds,
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

//update order by id
exports.updateOrder = async (req, res, next) => {
  try {
    let { status } = req.body;
    let isStatusRight = ["Pending", "Shipped"].includes(status);
    if (!isStatusRight) {
      return res.status(404).json({
        success: false,
        message: "status is either Pending, Shipped",
      });
    }
    let updatedOrder = await Order.findByIdAndUpdate(
      req.params.orderId,
      {
        status,
      },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "order with this id is not present",
      });
    }
    res.status(200).json({
      success: true,
      updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Deleting Order based on Id
exports.deleteOrderById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.orderId)) {
      return res.status(400).json({
        success: false,
        message: `Invalid Order Id ${req.params.orderId} found`,
      });
    }
    await Order.findByIdAndDelete(req.params.orderId).then(async (order) => {
      if (order) {
        console.log("order==>", order);
        await order.orderItems.map(async (orderItemId) => {
          await OrderItems.findByIdAndDelete(orderItemId);
        });
        return res.status(200).json({
          success: true,
          message: `order id ${req.params.orderId} is deleted successfully`,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "order with this id is not present",
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Get totalsales
exports.getTotalSales = async (req, res, next) => {
  try {
    const totalSales = await Order.aggregate([
      { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
    ]);
    if (!totalSales) {
      return res.status(404).json({
        success: false,
        message: `The order can not be generated`,
      });
    }
    res.status(200).json({
      success: true,
      totalSales,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Get order count
exports.getOrderCount = async (req, res, next) => {
  try {
    const orderCount = await Order.find({}).countDocuments();
    if (!orderCount) {
      res.json({
        success: false,
        message: "Not a single Order available",
      });
    }
    res.json({
      success: true,
      orderCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
