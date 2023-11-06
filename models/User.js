const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const UserSchema = new mongoose.Schema(
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
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // absolutely need these to populate with virtuals
    toObject: { virtuals: true },
  }
);

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    // we need this validation to check for generating forgot password token as there no password is provided to hash so we want to skip the password hashing
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  // this is defined in method level and not statically so to access this method we have to call it on user(not the User model but the one where query is executed)
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// util function to compare password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Reverse populate with virtuals. Basically get all the posts associated with the User.
// virtual creates a virtual field(meaning the field will not actually gonna be in the database collection) only for quering
UserSchema.virtual("posts", {
  // posts will the field name for user schema
  ref: "Post", // Model from where you want to populate
  localField: "_id", // primary key field of user model
  foreignField: "user", // the foreign key in Post model which references to user
});

module.exports = mongoose.model("User", UserSchema);
