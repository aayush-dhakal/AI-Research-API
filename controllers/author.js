const asyncHandler = require("../middleware/async");
const Author = require("../models/Author");
const ErrorResponse = require("../utils/errorResponse");

// @desc      Create new author
// @route     POST /api/author
// @access    Private
exports.createAuthor = asyncHandler(async (req, res, next) => {
  const author = await Author.create(req.body);

  res.status(201).json({
    success: true,
    data: author,
  });
});

// @desc      Get all authors
// @route     GET /api/author
// @access    Public
exports.getAuthors = asyncHandler(async (req, res, next) => {
  const authors = await Author.find();

  res.status(200).json({
    success: true,
    count: authors.length,
    data: authors,
  });
});

// @desc      Get single author
// @route     GET /api/author/:id
// @access    Public
exports.getAuthor = asyncHandler(async (req, res, next) => {
  const author = await Author.findById(req.params.id);

  // if the id is of correct format but there are no data associated with it then it will so null and a success. So we have to manually throw an error
  if (!author) {
    return next(
      new ErrorResponse(`Author not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: author,
  });
});

// @desc      Update author
// @route     PUT /api/author
// @access    Private
exports.updateAuthor = asyncHandler(async (req, res, next) => {
  let author = await Author.findById(req.params.id);

  if (!author) {
    return next(
      new ErrorResponse(`Author not found with id of ${req.params.id}`, 404)
    );
  }

  author = await Author.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // returns the newly modified data
    runValidators: true, // runs the validation on update as well
  });

  res.status(200).json({
    success: true,
    data: author,
  });
});

// @desc      Delete author
// @route     DELETE /api/v1/author/:id
// @access    Private
exports.deleteAuthor = asyncHandler(async (req, res, next) => {
  // TODO
  // if we use findByIdAndDelete then the pre middleware will not trigger, the one we are using for deleting the blogs when the author is deleted in Author model so use find by Id then call remove function manually

  const author = await Author.findByIdAndDelete(req.params.id);
  // const author = await Author.findById(req.params.id);

  if (!author) {
    return next(
      new ErrorResponse(`Author not found with id of ${req.params.id}`, 404)
    );
  }

  // this will trigger the middleware
  // author.remove();

  res.status(200).json({
    success: true,
    data: author,
  });
});
