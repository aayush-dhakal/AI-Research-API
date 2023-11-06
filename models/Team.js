const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const TeamSchema = new mongoose.Schema(
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
    description: {
      required: [true, "Please add a description"],
      type: String,
    },
    image: {
      type: String,
    },
    googleScholar: {
      type: String,
    },
    linkedIn: {
      type: String,
    },
    ORCID: {
      type: String,
    },
  },
  {
    timestamps: true,
    // toJSON: { virtuals: true },
    // toObject: { virtuals: true },
  }
);

// Reverse populate with virtuals. Basically get all the posts associated with the Team.
// virtual creates a virtual field(meaning the field will not actually gonna be in the database collection) only for quering
// TeamSchema.virtual("posts", {
//   // posts will the field name for team schema
//   ref: "Post", // Model from where you want to populate
//   localField: "_id", // primary key field of team model
//   foreignField: "team", // the foreign key in Post model which references to team
// });

module.exports = mongoose.model("Team", TeamSchema);
