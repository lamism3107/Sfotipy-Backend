const express = require("express");
const router = express.Router();
const libraryController = require("../controllers/library.controller");
const authMiddleware = require("../utils/authMiddleware");

router.post(
  "/",
  authMiddleware.verifyAccessToken,
  libraryController.createNewLibrary
);
router.get(
  "/",
  authMiddleware.verifyAccessToken,
  libraryController.getMyLibrary
);
router.post(
  "/addSong",
  authMiddleware.verifyAccessToken,
  libraryController.addSongToPlaylist
);
router.delete(
  "/:id",
  authMiddleware.verifyAccessToken,
  libraryController.deletePlaylist
);

module.exports = router;
