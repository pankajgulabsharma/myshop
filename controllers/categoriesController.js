const Category = require("../models/categoriesModel.js");

//Getting all Category
exports.getAllCategories = async (req, res, next) => {
  try {
    let category = await Category.find({});
    if (!category) {
      return res.json({
        success: false,
        message: "Not a single Category available",
      });
    }
    res.json({
      success: true,
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Creating Category
exports.createCategory = async (req, res, next) => {
  try {
    const { name, color, icon } = req.body;
    let category = new Category({
      name,
      color,
      icon,
    });
    category = await category.save();
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "category cannot be created" });
    }
    res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Deleting Catergory based on Id
exports.deleteCategoryById = async (req, res, next) => {
  try {
    let category = await Category.findByIdAndDelete(req.params.categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "category with this id is not present",
      });
    }
    res.status(200).json({
      success: true,
      message: `catgory id ${req.params.categoryId} is deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Getting Catergory based on Id
exports.getCategoryById = async (req, res) => {
  try {
    let category = await Category.findById(req.params.categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "category with this id is not present",
      });
    }
    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    let { name, color, icon } = req.body;
    let updatedCategory = await Category.findByIdAndUpdate(
      req.params.categoryId,
      {
        name,
        color,
        icon,
      },
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "category with this id is not present",
      });
    }
    res.status(200).json({
      success: true,
      updatedCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
