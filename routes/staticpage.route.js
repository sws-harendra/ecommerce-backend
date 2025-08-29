// routes/pageRoutes.js
const express = require("express");
const router = express.Router();
const pageController = require("../controllers/staticPage.controller");
const { isAuthenticated, isAdmin } = require("../middleware/isAuthenticated");

// Create or Update Page
router.post(
  "/",
  isAuthenticated,
  isAdmin("admin"),
  pageController.createOrUpdatePage
);

// Get all pages
router.get("/", pageController.getAllPages);

// Get single page by slug
router.get("/:slug", pageController.getPageBySlug);

module.exports = router;
