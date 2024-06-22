const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.ObjectId;

const Song = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  songURL: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  album: {
    type: ObjectId,
    ref: "playlist",
  },
  artist: {
    type: ObjectId,
    ref: "user",
    required: true,
  },
  categoryList: [{ type: ObjectId, ref: "category" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const SongModel = mongoose.model("Song", Song);

module.exports = SongModel;
