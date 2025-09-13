const express = require("express");
const router = express.Router();
const testimonialController = require("../controllers/testimonial.controller");
const { isAuthenticated, isAdmin } = require("../middleware/isAuthenticated");
const { upload } = require("../helpers/multer");

// Create
router.post(
  "/create",
  isAuthenticated,
  isAdmin("admin"),
  upload.single("image"),
  testimonialController.createTestimonial
);

// Read
router.get("/", testimonialController.getTestimonials);

// Update
router.put(
  "/update/:id",
  isAuthenticated,
  isAdmin("admin"),
  upload.single("image"),
  testimonialController.updateTestimonial
);

// Delete
router.delete(
  "/delete/:id",
  isAuthenticated,
  isAdmin("admin"),
  testimonialController.deleteTestimonial
);

module.exports = router;
