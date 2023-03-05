const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItems",
      required: true,
    },
  ],
  shopingAddress1: {
    type: String,
    required: true,
  },
  shopingAddress2: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  zipcode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    maxLength: [10, "Phone number cannot be more than 10 characters"],
    minLength: [10, "Phone name should have 10 characters"],
  },
  status: {
    type: String,
    required: true,
    enum: {
      values: ["Pending", "Shipped"],
      message: "status is either Pending,Shipped",
    },
    trim: true,
    defaul: "Pending",
  },
  taxPrice: {
    type: Number,
    // required: true,
    default: 0,
  },
  shippingPrice: {
    type: Number,
    // required: true,
    default: 0,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  dateOrdered: {
    type: Date,
    default: new Date(),
  },
});

orderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
orderSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Order", orderSchema);
