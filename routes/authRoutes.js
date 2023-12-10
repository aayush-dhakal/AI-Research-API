const express = require("express");
const {
  register,
  login,
  getMe,
  getAll,
  logout,
  updateUser,
  deleteUser,
  getUser,
} = require("../controllers/auth");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/users", getAll);
router.get("/user/:id", getUser);
router.get("/me", protect, getMe);
router.put("/user/:id", protect, updateUser);
router.delete("/user/:id", protect, deleteUser);

module.exports = router;
