const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//TODO combine admin and user

const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  createdAt: Date,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
