const Playlist = require("../models/Playlist");
const User = require("../models/User");

const createNewPlaylist = async (req, res) => {
  //req.user get the user because of passport.authentication
  const currentUser = req.user;
  const { name, thumbnail, songs, isAlbum, artist } = req.body;
  if (!name || !thumbnail || !songs) {
    return res.status(301).json({
      success: false,
      message: "Missing required fields",
      data: null,
    });
  }
  const playlistData = {
    name,
    thumbnail,
    songs,
    owner: currentUser.id,
    isAlbum,
    artist,
    collaborators: [],
  };
  const playlist = await Playlist.create(playlistData);
  return res.status(200).json({
    success: true,
    message: "Playlist created successfully",
    data: playlist,
  });
};

const getPlaylistById = async (req, res) => {
  const playlistId = req.params.id;
  await Playlist.findById({ _id: playlistId })
    .then((playlist) => {
      if (playlist) {
        return res.status(200).json({
          success: true,
          message: "get playlist by Id successfully",
          data: playlist,
        });
      } else {
        return res.status(304).json({
          success: false,
          message: "Playlist not found",
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

const addSongToPlaylist = async (req, res) => {
  const currentUser = req.user;
  const { playlistId, songId } = req.body;

  try {
    const playlist = await Playlist.findOne({ _id: playlistId });
    if (playlist) {
      if (
        playlist.owner !== currentUser._id &&
        playlist.collaborators.includes(currentUser._id)
      ) {
        return res.status(400).json({
          success: false,
          message: "Not allowed!",
          data: null,
        });
      }
    }
    const songToAdd = await Playlist.findOne({ id: songId });
    if (songToAdd) {
      if (playlist.songs.includes(songId)) {
        return res.status(400).json({
          success: false,
          message: "Song already added to playlist",
          data: null,
        });
      } else {
        playlist.songs.push(songId);
        await playlist.save();
        return res.status(200).json({
          success: true,
          message: "Playlist added to playlist successfully",
          data: playlist,
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

const updatePlaylist = async (req, res) => {
  const playlistId = req.params.id;
  try {
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      playlistId,
      {
        name: req.body.name,
        thumbnail: req.body.thumbnail,
        description: req.body.description,
      },
      {
        returnDocument: "after",
      }
    );
    if (updatedPlaylist) {
      return res.status(200).json({
        success: true,
        message: "Update playlist successfully",
        data: updatedPlaylist,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: "Data not found!",
        data: null,
      });
    }
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

async function deletePlaylist(req, res) {
  const playlistId = req.params.id;
  try {
    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);
    if (deletedPlaylist) {
      return res.status(200).json({
        success: true,
        message: "Delete song successfully",
        data: deletedPlaylist,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: "Data not found!",
        data: null,
      });
    }
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
}
module.exports = {
  createNewPlaylist,
  getPlaylistById,
  addSongToPlaylist,
  deletePlaylist,
  updatePlaylist,
};
