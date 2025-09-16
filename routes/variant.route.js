const express = require("express");
const router = express.Router();
const variantController = require("../controllers/variant.controller");
const { isAuthenticated, isAdmin } = require("../middleware/isAuthenticated");
const { upload } = require("../helpers/multer");

// Variant Categories
router.post(
  "/categories",

  variantController.createVariantCategory
);
router.get("/categories", variantController.getAllVariantCategories);

// Variant Options
router.post(
  "/options",

  variantController.createVariantOption
);
router.get("/options", variantController.getAllVariantOptions);

// Product Variants
router.post(
  "/products/:productId/variants",
  upload.single("images"), // "media" field name, max 10 files

  variantController.createProductVariant
);
router.get(
  "/products/:productId/variants",
  variantController.getProductVariants
);
router.delete("/variants/:id", variantController.deleteProductVariant);

// Update variant (with optional image upload)
router.put(
  "/variants/:id",
  upload.single("image"),
  variantController.updateProductVariant
);
// Variant Categories
router.delete("/categories/:id", variantController.deleteVariantCategory);

// Variant Options
router.delete("/options/:id", variantController.deleteVariantOption);

module.exports = router;
