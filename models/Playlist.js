const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.ObjectId;

const Playlist = new mongoose.Schema({
  name: { type: String, required: true },
  thumbnail: { type: String, required: true },
  owner: { type: ObjectId, ref: "user", required: true },
  songs: [{ type: ObjectId, ref: "song" }],
  isAlbum: { type: Boolean, default: false },
  artist: { type: ObjectId, ref: "user" },
  collaborators: [{ type: ObjectId, ref: "user" }],
  description: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const PlaylistModel = mongoose.model("Playlist", Playlist);

module.exports = PlaylistModel;
