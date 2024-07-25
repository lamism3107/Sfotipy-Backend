const express = require("express");
const router = express.Router();
const genreController = require("../controllers/genre.controller");
const authMiddleware = require("../utils/authMiddleware");

router.post(
  "/",
  authMiddleware.verifyAccessToken,
  genreController.createNewGenre
);
router.get(
  "/:id",
  authMiddleware.verifyAccessToken,
  genreController.getGenreById
);
router.delete(
  "/:id",
  authMiddleware.verifyAccessToken,
  genreController.deleteGenre
);
router.get("/", authMiddleware.verifyAccessToken, genreController.getAllGenres);
module.exports = router;
