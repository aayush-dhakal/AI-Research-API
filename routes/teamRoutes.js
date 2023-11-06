const express = require("express");

const { authorize, protect } = require("../middleware/auth");
const {
  createTeam,
  getTeams,
  getTeam,
  updateTeam,
  deleteTeam,
} = require("../controllers/team");

const router = express.Router();

router.route("/").post(protect, authorize("admin"), createTeam);
router.route("/").get(getTeams);
router.route("/:id").get(getTeam);
router
  .route("/:id")
  .put(protect, authorize("admin"), updateTeam)
  .delete(protect, authorize("admin"), deleteTeam);

module.exports = router;
