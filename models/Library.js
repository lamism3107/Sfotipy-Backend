const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.ObjectId;

//How to creat a model
//Step 1: require mongoose
//Step 2: create a mongoose Schema object
//Step 3: create a mongoose.model
const Library = new mongoose.Schema({
  owner: { type: ObjectId, ref: "user", required: true },
  playlists: [{ type: ObjectId, ref: "playlist" }],
  artists: [{ type: ObjectId, ref: "artist" }],
  songs: [{ type: ObjectId, ref: "song" }],
  favoriteSongs: [{ type: ObjectId, ref: "song" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const LibraryModel = mongoose.model("Library", Library);

module.exports = LibraryModel;
