const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const { isAuthenticated, isAdmin } = require("../middleware/isAuthenticated");
const { upload } = require("../helpers/multer");

// CRUD routes
router.post(
  "/",
  upload.array("images"),

  isAuthenticated,
  isAdmin("admin"),
  productController.createProduct
); // Create
router.get(
  "/",
  isAuthenticated,
  isAdmin("admin"),
  productController.getAllProducts
); // Read all
router.get(
  "/:id",
  isAuthenticated,
  isAdmin("admin"),
  productController.getProductById
); // Read one
router.put(
  "/:id",
  isAuthenticated,
  isAdmin("admin"),
  productController.updateProduct
); // Update
router.delete(
  "/:id",
  isAuthenticated,
  isAdmin("admin"),
  productController.deleteProduct
); // Delete

module.exports = router;
