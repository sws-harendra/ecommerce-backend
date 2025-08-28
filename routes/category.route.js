const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const { isAuthenticated, isAdmin } = require("../middleware/isAuthenticated");

router.post(
  "/",
  isAuthenticated,
  isAdmin("admin"),
  categoryController.createCategory
);
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.put(
  "/:id",
  isAuthenticated,
  isAdmin("admin"),
  categoryController.updateCategory
);
router.delete(
  "/:id",
  isAuthenticated,
  isAdmin("admin"),
  categoryController.deleteCategory
);

module.exports = router;
