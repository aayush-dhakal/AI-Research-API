const asyncHandler = require("../middleware/async");
const Post = require("../models/Post");
const ErrorResponse = require("../utils/errorResponse");

// @desc      Create new post
// @route     POST /api/post
// @access    Private
exports.createPost = asyncHandler(async (req, res, next) => {
  // console.log("user...", req.user);
  // return;
  const post = await Post.create({ ...req.body, user: req.user._id });

  res.status(201).json({
    success: true,
    data: post,
  });
});

// @desc      Get all posts
// @route     GET /api/post
// @access    Public
exports.getPosts = asyncHandler(async (req, res, next) => {
  // to populate post with user, you have to pass use in request so to do it make this route private
  // const posts = await Post.find().populate("user");
  // if you don't want to populate every user field and only want some selected field then do this:
  // const posts = await Post.find().populate({
  //   path: "user",
  //   select: "name description",
  // });

  const posts = await Post.find();

  res.status(200).json({
    success: true,
    count: posts.length,
    data: posts,
  });
});

// @desc      Get single post
// @route     GET /api/post/:id
// @access    Public
exports.getPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id).populate("user");

  // if the id is of correct format but there are no data associated with it then it will so null and a success. So we have to manually throw an error
  if (!post) {
    return next(
      new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: post,
  });
});

// @desc      Update post
// @route     PUT /api/post
// @access    Private
exports.updatePost = asyncHandler(async (req, res, next) => {
  let post = await Post.findById(req.params.id);

  if (!post) {
    return next(
      new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
    );
  }

  post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // returns the newly modified data
    runValidators: true, // runs the validation on update as well
  });

  res.status(200).json({
    success: true,
    data: post,
  });
});

// @desc      Delete post
// @route     DELETE /api/v1/post/:id
// @access    Private
exports.deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findByIdAndDelete(req.params.id);

  if (!post) {
    return next(
      new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: post,
  });
});
