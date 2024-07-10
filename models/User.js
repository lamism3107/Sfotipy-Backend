const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.ObjectId;

//How to creat a model
//Step 1: require mongoose
//Step 2: create a mongoose Schema object
//Step 3: create a mongoose.model
const User = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  imgURL: { type: String, default: "" },
  // username: { type: String },
  password: { type: String, default: "" },
  refreshToken: { type: [String], default: [] },
  codeType: { type: String, required: true },
  // dateOfBirth: { type: Date },
  artistDesc: { type: String, default: "" },
  gender: { type: String },
  followedUser: [{ type: ObjectId, ref: "User" }],
  role: { type: String, required: true },
  email_verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const UserModel = mongoose.model("User", User);

module.exports = UserModel;
