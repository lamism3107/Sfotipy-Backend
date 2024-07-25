const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../utils/authMiddleware");

router.put("/:id", authMiddleware.verifyAccessToken, userController.updateUser);
router.delete("/:id", authMiddleware.verifyAdmin, userController.deleteUser);

router.get("/", authMiddleware.verifyAccessToken, userController.getAllUsers);
router.get(
  "/:id",
  authMiddleware.verifyAccessToken,
  userController.getUserById
);
router.get(
  "/:id/playlists",
  authMiddleware.verifyAccessToken,
  userController.getAllPlaylistsOfUser
);

router.get(
  "/:id/albums",
  authMiddleware.verifyArtist,
  userController.getAllAlbumsOfUser
);
router.get(
  "/:id/songs",
  authMiddleware.verifyAccessToken,
  userController.getAllSongsOfUser
);

module.exports = router;
