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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Reverse populate with virtuals. Basically get all the posts associated with the Author.
// virtual creates a virtual field(meaning the field will not actually gonna be in the database collection) only for quering
AuthorSchema.virtual("posts", {
  // posts will the field name for author schema
  ref: "Post", // Model from where you want to populate
  localField: "_id", // primary key field of author model
  foreignField: "author", // the foreign key in Post model which references to author
});

module.exports = mongoose.model("Author", AuthorSchema);
