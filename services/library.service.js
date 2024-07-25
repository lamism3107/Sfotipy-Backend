const GenreModel = require("../models/Genre");
const LibraryModel = require("../models/Library");
const PlaylistModel = require("../models/Playlist");
const SongModel = require("../models/Song");
const UserModel = require("../models/User");

const getCategoryList = async (currentUser) => {
  let categoryList = [];
  try {
    const library = await LibraryModel.findOne({
      owner: currentUser.id,
    })
      .lean()
      .populate([
        {
          path: "playlists",
          // populate: {
          //   path: "owner",
          //   model: UserModel,
          //   select: ["codeType"],
          // },
          model: PlaylistModel,
        },
        {
          path: "songs",
          model: SongModel,
        },
        {
          path: "artists",
          model: UserModel,
        },
      ]);
    if (library) {
      let playlistIndex = library.playlists.findIndex(
        (item) => item.codeType === "Playlist"
      );
      if (playlistIndex !== -1) {
        categoryList = [...categoryList, "Playlist"];
      }
      let albumIndex = library.playlists.findIndex(
        (item) => item.codeType === "Album"
      );
      if (albumIndex !== -1) {
        categoryList = [...categoryList, "Album"];
      }
      if (library.songs.length > 0) {
        categoryList = [...categoryList, "Song"];
      }
      if (library.artists.length > 0) {
        categoryList = [...categoryList, "Artist"];
      }
    }
  } catch (err) {
    return null;
  }
  return categoryList;
};
const getAllLibraryData = async (currentUser) => {
  let libraryData = [];
  let categoryList = [];
  try {
    const library = await LibraryModel.findOne({
      owner: currentUser.id,
    })
      .lean()
      .populate([
        {
          path: "playlists",
          populate: {
            path: "owner",
            model: UserModel,
            select: "name",
          },
          model: PlaylistModel,
        },
        {
          path: "songs",
          populate: [
            { path: "owner", model: UserModel, select: "name" },
            { path: "artists", model: UserModel, select: "name" },
            ,
            { path: "producers", model: UserModel, select: "name" },
            { path: "composers", model: UserModel, select: "name" },
            { path: "genres", model: GenreModel, select: "name" },
          ],
          model: SongModel,
        },
        {
          path: "artists",
          model: UserModel,
        },
      ]);

    if (library) {
      categoryList = await getCategoryList(currentUser);
      libraryData = [...libraryData, ...library.playlists];
      libraryData = [...libraryData, ...library.songs];
      libraryData = [...libraryData, ...library.artists];
      // if (sortBy === "createdAt" && sort === "desc") {
      libraryData = libraryData.sort((a, b) => {
        return b.createdAt - a.createdAt;
      });
      // }
      // if (sortBy === "createdAt" && sort === "asc") {
      //   libraryData = libraryData.sort((a, b) => {
      //     return a.createdAt - b.createdAt;
      //   });
      // }
      // if (sortBy === "name" && sort === "asc") {
      //   libraryData = libraryData.sort((a, b) => a.name.localeCompare(b.name));
      // }
      return {
        statusCode: 200,
        success: true,
        message: "Library fetched successfully",
        data: {
          libraryData: libraryData,
          categoryList: categoryList,
        },
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      success: false,
      message: err.message,
    };
  }
};
const getAllPlaylistOfLibrary = async (currentUser) => {
  let categoryList = [];
  const sortObject = {};
  // sortObject[sortBy] = sort;
  try {
    const library = await LibraryModel.findOne({
      owner: currentUser.id,
    })
      .lean()
      .populate({
        path: "playlists",
        populate: {
          path: "owner",
          model: UserModel,
          select: "name",
        },
        match: {
          codeType: "Playlist",
        },
        options: {
          createdAt: -1,
        },
        model: PlaylistModel,
      });
    if (library) {
      categoryList = await getCategoryList(currentUser);
      return {
        statusCode: 200,
        success: true,
        message: "Library fetched successfully",
        data: {
          libraryData: library.playlists,
          categoryList: categoryList,
        },
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      success: false,
      message: err.message,
    };
  }
};

const getAllAlbumOfLibrary = async (currentUser) => {
  let categoryList = [];
  // const sortObject = {};
  let response = {};
  // sortObject[sortBy] = sort;
  try {
    const library = await LibraryModel.findOne({
      owner: currentUser.id,
    })
      .lean()
      .populate({
        path: "playlists",
        populate: {
          path: "owner",
          model: UserModel,
          select: "name",
        },
        match: {
          codeType: "Album",
        },
        options: {
          createdAt: -1,
        },
        model: PlaylistModel,
      });
    if (library) {
      categoryList = await getCategoryList(currentUser);
      response = {
        statusCode: 200,
        success: true,
        message: "Library fetched successfully",
        data: {
          libraryData: library.playlists,
          categoryList: categoryList,
        },
      };
      return response;
    }
  } catch (err) {
    return {
      statusCode: 500,
      success: false,
      message: err.message,
    };
  }
};
const getAllArtistOfLibrary = async (currentUser) => {
  let categoryList = [];
  // const sortObject = {};
  // sortObject[sortBy] = sort;
  try {
    const library = await LibraryModel.findOne({
      owner: currentUser.id,
    })
      .lean()
      .populate({
        path: "artists",
        options: {
          createdAt: -1,
        },
        model: UserModel,
      });
    if (library) {
      categoryList = await getCategoryList(currentUser);
      return {
        statusCode: 200,
        success: true,
        message: "Library fetched successfully",
        data: {
          libraryData: library.artists,
          categoryList: categoryList,
        },
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      success: false,
      message: err.message,
    };
  }
};

const getAllSongOfLibrary = async (currentUser) => {
  let categoryList = [];
  // const sortObject = {};
  // sortObject[sortBy] = sort;
  try {
    const library = await LibraryModel.findOne({
      owner: currentUser.id,
    })
      .lean()
      .populate({
        path: "songs",
        populate: [
          { path: "owner", model: UserModel, select: "name" },
          { path: "artists", model: UserModel, select: "name" },
          ,
          { path: "producers", model: UserModel, select: "name" },
          { path: "composers", model: UserModel, select: "name" },
          { path: "genres", model: GenreModel, select: "name" },
        ],
        options: {
          sort: {
            createdAt: -1,
          },
        },
        model: SongModel,
      });
    if (library) {
      categoryList = await getCategoryList(currentUser);
      return {
        statusCode: 200,
        success: true,
        message: "Library fetched successfully",
        data: {
          libraryData: library.songs,
          categoryList: categoryList,
        },
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      success: false,
      message: err.message,
    };
  }
};

const searchItemByName = async (currentUser, type, name, sort, sortBy) => {
  try {
    let returnData = [];
    if (type === "all") {
      const library = await LibraryModel.findOne({
        owner: currentUser.id,
      })
        .lean()
        .populate([
          {
            path: "playlists",
            match: {
              name: {
                $regex: new RegExp(`${name}`, "gi"),
              },
            },
            populate: {
              path: "owner",
              model: UserModel,
              select: "name",
            },
            model: PlaylistModel,
          },
          {
            path: "songs",
            match: {
              name: {
                $regex: new RegExp(`${name}`, "gi"),
              },
            },
            populate: [{ path: "artists", model: UserModel, select: "name" }],
            model: SongModel,
          },
          {
            path: "artists",
            match: {
              name: {
                $regex: new RegExp(`${name}`, "gi"),
              },
            },
            model: UserModel,
          },
        ]);
      if (library) {
        let libraryData = [];
        libraryData = [...libraryData, ...library.playlists];
        libraryData = [...libraryData, ...library.songs];
        libraryData = [...libraryData, ...library.artists];
        if (sortBy === "createdAt" && sort === "desc") {
          libraryData = libraryData.sort((a, b) => {
            return b.createdAt - a.createdAt;
          });
        }
        if (sortBy === "createdAt" && sort === "asc") {
          libraryData = libraryData.sort((a, b) => {
            return a.createdAt - b.createdAt;
          });
        }
        if (sortBy === "name" && sort === "asc") {
          libraryData = libraryData.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
        }
        returnData = libraryData;
        return {
          statusCode: 200,
          success: true,
          message: "Search item successfully",
          data: returnData,
        };
      }
    }
    if (type === "albums" || type === "playlists") {
      let codeType = "";
      let sortObject = {};
      sortObject[sortBy] = sort;
      if (type === "albums") codeType = "Album";
      if (type === "playlists") codeType = "Playlist";
      const library = await LibraryModel.findOne({
        owner: currentUser.id,
      }).populate({
        path: "playlists",
        match: {
          codeType: codeType,
          name: {
            $regex: new RegExp(`^${name}`, "gi"),
          },
        },
        options: {
          sort: sortObject,
        },

        populate: { path: "owner", model: UserModel, select: "name" },
        model: PlaylistModel,
      });
      if (library) {
        returnData = library.playlists;
        return {
          statusCode: 200,
          success: true,
          message: "Search item successfully",
          data: returnData,
        };
      }
    }
    if (type === "songs") {
      let sortObject = {};
      sortObject[sortBy] = sort;
      modelRef = SongModel;
      let returnData = [];
      const library = await LibraryModel.findOne({
        owner: currentUser.id,
      }).populate({
        path: "songs",
        match: {
          name: {
            $regex: name,
            $options: "gi",
          },
        },
        options: {
          sort: sortObject,
        },
        populate: { path: "artists", model: UserModel, select: "name" },
        populate: { path: "producers", model: UserModel, select: "name" },
        populate: { path: "composers", model: UserModel, select: "name" },
        populate: { path: "genres", model: GenreModel, select: "name" },
        model: modelRef,
      });

      if (library) {
        returnData = library.songs;
        return {
          statusCode: 200,
          success: true,
          message: "Search item successfully",
          data: returnData,
        };
      }
    }
  } catch (err) {
    return {
      statusCode: 500,
      success: false,
      message: err.message,
    };
  }
};
module.exports = {
  getAllLibraryData,
  getAllPlaylistOfLibrary,
  getAllAlbumOfLibrary,
  getAllArtistOfLibrary,
  getAllSongOfLibrary,
  searchItemByName,
};
