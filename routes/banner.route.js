const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/banner.controller");
const { isAuthenticated, isAdmin } = require("../middleware/isAuthenticated");
const { upload } = require("../helpers/multer");

// CRUD routes
router.post(
  "/create-banner",
  isAuthenticated,
  isAdmin("admin"),
  upload.single("image"),

  bannerController.createBanner
);
router.get("/", bannerController.getBanners);
router.get(
  "/:id",
  isAuthenticated,
  isAdmin("admin"),
  bannerController.getBannerById
);
router.put(
  "/:id",
  isAuthenticated,
  isAdmin("admin"),
  upload.single("image"),

  bannerController.updateBanner
);
router.delete(
  "/:id",
  isAuthenticated,
  isAdmin("admin"),
  bannerController.deleteBanner
);

module.exports = router;
