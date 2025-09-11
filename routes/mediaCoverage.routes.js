const express = require("express");
const router = express.Router();
const mediaCoverageController = require("../controllers/mediaCoverage.controller");
const { upload } = require("../helpers/multer");
const { isAuthenticated, isAdmin } = require("../middleware/isAuthenticated");

// Public routes
router.get("/", mediaCoverageController.getAllMediaCoverages);
router.get("/:id", mediaCoverageController.getMediaCoverageById);

// Protected Admin routes
router.post(
  "/",

  isAuthenticated,
  isAdmin("admin"),
  upload.single("image"),

  mediaCoverageController.createMediaCoverage
);

router.put(
  "/:id",

  isAuthenticated,
  isAdmin("admin"),
  upload.single("image"),

  mediaCoverageController.updateMediaCoverage
);

router.delete(
  "/:id",
  isAuthenticated,
  isAdmin("admin"),
  mediaCoverageController.deleteMediaCoverage
);

router.patch(
  "/:id/toggle-status",
  isAuthenticated,
  isAdmin("admin"),
  mediaCoverageController.toggleMediaCoverageStatus
);

module.exports = router;
