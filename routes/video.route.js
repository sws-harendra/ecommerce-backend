const express = require("express");
const router = express.Router();
const { uploadVideo } = require("../helpers/multerVideo");
const videoController = require("../controllers/video.controller");

// Create (upload video)
router.post("/", uploadVideo.single("video"), videoController.createVideo);

// Get all videos
router.get("/", videoController.getAllVideos);

// Get single video by ID
router.get("/:id", videoController.getVideoById);

// Update video (replace file or productId)
router.put("/:id", uploadVideo.single("video"), videoController.updateVideo);

// Delete video
router.delete("/:id", videoController.deleteVideo);

module.exports = router;
