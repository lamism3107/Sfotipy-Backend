const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.ObjectId;

const Playlist = new mongoose.Schema({
  name: { type: String, required: true },
  thumbnail: { type: String },
  owner: { type: ObjectId, ref: "user", required: true },
  songs: [
    {
      songId: { type: ObjectId, ref: "song" },
      addDate: { type: Date, default: Date.now() },
    },
  ],
  codeType: { type: String, required: true },
  artist: { type: ObjectId, ref: "user" },
  collaborators: [{ type: ObjectId, ref: "user" }],
  description: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const PlaylistModel = mongoose.model("Playlist", Playlist);

module.exports = PlaylistModel;
