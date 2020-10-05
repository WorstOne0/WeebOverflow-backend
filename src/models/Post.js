const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const PostSchema = new mongoose.Schema({
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: [Object],
    required: false,
  },
  text: {
    type: [Object],
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
  likes: {
    type: String,
    required: true,
  },
  comments: {
    type: String,
    required: true,
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

PostSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Post", PostSchema);
