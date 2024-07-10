const Playlist = require("../models/Playlist");
const User = require("../models/User");
const Song = require("../models/Song");
const admin = require("../config/firebase/firebase.config");
const SongModel = require("../models/Song");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: "desc" });
    if (users) {
      return res.status(200).json({
        success: true,
        message: "Get all users successfully!",
        data: users,
      });
    } else {
      return res.status(301).json({
        success: false,
        message: "Data not found!",
        data: null,
      });
    }
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: `ERROR: ${e}`,
    });
  }
};
const updateUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: req.body.name,
        email: req.body.email,
        imgURL: req.body.imgURL,
        role: req.body.role,
      },
      {
        returnDocument: "after",
      }
    );
    if (updatedUser) {
      return res.status(200).json({
        success: true,
        message: "Update user successfully",
        data: updatedUser,
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

const deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (deletedUser) {
      return res.status(200).json({
        success: true,
        message: "Delete user successfully",
        data: deletedUser,
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

const createNewUserByGoogleAccount = async (decodeValue, req, res) => {
  const newUser = new User({
    name: decodeValue.name,
    email: decodeValue.email,
    role: "listener",
    imgURL: decodeValue.picture,
    ggId: decodeValue.user_id,
    email_verified: decodeValue.email_verified,
    auth_time: decodeValue.auth_time,
    codeType: "user",
  });
  try {
    const savedUser = await newUser.save();
    res.status(201).json({
      success: true,
      message: "Create new user from google account successfully!",
      data: savedUser,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e,
    });
  }
};

const updateGoogleAccountUser = async (decodeValue, req, res) => {
  //Nếu tồn tại rồi thì tạo mới, ngược lại thì update
  const options = {
    upsert: true,
    new: true,
  };

  const filter = {
    email: decodeValue.email,
  };
  try {
    const updatedUser = await User.findOneAndUpdate(
      filter,
      {
        email_verified: true,
        imgURL: decodeValue.picture,
      },
      options
    );

    res.status(200).json({
      success: true,
      message: "Update google account user successfully!",
      data: updatedUser,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: `ERROR ${e}`,
    });
  }
};

const getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (user) {
      return res.status(200).json({
        success: true,
        message: "Get user successfully!",
        data: user,
      });
    } else {
      return res.status(301).json({
        success: false,
        message: "Data not found!",
        data: null,
      });
    }
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: `ERROR: ${e}`,
    });
  }
};
const getAllPlaylistsOfUser = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findOne({ _id: userId });
  if (!user)
    return res.status(304).json({
      success: false,
      message: "Invalid id, user not found",
      data: null,
    });
  await Playlist.find({ owner: userId, codeType: "Playlist" })
    .then((playlist) => {
      return res.status(200).json({
        success: true,
        message: "Get all playlist of user successfully",
        data: playlist,
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

const getAllAlbumsOfUser = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findOne({ _id: userId });
  if (!user)
    return res.status(304).json({
      success: false,
      message: "Invalid id, user not found",
      data: null,
    });
  await Playlist.find({ owner: userId, codeType: "Album" })
    .then((playlist) => {
      return res.status(200).json({
        success: true,
        message: "Get all album of artist successfully",
        data: playlist,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: `ERROR from server: ${err.message}`,
        data: null,
      });
    });
};

const getAllSongsOfUser = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (!user)
    return res.status(304).json({
      success: false,
      message: "Invalid id, user not found",
      data: null,
    });
  await SongModel.find({ owner: userId })
    .then((playlist) => {
      return res.status(200).json({
        success: true,
        message: "Get all playlist of user successfully",
        data: playlist,
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
  getAllUsers,
  createNewUserByGoogleAccount,
  updateGoogleAccountUser,
  updateUser,
  deleteUser,
  getUserById,
  getAllPlaylistsOfUser,
  getAllAlbumsOfUser,
  getAllSongsOfUser,
};
