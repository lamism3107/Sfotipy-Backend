const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const authMiddleware = require("../utils/authMiddleware");

router.post(
  "/",
  authMiddleware.verifyAccessToken,
  categoryController.createNewCategory
);
router.get(
  "/:id",
  authMiddleware.verifyAccessToken,
  categoryController.getCategoryById
);
router.get(
  "/",
  authMiddleware.verifyAccessToken,
  categoryController.getAllCategries
);
