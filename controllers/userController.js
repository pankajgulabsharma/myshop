const User = require("../models/userModel.js");
const mongoose = require("mongoose");

exports.getAllUsers = async (req, res, next) => {
  const users = await User.find({});
  if (!users) {
    return res.status(404).json({
      success: false,
      message: "User not available",
    });
  }
  res.status(200).json({
    success: true,
    users,
  });
};

//Create a User
exports.createUser = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      street,
      city,
      zipcode,
      country,
      isAdmin,
    } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    user = await User.create({
      name,
      email,
      password,
      phone,
      street,
      city,
      zipcode,
      country,
      isAdmin,
    });

    if (user) {
      res.status(201).json({
        success: true,
        user,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Get single product by id
exports.getUserById = async (req, res, next) => {
  try {
    //isValidObjectId() is use to validate Object or not
    if (!mongoose.isValidObjectId(req.params.userId)) {
      return res.status(400).json({
        success: false,
        message: `Invalid User Id ${req.params.userId} found`,
      });
    }

    //[1] select("fieldName")
    // include a and b, exclude other fields
    //e.g1. query.select('a b');    here query is await Product.findById(req.params.productId)

    // exclude c and d, include other fields
    //e.g2. query.select('-c -d');     here query is await Product.findById(req.params.productId)

    //[2] populate("fieldName that you have defined in model")   it is used to populate ref data

    const user = await User.findById(req.params.userId).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with id ${req.params.userId} is not found`,
      });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Deleting User based on Id
exports.deleteUserById = async (req, res, next) => {
  try {
    let user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with this id ${req.params.userId} is not present`,
      });
    }
    res.status(200).json({
      success: true,
      message: `User id ${req.params.userId} is deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Login User
exports.login = async (req, res, next) => {
  console.log("login call==");
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter Email and Password",
      });
    }
    let user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No user found with this Email Id",
      });
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    } else {
      let token = await user.generateToken();
      let options = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), //day:90,hours:24,min:60,sec:60,milisec:1000
        httpOnly: true,
      };
      return res.status(201).cookie("token", token, options).json({
        success: true,
        user,
        token,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
