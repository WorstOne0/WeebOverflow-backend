const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["Admin", "Moderator", "User", "Guest"],
    default: "Guest",
  },
  screenName: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    required: false,
  },
  thumbnail: {
    type: String,
    required: false,
  },
  thirdParty: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: false,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

UserSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("User", UserSchema);
