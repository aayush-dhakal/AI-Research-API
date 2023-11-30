const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

// @desc      Register user
// @route     POST /api/auth/register
// @access    Public
exports.register = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    image,
    description,
    googleScholar,
    linkedIn,
    ORCID,
  } = req.body;

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    image,
    description,
    googleScholar,
    linkedIn,
    ORCID,
  });

  sendTokenResponse(user, 200, res);
});

// @desc      Login user
// @route     POST /api/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate emil & password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select("+password"); // here we have to manually add the password coz in model we have defined password's select to false

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid password", 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc      Get all users
// @route     POST /api/v1/auth/users
// @access    Public
exports.getAll = asyncHandler(async (req, res, next) => {
  // /users/sort=name,desc
  // console.log(req.query); // { sort: 'name,desc' }

  // const { sort } = req.query;
  // const sortData = sort.split(",");
  // console.log(sortData);
  // const sortColumn = sortData[0];
  // const sortOrder = sortData[1];

  // use this if you wish to provide multiple sort condition like /users/sort=name,desc&sort=createdAt,ASC
  // Check if sort is a single string or an array
  // const sortConditions = Array.isArray(sort) ? sort : [sort];

  // // Now, you can iterate through each sorting condition
  // sortConditions.forEach((condition) => {
  //   const sortData = condition.split(",");
  //   const sortColumn = sortData[0];
  //   const sortOrder = sortData[1];
  //   // Your sorting logic here
  //   console.log(`Sort column: ${sortColumn}, Sort order: ${sortOrder}`);
  // });

  const { sort } = req.query;

  // after the user is verified the id of that use is set in request object
  // let query = User.find().populate({
  //   path: "posts",
  //   model: "Post",
  // });
  let query = User.find();

  // Check if the sort parameter is provided
  if (sort) {
    const sortData = sort.split(",");
    const sortColumn = sortData[0];
    const sortOrder = sortData[1] || "asc"; // Default to ascending if sortOrder is not provided

    // Apply sorting to the query
    query = query.sort({ [sortColumn]: sortOrder });
  }

  const totalAuthors = await User.countDocuments();

  const users = await query.exec();

  // const users = await User.find().populate({
  //   path: "posts",
  //   model: "Post",
  // });
  // .sort({ createdAt: "desc" });

  res.status(200).json({
    success: true,
    total: totalAuthors,
    data: users,
  });
});

// @desc      Get a user
// @route     POST /api/v1/auth/user/:id
// @access    Public
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Get current logged in user
// @route     POST /api/v1/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
  // after the user is verified the id of that use is set in request object
  // const user = await User.findById(req.user.id).populate({
  //   path: "posts",
  //   model: "Post",
  // });

  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Get current logged in user
// @route     POST /api/v1/auth/user/:id
// @access    Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // returns the newly modified data
    runValidators: true, // runs the validation on update as well
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Get current logged in user
// @route     POST /api/v1/auth/user/:id
// @access    Private
exports.deleteUser = asyncHandler(async (req, res, next) => {
  let user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Log user out / clear cookie
// @route     GET /api/v1/auth/logout
// @access    Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(0),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ), // time is specified in milliseconds. 1 second=1000 milliseconds
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true; // sends in https only in production
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};
