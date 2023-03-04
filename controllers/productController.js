const Product = require("../models/productModel.js");
const Category = require("../models/categoryModel.js");
const mongoose = require("mongoose");

//Create the Product
exports.createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      richDiscription,
      image,
      brand,
      rating,
      numOfReviews,
      stock,
      price,
      isFeatured,
      category,
    } = req.body;
    let user = req.user.id; //this action is perfomed when the user is login so we get login id from there (req.user getting is through authentication)
    const isCategoryFound = await Category.findById(category);
    if (!isCategoryFound) {
      return res.status(404).json({
        success: false,
        message: "Invalid category",
      });
    }
    let product = await Product.create({
      name,
      description,
      richDiscription,
      image,
      brand,
      rating,
      numOfReviews,
      stock,
      price,
      isFeatured,
      category,
      user,
    });

    if (product) {
      res.status(201).json({
        success: true,
        product,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Get all products
exports.getProducts = async (req, res, next) => {
  try {
    //http://localhost:5001/api/v1/getProducts?category=23456789,21345687
    let filter = {};
    if (req.query.category) {
      filter = { category: req.query.category.split(",") };
    }

    const products = await Product.find(filter).populate("category");
    if (!products) {
      res.json({
        success: false,
        message: "Not a single Product available",
      });
    }
    res.json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Get single product by id
exports.getProductById = async (req, res, next) => {
  try {
    //isValidObjectId() is use to validate Object or not
    if (!mongoose.isValidObjectId(req.params.productId)) {
      return res.status(400).json({
        success: false,
        message: `Invalid Product Id ${req.params.productId} found`,
      });
    }

    //[1] select("fieldName")
    // include a and b, exclude other fields
    //e.g1. query.select('a b');    here query is await Product.findById(req.params.productId)

    // exclude c and d, include other fields
    //e.g2. query.select('-c -d');     here query is await Product.findById(req.params.productId)

    // include passowrd with data given by query
    //e.g2. query.select('+password');     here query is await User.findById(req.params.userId)

    //[2] populate("fieldName that you have defined in model")   it is used to populate ref data

    const product = await Product.findById(req.params.productId).populate(
      "category user"
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `product with id ${req.params.productId} is not found`,
      });
    }
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//update the product
exports.updateProductById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.productId)) {
      return res.status(400).json({
        success: false,
        message: `Invalid Product Id ${req.params.productId} found`,
      });
    }
    const {
      name,
      description,
      richDiscription,
      image,
      brand,
      rating,
      numOfReviews,
      stock,
      price,
      isFeatured,
      category,
    } = req.body;
    const isCategoryFound = await Category.findById(category);
    if (!isCategoryFound) {
      return res.status(404).json({
        success: false,
        message: "Invalid category",
      });
    }
    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      {
        name,
        description,
        richDiscription,
        image,
        brand,
        rating,
        numOfReviews,
        stock,
        price,
        isFeatured,
        category,
      },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `product with this id ${req.params.productId} is not present`,
      });
    }
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Deleting Product based on Id
exports.deleteProductById = async (req, res, next) => {
  try {
    let product = await Product.findByIdAndDelete(req.params.productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `product with this id ${req.params.productId} is not present`,
      });
    }
    res.status(200).json({
      success: true,
      message: `product id ${req.params.productId} is deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Get product count
exports.getProductCount = async (req, res, next) => {
  try {
    const productsCount = await Product.find({}).countDocuments();
    if (!productsCount) {
      res.json({
        success: false,
        message: "Not a single Product available",
      });
    }
    res.json({
      success: true,
      productsCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Get Featured
exports.getFeatured = async (req, res, next) => {
  let limitCount = req.params.count ? req.params.count : 0;
  const product = await Product.find({
    isFeatured: true,
  }).limit(+limitCount);
  // two methods find({...})+limit(Number)
  //here +limitCount bcz limitCount gives string value so to convert String to Number

  if (!product) {
    res.json({
      success: false,
      message: "Not a single Product available",
    });
  }
  res.json({
    success: true,
    product,
  });
};
