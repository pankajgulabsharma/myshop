const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name"],
    trim: true,
    maxLength: [20, "Product name not exceed than 20 characters"],
  },
  description: {
    type: String,
    required: [true, "Please Enter product Description"],
    maxLength: [4000, "Description is can not exceed than 4000 character"],
  },
  richDiscription: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    required: true,
  },
  // images: [
  //   {
  //     type: String,
  //   },
  // ],
  brand: {
    type: String,
  },
  rating: {
    type: Number,
    default: 0,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  stock: {
    type: Number,
    required: [true, "Please add some stoke for your product"],
    maxLength: [3, "Stoke can not exceed than 3 characters"],
    min: 0,
    // max: 255,
  },
  price: {
    type: Number,
    required: [true, "Please add a price for your product"],
    maxLength: [8, "Stoke can not exceed than 8 characters"],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
productSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
productSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Product", productSchema);
