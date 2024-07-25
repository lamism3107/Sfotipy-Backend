const GenreModel = require("../models/Genre");
const LibraryModel = require("../models/Library");
const PlaylistModel = require("../models/Playlist");
const SongModel = require("../models/Song");
const UserModel = require("../models/User");
const {
  getAllPlaylistOfLibrary,
  getAllLibraryData,
  getAllAlbumOfLibrary,
  getAllArtistOfLibrary,
  getAllSongOfLibrary,
  searchItemByName,
} = require("../services/library.service");

const createNewLibrary = async (req, res) => {
  const { owner, songs, playlists, artists } = req.body;
  const libraryData = {
    songs,
    owner,
    artists,
    playlists,
  };
  const library = await LibraryModel.create(libraryData);
  return res.status(200).json({
    success: true,
    message: "Library created successfully",
    data: library,
  });
};

const getLibraryData = async (req, res) => {
  const currentUser = req.user;
  const category = req.query.category;

  let response = {};
  if (category === "Playlist") {
    response = await getAllPlaylistOfLibrary(currentUser);
    return res.status(response.statusCode).json({
      success: response.success,
      message: response.message,
      data: response?.data,
    });
  }
  if (category === "All") {
    response = await getAllLibraryData(currentUser);
    return res.status(response.statusCode).json({
      success: response.success,
      message: response.message,
      data: response?.data,
    });
  }
  if (category === "Album") {
    response = await getAllAlbumOfLibrary(currentUser);

    return res.status(200).json({
      success: response.success,
      message: response.message,
      data: response?.data,
    });
  }
  if (category === "Artist") {
    response = await getAllArtistOfLibrary(currentUser);
    return res.status(response.statusCode).json({
      success: response.success,
      message: response.message,
      data: response?.data,
    });
  }
  if (category === "Song") {
    response = await getAllSongOfLibrary(currentUser);
    return res.status(response.statusCode).json({
      success: response.success,
      message: response.message,
      data: response?.data,
    });
  }
};

// const searchItemInLibrary = async (req, res) => {
//   const type = req.params.type;
//   const currentUser = req.user;
//   const name = req.query.name;
//   let libraryData = [];

//   let modelRef = "";
//   try {
//     if (type === "all") {
//       const playlistArray = await LibraryModel.findOne({
//         owner: currentUser.id,
//       }).populate({
//         path: "playlists",
//         populate: { path: "owner", model: UserModel, select: "name" },
//         model: PlaylistModel,
//       });
//       if (playlistArray) {
//         libraryData = [...libraryData, ...playlistArray.playlists];
//       }
//       const artistArray = await LibraryModel.findOne({
//         owner: currentUser.id,
//       }).populate({
//         path: "artists",
//         model: UserModel,
//       });
//       if (artistArray) {
//         libraryData = [...libraryData, ...artistArray.artists];
//       }
//       const songArray = await LibraryModel.findOne({
//         owner: currentUser.id,
//       }).populate({
//         path: "songs",
//         populate: { path: "owner", model: UserModel, select: "name" },
//         model: UserModel,
//       });
//       if (songArray) {
//         libraryData = [...libraryData, ...songArray.songs];
//       }
//       let dataReturn = libraryData.filter((item) => {
//         return item.name.toLowerCase().includes(name.toLowerCase());
//       });
//       if (dataReturn && dataReturn.length > 0) {
//         return res.status(200).json({
//           success: true,
//           message: "search item successfully",
//           data: dataReturn,
//         });
//       }
//     }
//     if (type === "albums") {
//       modelRef = PlaylistModel;
//       let returnData = [];
//       const item = await LibraryModel.findOne({
//         owner: currentUser.id,
//       }).populate({
//         path: "playlists",
//         match: {
//           codeType: "Album",
//           name: {
//             $regex: new RegExp(`^${name}`, "i"),
//             $options: "i",
//           },
//         },
//         populate: { path: "owner", model: UserModel, select: "name" },
//         model: modelRef,
//       });
//       if (item) {
//         returnData = item.playlists;
//         return res.status(200).json({
//           success: true,
//           message: "search item successfully",
//           data: returnData,
//         });
//       }
//     }
//     if (type === "playlists") {
//       modelRef = PlaylistModel;
//       let returnData = [];
//       const item = await LibraryModel.findOne({
//         owner: currentUser.id,
//       }).populate({
//         path: "playlists",
//         match: {
//           name: {
//             $regex: name,
//             $options: "i",
//           },
//           codeType: "Playlist",
//         },
//         populate: { path: "owner", model: UserModel, select: "name" },
//         model: modelRef,
//       });
//       if (item) {
//         returnData = item.playlists;
//         return res.status(200).json({
//           success: true,
//           message: "search item successfully",
//           data: returnData,
//         });
//       }
//     }
//     if (type === "songs") {
//       modelRef = SongModel;
//       let returnData = [];
//       const item = await LibraryModel.findOne({
//         owner: currentUser.id,
//       }).populate({
//         path: "songs",
//         match: {
//           name: {
//             $regex: name,
//             $options: "i",
//           },
//         },
//         populate: { path: "owner", model: UserModel, select: "name" },
//         populate: { path: "artists", model: UserModel, select: "name" },
//         populate: { path: "producers", model: UserModel, select: "name" },
//         populate: { path: "composers", model: UserModel, select: "name" },
//         populate: { path: "genres", model: GenreModel, select: "name" },
//         model: modelRef,
//       });
//       if (item) {
//         returnData = item[type];
//         return res.status(200).json({
//           success: true,
//           message: "search item successfully",
//           data: returnData,
//         });
//       }
//     }
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: `Error from server: ${err.message}`,
//       data: null,
//     });
//   }

