const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  createUser,
  getUserById,
  deleteUserById,
  login,
} = require("../controllers/userController.js");

router.route("/").get(getAllUsers);
router.route("/").post(createUser);
router.route("/:userId").get(getUserById);
router.route("/:userId").delete(deleteUserById);
router.route("/login").post(login);

module.exports = router;
