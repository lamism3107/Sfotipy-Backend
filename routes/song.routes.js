const express = require("express");
const router = express.Router();
const songController = require("../controllers/song.controller");
const authMiddleware = require("../utils/authMiddleware");

router.post(
  "/",
  authMiddleware.verifyAccessToken,
  songController.createNewSong
);
router.get("/mySongs", authMiddleware.verifyArtist, songController.getMySongs);

router.get(
  "/getSongsByName",
  authMiddleware.verifyAccessToken,
  songController.getSongByName
);

router.get("/", authMiddleware.verifyAccessToken, songController.getAllSongs);
router.get(
  "/:id",
  authMiddleware.verifyAccessToken,
  songController.getSongById
);
router.put("/:id", authMiddleware.verifyArtist, songController.updateSong);
router.delete("/:id", authMiddleware.verifyArtist, songController.deleteSong);

router.get(
  "/:id/songs",
  authMiddleware.verifyAccessToken,
  songController.getAllSongsOfArtist
);

module.exports = router;
