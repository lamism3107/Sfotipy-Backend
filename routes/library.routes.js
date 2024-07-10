const express = require("express");
const router = express.Router();
const libraryController = require("../controllers/library.controller");
const authMiddleware = require("../utils/authMiddleware");

router.post("/", libraryController.createNewLibrary);
router.get(
  "/",
  authMiddleware.verifyAccessToken,
  libraryController.getLibraryData
);

router.put(
  "/playlist/:playlistId",
  authMiddleware.verifyAccessToken,
  libraryController.addPlaylistToLibrary
);
router.put(
  "/song/:songId",
  authMiddleware.verifyAccessToken,
  libraryController.addSongToLibrary
);
router.get(
  "/:type",
  authMiddleware.verifyAccessToken,
  libraryController.searchItemInLibrary
);
router.put(
  "/artists/:artistId",
  authMiddleware.verifyAccessToken,
  libraryController.addArtistToLibrary
);
router.delete(
  "/playlists/:playlistId",
  authMiddleware.verifyAccessToken,
  libraryController.deletePlaylistFromLibrary
);

router.delete(
  "/songs/:songId",
  authMiddleware.verifyAccessToken,
  libraryController.deleteSongFromLibrary
);

module.exports = router;
