const express = require("express");
const router = express.Router();
const passport = require("passport");
const playlistController = require("../controllers/playlist.controller");
const authMiddleware = require("../utils/authMiddleware");

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
router.post(
  "/addSong",
  // passport.authenticate("jwt", { session: false }),
  authMiddleware.verifyAccessToken,
  playlistController.addSongToPlaylist
);
router.delete(
  "/:id",
  authMiddleware.verifyAccessToken,
  playlistController.deletePlaylist
);

module.exports = router;
