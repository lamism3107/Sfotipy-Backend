const Category = require("../models/Category");

const createNewCategory = async (req, res) => {
  const currentUser = req.user;
  const { name, thumbnail } = req.body;
  if (!name) {
    return res.status(301).json({
      success: false,
      message: "Missing required fields",
      data: null,
    });
  }
  const categoryData = {
    name,
    thumbnail,
  };
  const category = await Category.create(categoryData);
  return res.status(200).json({
    success: true,
    message: "Category created successfully",
    data: category,
  });
};

const getCategoryById = async (req, res) => {
  const categoryId = req.params.id;
  await Category.findById({ _id: categoryId })
    .then((category) => {
      if (category) {
        return res.status(200).json({
          success: true,
          message: "get category by Id successfully",
          data: category,
        });
      } else {
        return res.status(304).json({
          success: false,
          message: "Category not found",
          data: null,
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: err.message,
        data: null,
      });
    });
};

const getAllCategries = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: "desc" });
    if (categories) {
      return res.status(200).json({
        success: true,
        message: "Get all category successfully",
        data: categories,
      });
    } else {
      return res.status(304).json({
        success: false,
        message: "Categorie not found",
        data: null,
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

module.exports = {
  createNewCategory,
  getCategoryById,
  getAllCategries,
};
