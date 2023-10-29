const asyncHandler = require("../middleware/async");
const Post = require("../models/Post");
const ErrorResponse = require("../utils/errorResponse");

// @desc      Create new post
// @route     POST /api/post
// @access    Private
exports.createPost = asyncHandler(async (req, res, next) => {
  const post = await Post.create(req.body);

  res.status(201).json({
    success: true,
    data: post,
  });
});

// @desc      Get all posts
// @route     GET /api/post
// @access    Public
exports.getPosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find().populate("author");
  // if you don't want to populate every author field and only want some selected field then do this:
  // const posts = await Post.find().populate({
  //   path: "author",
  //   select: "name description",
  // });

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
  const post = await Post.findById(req.params.id).populate("author");

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
