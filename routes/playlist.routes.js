const express = require("express");
const router = express.Router();
const playlistController = require("../controllers/playlist.controller");
const authMiddleware = require("../utils/authMiddleware");

router.get(
  "/",
  authMiddleware.verifyAccessToken,
  playlistController.getAllPlaylists
);
router.post(
  "/",
  authMiddleware.verifyAccessToken,
  playlistController.createNewPlaylist
);
router.get(
  "/:id",
  authMiddleware.verifyAccessToken,
  playlistController.getPlaylistById
);
router.put(
  "/:id/songs/:songId",
  authMiddleware.verifyAccessToken,
  playlistController.addSongToPlaylist
);
router.get(
  "/:id/songs",
  authMiddleware.verifyAccessToken,
  playlistController.getSongsOfPlaylist
);

router.delete(
  "/:id",
  authMiddleware.verifyAccessToken,
  playlistController.deletePlaylist
);
router.put(
  "/:id",
  authMiddleware.verifyAccessToken,
  playlistController.updatePlaylist
);

module.exports = router;
