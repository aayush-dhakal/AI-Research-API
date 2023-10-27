const express = require("express");

const { authorize, protect } = require("../middleware/auth");
const {
  createAuthor,
  getAuthors,
  getAuthor,
  updateAuthor,
  deleteAuthor,
} = require("../controllers/author");

const router = express.Router();

router.route("/").post(protect, authorize("admin"), createAuthor);
router.route("/").get(getAuthors);
router.route("/:id").get(getAuthor);
router
  .route("/:id")
  .put(protect, authorize("admin"), updateAuthor)
  .delete(protect, authorize("admin"), deleteAuthor);

module.exports = router;
