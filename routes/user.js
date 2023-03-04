const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  createUser,
  getUserById,
  deleteUserById,
  login,
  register,
  updateUserById,
  getUserCount,
} = require("../controllers/userController.js");
const {
  isAuthenticatedUser,
  authorizeRole,
} = require("../middlewares/auth.js");

router.route("/").get(isAuthenticatedUser, getAllUsers);
// router.route("/").post(isAuthenticatedUser, authorizeRole("admin"), createUser);
router.route("/:userId").get(getUserById);
router
  .route("/:userId")
  .delete(isAuthenticatedUser, authorizeRole("admin"), deleteUserById);
router.route("/login").post(login);
router.route("/register").post(register);
router.route("/:userId").put(isAuthenticatedUser, updateUserById);
router.route("/get/count").get(isAuthenticatedUser, getUserCount);
router
  .route("/:userId")
  .delete(isAuthenticatedUser, authorizeRole("admin"), deleteUserById);

module.exports = router;
