const Playlist = require("../models/Playlist");
const User = require("../models/User");
const LibraryModel = require("../models/Library");
const admin = require("../config/firebase/firebase.config");
const SongModel = require("../models/Song");
const { genAccessToken, genRefreshToken } = require("../utils/jwt");
const GenreModel = require("../models/Genre");
const UserModel = require("../models/User");

const getAllUsers = async (req, res) => {
  const name = req.query.name;
  const role = req.query.role;
  try {
    let users = null;
    if (name && role) {
      users = await User.find({
        role: role,
        name: {
          $regex: `^${name}`,
          $options: "i",
        },
      });
    } else {
      users = await User.find().sort({ createdAt: "desc" });
    }
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
  try {
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
    const savedUser = await User.create(newUser);
    //Create new library
    const initLibrary = {
      owner: savedUser._id,
      songs: [],
      playlists: [],
      artists: [],
    };
    const library = await LibraryModel.create(initLibrary);
    // console.log("savedUser, library", savedUser, library);

    const payload = {
      id: savedUser._id,
      role: savedUser.role,
    };
    const accessToken = await genAccessToken(payload);
    const newRefreshToken = await genRefreshToken(payload);

    res.cookie("refreshToken", newRefreshToken, {
      //maxAge: 30s
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });
    //Lưu refreshToken vào database
    const refreshTokenArray = await User.findOne(
      { email: decodeValue.email },
      {
        _id: 0,
        refreshToken: 1,
      }
    );
    console.log("check", refreshTokenArray);

    refreshTokenArray.refreshToken.push(newRefreshToken);
    await User.updateOne(
      { email: decodeValue.email },
      {
        refreshToken: refreshTokenArray.refreshToken,
      },
      {
        returnDocument: "after",
      }
    );

    const updatedUser = await User.findOne({ email: decodeValue.email });

    //Trả về res.data thông tin về user(không chứa mật khẩu và kèm thêm accessToken)
    const { refreshToken, ...dataToReturn } = updatedUser._doc;
    dataToReturn.accessToken = accessToken;

    res.status(201).json({
      success: true,
      message: "Create new user from google account successfully!",
      data: dataToReturn,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e,
    });
  }
};

const updateGoogleAccountUser = async (decodeValue, req, res) => {
  //Nếu chưa tồn tại rồi thì tạo mới, ngược lại thì update
  const options = {
    // upsert: true,
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
      }
      // options
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
    .populate([
      { path: "owner", model: UserModel, select: "name" },
      { path: "artists", model: UserModel, select: "name" },
      ,
      { path: "genres", model: GenreModel, select: "name" },
    ])
    .then((songs) => {
      return res.status(200).json({
        success: true,
        message: "Get all songs of user successfully",
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

// const getArtistByName = async (req, res) => {
//   try {
//     const artists = await User.find({
//       role: role,
//       name: {
//         $regex: `^${name}`,
//         $options: "i",
//       },
//     });
//     if (artists) {
//       return res.status(200).json({
//         success: true,
//         message: "Get artists successfully!",
//         data: artists,
//       });
//     } else {
//       return res.status(301).json({
//         success: false,
//         message: "Data not found!",
//         data: null,
//       });
//     }
//   } catch (e) {
//     return res.status(500).json({
//       success: false,
//       message: `ERROR: ${e}`,
//     });
//   }
// };
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
  // getArtistByName,
};
