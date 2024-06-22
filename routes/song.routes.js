const express = require("express");
const router = express.Router();
const passport = require("passport");
const songController = require("../controllers/song.controller");
const authMiddleware = require("../utils/authMiddleware");

router.post(
  "/",
  // passport.authenticate("jwt", { session: false }),
  authMiddleware.verifyArtist,
  songController.createNewSong
);
router.get(
  "/mySongs",
  // passport.authenticate("jwt", { session: false }),
  authMiddleware.verifyArtist,
  songController.getMySongs
);

router.get(
  "/getSongsByName",
  // passport.authenticate("jwt", { session: false }),
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
  // passport.authenticate("jwt", { session: false }),
  authMiddleware.verifyAccessToken,
  songController.getAllSongsOfArtist
);

module.exports = router;
