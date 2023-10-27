const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const AuthorSchema = new mongoose.Schema(
  {
    // this will be used as an index in mongodb and will be unique for each document
    uniqueId: {
      type: String,
      unique: true,
      default: uuidv4, // Generate a unique UUID as a default value
    },
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    topic: {
      required: [true, "Please add topics"],
      type: [String],
    },
    description: {
      required: [true, "Please add a description"],
      type: String,
    },
    image: {
      type: String,
    },
    facebook: {
      type: String,
    },
    twitter: {
      type: String,
    },
    instagram: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Author", AuthorSchema);
