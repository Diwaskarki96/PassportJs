const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String },
  username: { type: String },
  password: { type: String },
});
const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
