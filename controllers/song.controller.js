const Song = require("../models/Song");
const User = require("../models/User");

const createNewSong = async (req, res) => {
  //req.user get the user because of passport.authentication
  const { name, thumbnail, songURL, language } = req.body;
  if (!name || !thumbnail || !songURL || !language) {
    return res.status(301).json({
      success: false,
      message: "All fields are required",
      data: null,
    });
  }
  let artist = "";
  console.log("check user id:", req.user.id);
  artist = req.user.id;

  const songDetails = { name, thumbnail, songURL, language, artist };
  const createdSong = await Song.create(songDetails);
  return res.status(200).json({
    success: true,
    message: "Song created successfully",
    data: createdSong,
  });
};

const getMySongs = async (req, res) => {
  const currentUser = req.user;
  console.log(currentUser);
  const songs = await Song.find({
    artist: req.user.id,
  });
  return res.status(200).json({
    success: true,
    message: "Get my songs  successfully",
    data: songs,
  });
};

const getSongByName = async (req, res) => {
  const { songName } = req.query.songName;
  await Song.find({ name: songName })
    .then((song) => {
      if (song)
        return res.status(200).json({
          success: true,
          message: "get Songs by name successfully",
          data: song,
        });
      else {
        return res.status(301).json({
          success: false,
          message: "Song does not exist",
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
const getAllSongs = async (req, res) => {
  try {
    const allSongs = await Song.find();
    if (allSongs) {
      return res.status(200).json({
        success: true,
        message: "AllSongs fetched successfully",
        data: allSongs,
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
const getSongById = async (req, res) => {
  let songId = req.params.id;
  const filter = { _id: songId };
  try {
    let song = await Song.findOne(filter);
    if (song) {
      return res.status(200).json({
        success: true,
        message: "Get song by id successfully!",
        data: song,
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
      message: e,
    });
  }
};

const updateSong = async (req, res) => {
  const songId = req.params.id;
  try {
    const updatedSong = await Song.findByIdAndUpdate(
      songId,
      {
        name: req.body.name,
        imgURL: req.body.imgURL,
        songURL: req.body.songURL,
        album: req.body.album,
        artist: req.body.artistId,
        language: req.body.language,
        category: req.body.category,
      },
      {
        returnDocument: "after",
      }
    );
    if (updatedSong) {
      return res.status(200).json({
        success: true,
        message: "Update song successfully",
        data: updatedSong,
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

async function deleteSong(req, res) {
  const songId = req.params.id;
  try {
    const deletedSong = await Song.findByIdAndDelete(songId);
    if (deletedSong) {
      return res.status(200).json({
        success: true,
        message: "Delete song successfully",
        data: deletedSong,
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

const getAllSongsOfArtist = async (req, res) => {
  const artistId = req.params.id;
  const artist = await User.findOne({ _id: artistId });
  if (!artist)
    return res.status(301).json({
      success: false,
      message: "Artist does not exist",
      data: null,
    });
  await Song.find({ artist: artistId })
    .then((songs) => {
      return res.status(200).json({
        success: true,
        message: "Songs fetched successfully",
        data: songs,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: err.message,
        data: null,
      });
    });
};
module.exports = {
  createNewSong,
  getMySongs,
  getSongByName,
  updateSong,
  getAllSongs,
  deleteSong,
  getSongById,
  getAllSongsOfArtist,
};
