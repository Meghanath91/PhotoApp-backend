const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let User = new Schema({
  username: { type: String, default: "", trim: true },
  email: { type: String, default: "", trim: true },
  password: { type: String, default: "", trim: true },
  address: { type: String, default: "", trim: true },
  image: { type: String, default: "" },
});

module.exports = mongoose.model("User", User);
