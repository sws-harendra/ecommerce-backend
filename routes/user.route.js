const express = require("express");
const { isAuthenticated, isAdmin } = require("../middleware/isAuthenticated");
const userController = require("../controllers/user.controller");
const { upload } = require("../helpers/multer");
const catchAsyncErrors = require("../middleware/catchError");

const router = express.Router();

// Auth
router.post(
  "/create-user",
  upload.single("file"),
  catchAsyncErrors(userController.registerUser)
);
router.post("/activation", catchAsyncErrors(userController.activateUser));
router.post("/login-user", catchAsyncErrors(userController.loginUser));
router.get(
  "/getuser",
  isAuthenticated,
  catchAsyncErrors(userController.getUser)
);
router.put(
  "/update-user-info",
  isAuthenticated,
  catchAsyncErrors(userController.updateUserInfo)
);
router.put(
  "/update-avatar",
  isAuthenticated,
  upload.single("image"),
  catchAsyncErrors(userController.updateAvatar)
);
router.put(
  "/update-user-addresses",
  isAuthenticated,
  catchAsyncErrors(userController.updateUserAddress)
);
router.delete(
  "/delete-user-address/:id",
  isAuthenticated,
  catchAsyncErrors(userController.deleteUserAddress)
);
router.put(
  "/update-user-password",
  isAuthenticated,
  catchAsyncErrors(userController.updatePassword)
);
router.get("/user-info/:id", catchAsyncErrors(userController.getUserById));

// Admin
router.get(
  "/admin-all-users",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(userController.getAllUsers)
);
router.delete(
  "/delete-user/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(userController.deleteUser)
);

module.exports = router;
