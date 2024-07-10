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
  length: { type: Number },
  owner: {
    type: ObjectId,
    ref: "user",
    required: true,
  },
  artists: [
    {
      type: ObjectId,
      ref: "user",
    },
  ],
  composer: {
    type: String,
    default: "",
  },
  producer: {
    type: String,
    default: "",
  },
  codeType: { type: String, required: true, default: "Song" },
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
  playCount: {
    type: Number,
    required: true,
    default: 0,
  },
  description: { type: String, default: "" },
  categoryList: [{ type: ObjectId, ref: "category" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const SongModel = mongoose.model("Song", Song);

module.exports = SongModel;
