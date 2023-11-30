const express = require("express");

const { authorize, protect } = require("../middleware/auth");
const {
  createPost,
  getPosts,
  getPost,
  getPostsForUser,
  updatePost,
  deletePost,
} = require("../controllers/post");

const router = express.Router();

router.route("/").post(protect, authorize("admin"), createPost);
router.route("/").get(getPosts);
router.route("/:id").get(getPost);
router.route("/user/:id").get(getPostsForUser);
router
  .route("/:id")
  .put(protect, authorize("admin"), updatePost)
  .delete(protect, authorize("admin"), deletePost);

module.exports = router;
