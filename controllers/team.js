const asyncHandler = require("../middleware/async");
const Team = require("../models/Team");
const Post = require("../models/Post");
const ErrorResponse = require("../utils/errorResponse");

// @desc      Create new team
// @route     POST /api/team
// @access    Private
exports.createTeam = asyncHandler(async (req, res, next) => {
  const team = await Team.create(req.body);

  res.status(201).json({
    success: true,
    data: team,
  });
});

// @desc      Get all teams
// @route     GET /api/team
// @access    Public
exports.getTeams = asyncHandler(async (req, res, next) => {
  const teams = await Team.find();

  res.status(200).json({
    success: true,
    count: teams.length,
    data: teams,
  });
});

// @desc      Get single team
// @route     GET /api/team/:id
// @access    Public
exports.getTeam = asyncHandler(async (req, res, next) => {
  const team = await Team.findById(req.params.id);

  // if the id is of correct format but there are no data associated with it then it will so null and a success. So we have to manually throw an error
  if (!team) {
    return next(
      new ErrorResponse(`Team not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: team,
  });
});

// @desc      Update team
// @route     PUT /api/team
// @access    Private
exports.updateTeam = asyncHandler(async (req, res, next) => {
  let team = await Team.findById(req.params.id);

  if (!team) {
    return next(
      new ErrorResponse(`Team not found with id of ${req.params.id}`, 404)
    );
  }

  team = await Team.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // returns the newly modified data
    runValidators: true, // runs the validation on update as well
  });

  res.status(200).json({
    success: true,
    data: team,
  });
});

// @desc      Delete team
// @route     DELETE /api/v1/team/:id
// @access    Private
exports.deleteTeam = asyncHandler(async (req, res, next) => {
  // if we use findByIdAndDelete then the pre middleware will not trigger, the one we are using for deleting the blogs when the team is deleted in Team model so use find by Id then call remove function manually
  // const team = await Team.findByIdAndDelete(req.params.id);
  const team = await Team.findById(req.params.id);

  if (!team) {
    return next(
      new ErrorResponse(`Team not found with id of ${req.params.id}`, 404)
    );
  }

  // Cascading posts when team is deleted by using deleteMany to remove all the associated posts of the team that is to be deleted
  await Post.deleteMany({ team: team._id });

  // remove is depricated so we delete posts in controller itself and use deleteOne. maybe you can use deleteOne here to delete team and call remove middleware hook in schema to delete posts
  await team.deleteOne();

  res.status(200).json({
    success: true,
    data: team,
  });
});
