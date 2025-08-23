const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const { isAuthenticated, isAdmin } = require("../middleware/isAuthenticated");

router.post("/place", isAuthenticated, orderController.createOrder);

module.exports = router;
