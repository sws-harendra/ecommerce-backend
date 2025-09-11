const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const { isAuthenticated, isAdmin } = require("../middleware/isAuthenticated");
const { upload } = require("../helpers/multer");

router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Public URL (if serving /uploads statically)
  const fileUrl = req.file.filename;

  res.json({ url: fileUrl });
});

module.exports = router;
