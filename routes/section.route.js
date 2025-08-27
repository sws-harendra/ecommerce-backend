// routes/sectionRoutes.js
const express = require("express");
const router = express.Router();
const { isAuthenticated, isAdmin } = require("../middleware/isAuthenticated");
const sectionController = require("../controllers/section.controller");

router.post(
  "/",
  isAuthenticated,
  isAdmin("admin"),
  sectionController.createSection
);
router.get("/", sectionController.getSections); // for homepage
router.get("/:id", sectionController.getSectionById);
router.put(
  "/:id",
  isAuthenticated,
  isAdmin("admin"),
  sectionController.updateSection
);
router.delete(
  "/:id",
  isAuthenticated,
  isAdmin("admin"),
  sectionController.deleteSection
);

module.exports = router;
