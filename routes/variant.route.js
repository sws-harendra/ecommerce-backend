const express = require("express");
const router = express.Router();
const variantController = require("../controllers/variant.controller");
const { isAuthenticated, isAdmin } = require("../middleware/isAuthenticated");

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

  variantController.createProductVariant
);
router.get(
  "/products/:productId/variants",
  variantController.getProductVariants
);

module.exports = router;
