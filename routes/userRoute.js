const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  createUsers,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe
} = require("./../controllers/userController");
const {
  signUp,
  login,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
} = require("./../controllers/authController");

router.route("/signup").post(signUp);
router.route("/login").post(login);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:token").patch(resetPassword);
router.route("/updateMyPassword").patch(protect,updatePassword);
router.route('/updateMe').patch(protect, updateMe)
router.route('/deleteMe').delete(protect, deleteMe)

router.route("/").get(getAllUsers).post(createUsers);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
