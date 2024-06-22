const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.ObjectId;

const Category = new mongoose.Schema({
  name: { type: String, required: true },
  thumbnail: { type: String, required: true },
});

const CategoryModel = mongoose.model("Category", Category);

module.exports = CategoryModel;
