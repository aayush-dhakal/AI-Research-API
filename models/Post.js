const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const PostSchema = new mongoose.Schema(
  {
    // this will be used as an index in mongodb and will be unique for each document
    uniqueId: {
      type: String,
      unique: true,
      default: uuidv4, // Generate a unique UUID as a default value
    },
    title: {
      type: String,
      required: [true, "Please add a title"],
    },
    description: {
      required: [true, "Please add a description"],
      type: String,
    },
    topics: {
      required: [true, "Please add topics"],
      type: [String],
    },
    coverImage: {
      type: String,
    },
    // postedBy: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: "Team",
    //   required: true,
    // },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", PostSchema);
