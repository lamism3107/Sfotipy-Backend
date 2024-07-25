const GenreModel = require("../models/Genre");
const Playlist = require("../models/Playlist");
const SongModel = require("../models/Song");
const UserModel = require("../models/User");
const User = require("../models/User");

const getAllPlaylists = async (req, res) => {
  const type = req.query.type;
  console.log(type);
  try {
    if (type === "All") {
      const playlists = await Playlist.find().sort({ createdAt: "desc" });
      if (playlists) {
        return res.status(200).json({
          success: true,
          message: "Get all playlists successfully!",
          data: playlists,
        });
      }
    } else {
      const playlists = await Playlist.find({
        codeType: type,
      }).sort({ createdAt: "desc" });
      if (playlists) {
        return res.status(200).json({
          success: true,
          message: "Get all playlists successfully!",
          data: playlists,
        });
      }
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Error from server: ${err.message}`,
      data: null,
    });
  }
};

const createNewPlaylist = async (req, res) => {
  const currentUser = req.user;
  const { name, songs, thumbnail, codeType, artist, description } = req.body;
  if (!name || !songs) {
    return res.status(301).json({
      success: false,
      message: "Missing required fields",
      data: null,
    });
  }
  const playlistData = {
    name,
    songs,
    codeType,
    thumbnail,
    owner: currentUser.id,
    artist,
    description,
    collaborators: [],
  };
  const playlist = await Playlist.create(playlistData);
  const playlistToReturn = await Playlist.findById(playlist._id).populate({
    path: "owner",
    model: UserModel,
    select: "name",
  });
  return res.status(200).json({
    success: true,
    message: "Playlist created successfully",
    data: playlistToReturn,
  });
};

const getPlaylistById = async (req, res) => {
  const playlistId = req.params.id;
  await Playlist.findById({ _id: playlistId })
    .populate({ path: "owner", model: UserModel, select: "name" })
    .populate({
      path: "songs",
      populate: {
        path: "songId",
        model: SongModel,
      },
    })
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
  const playlistId = req.params.id;
  const songId = req.params.songId;
  try {
    const playlist = await Playlist.findById(playlistId);
    if (playlist) {
      if (
        playlist.owner !== currentUser.id &&
        playlist.collaborators.includes(currentUser.id)
      ) {
        return res.status(400).json({
          success: false,
          message: "Not allowed!",
          data: null,
        });
      }
    }
    const songToAdd = await SongModel.findByIdAndUpdate(
      songId,
      {
        album: playlistId,
      },
      {
        returnDocument: "after",
      }
    );
    if (songToAdd) {
      const currentDate = new Date();
      playlist.songs.push({
        songId: songId,
        addDate: currentDate,
      });
      await playlist.save();
      return res.status(200).json({
        success: true,
        message: "Playlist added to playlist successfully",
        data: playlist,
      });
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
  let updatedPlaylist = null;
  try {
    if (!req.body.name && !req.body.description) {
      updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
          thumbnail: req.body.thumbnail,
        },
        {
          returnDocument: "after",
        }
      );
    } else {
      updatedPlaylist = await Playlist.findByIdAndUpdate(
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
    }
    if (updatedPlaylist) {
      const returningPlaylist = await Playlist.findById({
        _id: playlistId,
      }).populate({ path: "owner", model: UserModel, select: "name" });
      return res.status(200).json({
        success: true,
        message: "Update playlist successfully",
        data: returningPlaylist,
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
      return res.status(404).json({
        success: false,
        message: "Data not found!",
        data: null,
      });
    }
  } catch (e) {
    return res.status(500).json({
      success: false,
      data: null,
      message: e.message,
    });
  }
}

const getSongsOfPlaylist = async () => {
  const playlistId = req.params.playlistId;
  try {
    const playlist = await Playlist.findById(playlistId).populate({
      path: "songs",
      populate: { path: "owner", model: UserModel, select: "name" },
      populate: { path: "artists", model: UserModel, select: "name" },
      populate: { path: "producers", model: UserModel, select: "name" },
      populate: { path: "composers", model: UserModel, select: "name" },
      populate: { path: "genres", model: UserModel, select: "name" },
      model: GenreModel,
    });
    if (playlist) {
      return res.status(200).json({
        success: true,
        message: "Get songs of playlist successfully",
        data: playlist.songs,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Playlist not found",
        data: null,
      });
    }
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: `Error from server: ${e.message}`,
      data: null,
    });
  }
};
module.exports = {
  createNewPlaylist,
  getPlaylistById,
  getAllPlaylists,
  addSongToPlaylist,
  deletePlaylist,
  updatePlaylist,
  getSongsOfPlaylist,
};
