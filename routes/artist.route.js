const express = require("express");
const router = express.Router();
const artistController = require("../controllers/artist.controller");
const { isAuthenticated, isAdmin } = require("../middleware/isAuthenticated");
const { upload } = require("../helpers/multer");

// Create artist
router.post(
  "/",
  isAuthenticated,
  isAdmin("admin"),
  upload.single("image"),

  artistController.createArtist
);

// Get all artists
router.get("/", artistController.getAllArtists);

// Get artist by id
router.get("/:id", artistController.getArtistById);

// Update artist
router.put(
  "/:id",
  isAuthenticated,
  isAdmin("admin"),
  artistController.updateArtist
);

// Delete artist
router.delete(
  "/:id",
  isAuthenticated,
  isAdmin("admin"),
  artistController.deleteArtist
);

module.exports = router;
