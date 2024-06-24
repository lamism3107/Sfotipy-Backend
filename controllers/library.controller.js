const LibraryModel = require("../models/Library");
const PlaylistModel = require("../models/Playlist");
const SongModel = require("../models/Song");
const UserModel = require("../models/User");

const createNewLibrary = async (req, res) => {
  const currentUser = req.user;
  const { songs, librarys, artists } = req.body;
  const libraryData = {
    songs,
    owner: currentUser._id,
    artists,
    playlists,
    likedSongs,
  };
  const library = await LibraryModel.create(libraryData);
  return res.status(200).json({
    success: true,
    message: "Library created successfully",
    data: library,
  });
};

const getMyLibrary = async (req, res) => {
  const currentUser = req.user;
  await LibraryModel.findOne({ owner: currentUser._id })
    .then((library) => {
      if (library) {
        return res.status(200).json({
          success: true,
          message: "get my library successfully",
          data: library,
        });
      } else {
        return res.status(304).json({
          success: false,
          message: "Library not found",
          data: null,
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: err.message,
        data: null,
      });
    });
};

const addSongToLibrary = async (req, res) => {
  const currentUser = req.user;
  const { libraryId, songId } = req.body;

  try {
    const library = await LibraryModel.findOne({ _id: libraryId });

    const songToAdd = await SongModel.findOne({ id: songId });
    if (songToAdd) {
      if (library.songs.includes(songId)) {
        return res.status(400).json({
          success: false,
          message: "Song is already added to library",
          data: null,
        });
      } else {
        library.songs.push(songId);
        await library.save();
        return res.status(200).json({
          success: true,
          message: "Song is added to library successfully",
          data: library,
        });
      }
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

const addPlaylistToLibrary = async (req, res) => {
  const currentUser = req.user;
  const { libraryId, playlistId } = req.body;

  try {
    const library = await LibraryModel.findOne({ _id: libraryId });
    const playlistToAdd = await PlaylistModel.findOne({ _id: playlistId });
    if (playlistToAdd) {
      if (library.playlists.includes(playlistId)) {
        return res.status(400).json({
          success: false,
          message: "Playlist is already added to library",
          data: null,
        });
      } else {
        library.playlists.push(playlistId);
        await library.save();
        return res.status(200).json({
          success: true,
          message: "Playlist is added to library successfully",
          data: library,
        });
      }
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};
const addArtistToLibrary = async (req, res) => {
  const currentUser = req.user;
  const { libraryId, artistId } = req.body;

  try {
    const library = await LibraryModel.findOne({ _id: libraryId });
    const artistToAdd = await UserModel.findOne({ _id: userId });
    if (artistToAdd) {
      if (library.artists.includes(artistId)) {
        return res.status(400).json({
          success: false,
          message: "Artist is already added to library",
          data: null,
        });
      } else {
        library.artists.push(artistId);
        await library.save();
        return res.status(200).json({
          success: true,
          message: "Library added to library successfully",
          data: library,
        });
      }
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

module.exports = {
  createNewLibrary,
  getMyLibrary,
  addSongToLibrary,
  addPlaylistToLibrary,
  addArtistToLibrary,
};
