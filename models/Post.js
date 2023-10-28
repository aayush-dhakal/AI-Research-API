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
    topic: {
      required: [true, "Please add topics"],
      type: [String],
    },
    description: {
      required: [true, "Please add a description"],
      type: String,
    },
    coverImage: {
      type: String,
    },
    blogImages: {
      type: [String],
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "Author",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", PostSchema);