//   // const currentUser = req.user;
// };
const searchItemInLibrary = async (req, res) => {
  const type = req.params.type;
  const currentUser = req.user;
  const name = req.query.name;
  const sortBy = req.query.sortBy;
  const sort = req.query.sort;
  let response = await searchItemByName(currentUser, type, name, sortBy, sort);
  return res.status(response.statusCode).json({
    success: response.success,
    message: response.message,
    data: response?.data,
  });
};

const addSongToLibrary = async (req, res) => {
  const currentUser = req.user;
  const songId = req.params.songId;

  try {
    const library = await LibraryModel.findOne({
      owner: currentUser.id,
    });

    let songToAdd = null;
    songToAdd = await SongModel.lean().findById(songId);

    if (songToAdd) {
      library.songs.unshift(songId);
      await library.save();
      return res.status(200).json({
        success: true,
        message: "Song is added to library successfully",
        data: songToAdd,
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

const addPlaylistToLibrary = async (req, res) => {
  const currentUser = req.user;
  const playlistId = req.params.playlistId;
  try {
    const library = await LibraryModel.findOne({
      owner: currentUser.id,
    });
    if (library) {
      const playlistToAdd = await PlaylistModel.findById(playlistId);
      if (playlistToAdd) {
        library.playlists.unshift(playlistId);
        await library.save();
        return res.status(200).json({
          success: true,
          message: "Playlist is added to library successfully",
          data: playlistToAdd,
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

const addAlbumToLibrary = async (req, res) => {
  const currentUser = req.user;
  const albumId = req.params.albumId;
  try {
    const library = await LibraryModel.findOne({
      owner: currentUser.id,
    });
    if (library) {
      const albumToAdd = await PlaylistModel.findOne({ _id: albumId }).lean();
      if (albumToAdd) {
        if (library.albums.includes(albumId)) {
          return res.status(400).json({
            success: false,
            message: "Playlist is already added to library",
            data: null,
          });
        } else {
          library.albums.unshift(albumId);
          await library.save();
          return res.status(200).json({
            success: true,
            message: "Playlist is added to library successfully",
            data: albumToAdd,
          });
        }
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
    const library = await LibraryModel.findById(libraryId);
    const artistToAdd = await UserModel.findOne({ _id: userId }).lean();
    if (artistToAdd) {
      if (library.artists.includes(artistId)) {
        return res.status(400).json({
          success: false,
          message: "Artist is already added to library",
          data: null,
        });
      } else {
        library.artists.unshift(artistId);
        await library.save();
        if (library.artists.length === 1) {
          library.categoryList = "artist";
        }
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
const deleteSongFromLibrary = async (req, res) => {
  const currentUser = req.user;
  const songId = req.params.songId;
  try {
    const library = await LibraryModel.findOne({
      owner: currentUser.id,
    });

    const songToRemove = await SongModel.findById(songId).lean();
    if (songToRemove) {
      if (library.songs.includes(songId)) {
        library.songs.splice(library.songs.indexOf(songId), 1);
        await library.save();
        return res.status(200).json({
          success: true,
          message: "Song is removed from library successfully!",
          data: songToRemove,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Song is not exist in library",
          data: null,
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

const deletePlaylistFromLibrary = async (req, res) => {
  const currentUser = req.user;
  const playlistId = req.params.playlistId;
  try {
    const library = await LibraryModel.findOne({
      owner: currentUser.id,
    });

    const playlistToRemove = await PlaylistModel.findById(playlistId).lean();
    if (playlistToRemove) {
      if (library.playlists.includes(playlistId)) {
        library.playlists.splice(library.playlists.indexOf(playlistId), 1);
        await library.save();
        return res.status(200).json({
          success: true,
          message: "Playlist is removed from library successfully!",
          data: playlistToRemove,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Playlist is not exist in library",
          data: null,
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
  getLibraryData,
  addSongToLibrary,
  addPlaylistToLibrary,
  addArtistToLibrary,
  addAlbumToLibrary,
  deletePlaylistFromLibrary,
  deleteSongFromLibrary,
  searchItemInLibrary,
};
