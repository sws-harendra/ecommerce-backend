const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const { isAuthenticated } = require("../middleware/isAuthenticated");

router.post("/", isAuthenticated, cartController.addToCart);
router.get("/", isAuthenticated, cartController.getCart);
router.put("/:id", isAuthenticated, cartController.updateCartItem);
router.delete("/:id", isAuthenticated, cartController.removeFromCart);

module.exports = router;
