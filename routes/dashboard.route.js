const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");
const { isAuthenticated, isAdmin } = require("../middleware/isAuthenticated");

router.get(
  "/data",
  isAuthenticated,
  isAdmin("admin"),
  dashboardController.getDashboardData
);

module.exports = router;
