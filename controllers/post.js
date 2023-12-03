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

  const { sort, limit, page, topic } = req.query;

  let query = Post.find().populate("user");

  // Check if the sort parameter is provided
  if (sort) {
    const sortData = sort.split(",");
    const sortColumn = sortData[0];
    const sortOrder = sortData[1] || "asc"; // Default to ascending if sortOrder is not provided

    // Apply sorting to the query
    query = query.sort({ [sortColumn]: sortOrder });
  }

  // Apply pagination
  const pageNumber = parseInt(page) || 1; // Default to page 1 if page number is not provided
  const pageSize = parseInt(limit) || 10; // Default to 10 items per page if limit is not provided

  // include this if you want your responses to always include pagination
  // const skip = (pageNumber - 1) * pageSize;

  // this will only apply pagination if pagination data is provided in query if you remove the default values defined above
  if (!isNaN(pageNumber) && !isNaN(pageSize)) {
    const skip = (pageNumber - 1) * pageSize;
    query = query.skip(skip).limit(pageSize);
  }

  // Apply a filter based on the provided topic
  if (topic) {
    query = query.find({ topics: { $in: [topic] } });
  }

  const totalPosts = await Post.countDocuments(query._conditions);

  const posts = await query.exec();

  res.status(200).json({
    success: true,
    total: totalPosts,
    data: posts,
  });
});

// @desc      Get all posts for a author
// @route     GET /api/post/user/id
// @access    Public
exports.getPostsForUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;

  const { sort, limit, page } = req.query;

  let query = Post.find();

  // Add a where condition to filter by user ID
  if (userId) {
    query = query.where("user").equals(userId);
  }

  // Check if the sort parameter is provided
  if (sort) {
    const sortData = sort.split(",");
    const sortColumn = sortData[0];
    const sortOrder = sortData[1] || "asc"; // Default to ascending if sortOrder is not provided

    // Apply sorting to the query
    query = query.sort({ [sortColumn]: sortOrder });
  }

  // Apply pagination
  const pageNumber = parseInt(page) || 1; // Default to page 1 if page number is not provided
  const pageSize = parseInt(limit) || 10; // Default to 10 items per page if limit is not provided

  // include this if you want your responses to always include pagination
  // const skip = (pageNumber - 1) * pageSize;

  // this will only apply pagination if pagination data is provided in query
  if (!isNaN(pageNumber) && !isNaN(pageSize)) {
    const skip = (pageNumber - 1) * pageSize;
    query = query.skip(skip).limit(pageSize);
  }

  const totalPosts = await Post.countDocuments().where("user").equals(userId);

  const posts = await query.exec();

  res.status(200).json({
    success: true,
    total: totalPosts,
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
