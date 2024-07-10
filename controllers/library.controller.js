const LibraryModel = require("../models/Library");
const PlaylistModel = require("../models/Playlist");
const SongModel = require("../models/Song");
const UserModel = require("../models/User");

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
  let libraryData = [];
  let categoryList = [];
  const category = req.query.category;
  const filter = req.query.filter;

  try {
    const playlistArray = await LibraryModel.findOne({
      owner: currentUser.id,
    }).populate({
      path: "playlists",
      populate: { path: "owner", model: UserModel, select: "name" },
      model: PlaylistModel,
    });
    if (playlistArray) {
      libraryData = [...libraryData, ...playlistArray.playlists];

      let playlistArrayItem = playlistArray.playlists.filter((item) => {
        return item.codeType === "Playlist";
      });
      if (playlistArrayItem.length > 0) {
        categoryList.unshift("Playlist");
      }
      let albumArrayItem = playlistArray.playlists.filter((item) => {
        return item.codeType === "Album";
      });
      if (albumArrayItem.length > 0) {
        categoryList.unshift("Album");
      }

      if (category === "Playlist") {
        if (filter === "-createdAt") {
          playlistArrayItem = playlistArrayItem.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
        }
        if (filter === "createdAt") {
          playlistArrayItem = playlistArrayItem.sort((a, b) => {
            return new Date(a.createdAt) - new Date(b.createdAt);
          });
        }
        if (filter === "alphabet") {
          playlistArrayItem = playlistArrayItem.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
        }
        return res.status(200).json({
          success: true,
          message: "Playlist fetched successfully",
          data: {
            libraryData: playlistArrayItem,
            categoryList: categoryList,
          },
        });
      }
      if (category === "Album") {
        console.log("filter:", filter);
        if (filter === "-createdAt") {
          albumArrayItem = albumArrayItem.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
        }
        if (filter === "createdAt") {
          albumArrayItem = albumArrayItem.sort((a, b) => {
            return new Date(a.createdAt) - new Date(b.createdAt);
          });
        }
        if (filter === "alphabet") {
          albumArrayItem = albumArrayItem.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
        }
        return res.status(200).json({
          success: true,
          message: "album fetched successfully",
          data: {
            libraryData: albumArrayItem,
            categoryList: categoryList,
          },
        });
      }
    }

    const artistArray = await LibraryModel.findOne({
      owner: currentUser.id,
    }).populate({
      path: "artists",
      model: UserModel,
    });
    if (artistArray) {
      libraryData = [...libraryData, ...artistArray.artists];
      let artistArrayItem = libraryData.filter((item) => {
        return item.codeType === "Artist";
      });
      if (artistArrayItem.length > 0) {
        categoryList.unshift("Artist");
      }

      if (category === "Artist") {
        return res.status(200).json({
          success: true,
          message: "Library fetched successfully",
          data: {
            libraryData: libraryData,
            categoryList: categoryList,
          },
        });
      }
    }

    const songArray = await LibraryModel.findOne({
      owner: currentUser.id,
    }).populate({
      path: "songs",
      // options: {
      //   sort: {
      //     sortBy: sortOrder,
      //   },
      // },
      model: SongModel,
    });
    if (songArray) {
      libraryData = [...libraryData, ...songArray.songs];
      let ongArrayItem = libraryData.filter((item) => {
        return item.codeType === "Song";
      });
      if (ongArrayItem.length > 0) {
        categoryList.unshift("Song");
      }
      if (category === "Song") {
        return res.status(200).json({
          success: true,
          message: "Library fetched successfully",
          data: songArray.songs,
        });
      }
    }

    if (category === "All") {
      if (filter === "-createdAt") {
        libraryData = libraryData.sort((a, b) => {
          return b.createdAt - a.createdAt;
        });
      }
      if (filter === "createdAt") {
        libraryData = libraryData.sort((a, b) => {
          return a.createdAt - b.createdAt;
        });
      }
      if (filter === "alphabet") {
        libraryData = libraryData.sort((a, b) => a.name.localeCompare(b.name));
      }
      return res.status(200).json({
        success: true,
        message: "Library fetched successfully",
        data: {
          libraryData: libraryData,
          categoryList: categoryList,
        },
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

// const getLibraryData = async (req, res) => {
//   const currentUser = req.user;
//   let libraryData = [];
//   let categoryList = [];
//   const category = req.query.category;
//   const filter = req.query.filter;

//   try {
//     if (category === "Playlist") {
//       let playlistArray = [];
//       if (filter === "createdAt") {
//         playlistArray = await LibraryModel.findOne({
//           owner: currentUser.id,
//         }).populate({
//           path: "playlists",
//           populate: { path: "owner", model: UserModel, select: "name" },
//           match: {
//             codeType: "Playlist",
//           },
//           options: {
//             sort: {
//               createdAt: 1,
//             },
//           },
//           model: PlaylistModel,
//         });
//       }
//       if (filter === "-createdAt") {
//         playlistArray = await LibraryModel.findOne({
//           owner: currentUser.id,
//         }).populate({
//           path: "playlists",
//           populate: { path: "owner", model: UserModel, select: "name" },
//           match: {
//             codeType: "Playlist",
//           },
//           options: {
//             sort: {
//               createdAt: -1,
//             },
//           },
//           model: PlaylistModel,
//         });
//       }
//       if (playlistArray.length > 0) {
//         libraryData = [...libraryData, ...playlistArray.playlists];

//         let playlistArrayItem = playlistArray.playlists.filter((item) => {
//           return item.codeType === "Playlist";
//         });
//         if (playlistArrayItem.length > 0) {
//           categoryList.unshift("Playlist");
//         }
//       }
//       return res.status(200).json({
//         success: true,
//         message: "Library fetched successfully",
//         data: playlistArray,
//       });
//     }
//     if (category === "Album") {
//       let albumArray = [];
//       if (filter === "createdAt") {
//         albumArray = await LibraryModel.findOne({
//           owner: currentUser.id,
//         }).populate({
//           path: "playlists",
//           populate: { path: "owner", model: UserModel, select: "name" },
//           match: {
//             codeType: "Album",
//           },
//           options: {
//             sort: {
//               createdAt: 1,
//             },
//           },
//           model: PlaylistModel,
//         });
//       }
//       if (filter === "-createdAt") {
//         playlistArray = await LibraryModel.findOne({
//           owner: currentUser.id,
//         }).populate({
//           path: "playlists",
//           populate: { path: "owner", model: UserModel, select: "name" },
//           match: {
//             codeType: "Album",
//           },
//           options: {
//             sort: {
//               createdAt: -1,
//             },
//           },
//           model: PlaylistModel,
//         });
//       }
//       if (playlistArray.length > 0) {
//         libraryData = [...libraryData, ...playlistArray.playlists];

//         let playlistArrayItem = playlistArray.playlists.filter((item) => {
//           return item.codeType === "Playlist";
//         });
//         if (playlistArrayItem.length > 0) {
//           categoryList.unshift("Playlist");
//         }
//       }
//       return res.status(200).json({
//         success: true,
//         message: "Library fetched successfully",
//         data: playlistArray,
//       });
//     }

//     // if (playlistArray) {
//     //   libraryData = [...libraryData, ...playlistArray.playlists];

//     //   let playlistArrayItem = playlistArray.playlists.filter((item) => {
//     //     return item.codeType === "Playlist";
//     //   });
//     //   if (playlistArrayItem.length > 0) {
//     //     categoryList.unshift("Playlist");
//     //   }
//     //   let albumArrayItem = playlistArray.playlists.filter((item) => {
//     //     return item.codeType === "Album";
//     //   });
//     //   if (albumArrayItem.length > 0) {
//     //     categoryList.unshift("Album");
//     //   }

//     //   if (category === "Playlist") {
//     //     if (filter === "-createdAt") {
//     //       playlistArrayItem = playlistArrayItem.sort((a, b) => {
//     //         return new Date(b.createdAt) - new Date(a.createdAt);
//     //       });
//     //     }
//     //     if (filter === "createdAt") {
//     //       playlistArrayItem = playlistArrayItem.sort((a, b) => {
//     //         return new Date(a.createdAt) - new Date(b.createdAt);
//     //       });
//     //     }
//     //     if (filter === "alphabet") {
//     //       playlistArrayItem = playlistArrayItem.sort((a, b) =>
//     //         a.name.localeCompare(b.name)
//     //       );
//     //     }
//     //     return res.status(200).json({
//     //       success: true,
//     //       message: "Playlist fetched successfully",
//     //       data: {
//     //         libraryData: playlistArrayItem,
//     //         categoryList: categoryList,
//     //       },
//     //     });
//     //   }
//     //   if (category === "Album") {
//     //     console.log("filter:", filter);
//     //     if (filter === "-createdAt") {
//     //       albumArrayItem = albumArrayItem.sort((a, b) => {
//     //         return new Date(b.createdAt) - new Date(a.createdAt);
//     //       });
//     //     }
//     //     if (filter === "createdAt") {
//     //       albumArrayItem = albumArrayItem.sort((a, b) => {
//     //         return new Date(a.createdAt) - new Date(b.createdAt);
//     //       });
//     //     }
//     //     if (filter === "alphabet") {
//     //       albumArrayItem = albumArrayItem.sort((a, b) =>
//     //         a.name.localeCompare(b.name)
//     //       );
//     //     }
//     //     return res.status(200).json({
//     //       success: true,
//     //       message: "album fetched successfully",
//     //       data: {
//     //         libraryData: albumArrayItem,
//     //         categoryList: categoryList,
//     //       },
//     //     });
//     //   }
//     // }
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: err.message,
//       data: null,
//     });
//   }
// };

const searchItemInLibrary = async (req, res) => {
  const type = req.params.type;
  const currentUser = req.user;
  const name = req.query.name;
  let libraryData = [];

  let modelRef = "";
  try {
    if (type === "all") {
      const playlistArray = await LibraryModel.findOne({
        owner: currentUser.id,
      }).populate({
        path: "playlists",
        populate: { path: "owner", model: UserModel, select: "name" },
        model: PlaylistModel,
      });
      if (playlistArray) {
        libraryData = [...libraryData, ...playlistArray.playlists];
      }
      const artistArray = await LibraryModel.findOne({
        owner: currentUser.id,
      }).populate({
        path: "artists",
        model: UserModel,
      });
      if (artistArray) {
        libraryData = [...libraryData, ...artistArray.artists];
      }
      const songArray = await LibraryModel.findOne({
        owner: currentUser.id,
      }).populate({
        path: "songs",
        populate: { path: "owner", model: UserModel, select: "name" },
        model: UserModel,
      });
      if (songArray) {
        libraryData = [...libraryData, ...songArray.songs];
      }
      let dataReturn = libraryData.filter((item) => {
        return item.name.toLowerCase().includes(name.toLowerCase());
      });
      if (dataReturn && dataReturn.length > 0) {
        return res.status(200).json({
          success: true,
          message: "search item successfully",
          data: dataReturn,
        });
      }
    }
    if (type === "albums") {
      modelRef = PlaylistModel;
      let returnData = [];
      const item = await LibraryModel.findOne({
        owner: currentUser.id,
      }).populate({
        path: "playlists",
        match: {
          codeType: "Album",
          name: {
            $regex: name,
            $options: "i",
          },
        },
        populate: { path: "owner", model: UserModel, select: "name" },
        model: modelRef,
      });
      if (item) {
        returnData = item.playlists;
        return res.status(200).json({
          success: true,
          message: "search item successfully",
          data: returnData,
        });
      }
    }
    if (type === "playlists") {
      modelRef = PlaylistModel;
      let returnData = [];
      const item = await LibraryModel.findOne({
        owner: currentUser.id,
      }).populate({
        path: "playlists",
        match: {
          name: {
            $regex: name,
            $options: "i",
          },
          codeType: "Playlist",
        },
        populate: { path: "owner", model: UserModel, select: "name" },
        model: modelRef,
      });
      if (item) {
        returnData = item.playlists;
        return res.status(200).json({
          success: true,
          message: "search item successfully",
          data: returnData,
        });
      }
    }
    if (type === "songs") {
      modelRef = SongModel;
      let returnData = [];
      const item = await LibraryModel.findOne({
        owner: currentUser.id,
      }).populate({
        path: "songs",
        match: {
          name: {
            $regex: name,
            $options: "i",
          },
        },
        populate: { path: "owner", model: UserModel, select: "name" },
        model: modelRef,
      });
      if (item) {
        returnData = item[type];
        return res.status(200).json({
          success: true,
          message: "search item successfully",
          data: returnData,
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

  // const currentUser = req.user;
};

const addSongToLibrary = async (req, res) => {
  const currentUser = req.user;
  const songId = req.params;

  try {
    const library = await LibraryModel.findOne({
      owner: currentUser.id,
    }).exec();

    const songToAdd = await SongModel.findById(songId).exec();
    if (songToAdd) {
      if (library.songs.includes(songId)) {
        return res.status(400).json({
          success: false,
          message: "Song is already added to library",
          data: null,
        });
      } else {
        library.songs.unshift(songId);
        await library.save();
        return res.status(200).json({
          success: true,
          message: "Song is added to library successfully",
          data: songToAdd,
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
  const playlistId = req.params.playlistId;
  try {
    const library = await LibraryModel.findOne({
      owner: currentUser.id,
    });
    if (library) {
      const playlistToAdd = await PlaylistModel.findOne({ _id: playlistId });
      if (playlistToAdd) {
        if (library.playlists.includes(playlistId)) {
          return res.status(400).json({
            success: false,
            message: "Playlist is already added to library",
            data: null,
          });
        } else {
          library.playlists.unshift(playlistId);
          await library.save();
          return res.status(200).json({
            success: true,
            message: "Playlist is added to library successfully",
            data: playlistToAdd,
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

const addAlbumToLibrary = async (req, res) => {
  const currentUser = req.user;
  const albumId = req.params.albumId;
  try {
    const library = await LibraryModel.findOne({
      owner: currentUser.id,
    });
    if (library) {
      const albumToAdd = await PlaylistModel.findOne({ _id: albumId });
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
    const library = await LibraryModel.findOne({ owner: currentUser.id });

    const songToRemove = await SongModel.findOne({ _id: songId });
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
    const library = await LibraryModel.findOne({ owner: currentUser.id });

    const playlistToRemove = await PlaylistModel.findOne({ _id: playlistId });
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
  deleteSongFromLibrary,
  addAlbumToLibrary,
  deletePlaylistFromLibrary,
  searchItemInLibrary,
};
