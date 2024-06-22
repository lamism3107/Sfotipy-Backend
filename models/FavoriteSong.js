const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.ObjectId;

//How to creat a model
//Step 1: require mongoose
//Step 2: create a mongoose Schema object
//Step 3: create a mongoose.model
const FavoriteSong = new mongoose.Schema({
  song: { type: ObjectId, ref: "song" },
  user: { type: ObjectId, ref: "user" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const UserModel = mongoose.model("FavoriteSong", FavoriteSong);

module.exports = UserModel;
