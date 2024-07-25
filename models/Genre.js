const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.ObjectId;

const Genre = new mongoose.Schema(
  {
    name: { type: String, required: true },
    songs: [{ type: ObjectId, ref: "song" }],
  },
  {
    timestamps: true,
  }
);

const GenreModel = mongoose.model("Genre", Genre);

module.exports = GenreModel;
