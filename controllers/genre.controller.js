const Genre = require("../models/Genre");

const createNewGenre = async (req, res) => {
  const currentUser = req.user;
  const { name, thumbnail } = req.body;
  if (!name) {
    return res.status(301).json({
      success: false,
      message: "Missing required fields",
      data: null,
    });
  }
  const genreData = {
    name,
    thumbnail,
  };
  const genre = await Genre.create(genreData);
  return res.status(200).json({
    success: true,
    message: "Genre created successfully",
    data: genre,
  });
};

const getGenreById = async (req, res) => {
  const genreId = req.params.id;
  await Genre.findById({ _id: genreId })
    .then((genre) => {
      if (genre) {
        return res.status(200).json({
          success: true,
          message: "get genre by Id successfully",
          data: genre,
        });
      } else {
        return res.status(304).json({
          success: false,
          message: "Genre not found",
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

const getAllGenres = async (req, res) => {
  try {
    const genres = await Genre.find().sort({ name: "desc" });
    if (genres) {
      return res.status(200).json({
        success: true,
        message: "Get all genres successfully",
        data: genres,
      });
    } else {
      return res.status(304).json({
        success: false,
        message: "Genres not found",
        data: null,
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
const deleteGenre = (req, res) => {
  const genreId = req.params.id;
  Genre.findByIdAndDelete(genreId)
    .then((genre) => {
      if (genre) {
        return res.status(200).json({
          success: true,
          message: "Genre deleted successfully",
          data: null,
        });
      } else {
        return res.status(304).json({
          success: false,
          message: "Genre not found",
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
module.exports = {
  deleteGenre,
  createNewGenre,
  getGenreById,
  getAllGenres,
};
