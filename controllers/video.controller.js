const { Video, Product } = require("../models");
const path = require("path");
const fs = require("fs");

exports.createVideo = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "Video file is required" });
    if (!req.body.productId)
      return res.status(400).json({ message: "productId is required" });

    const video = await Video.create({
      videoUrl: `/videos/${req.file.filename}`, // relative path
      productId: req.body.productId,
    });

    res.status(201).json(video);
  } catch (err) {
    console.error("❌ Error creating video:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.findAll({
      include: {
        model: Product,
      },
    });
    res.status(200).json(videos);
  } catch (err) {
    console.error("❌ Error fetching videos:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getVideoById = async (req, res) => {
  try {
    const video = await Video.findByPk(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });
    res.json(video);
  } catch (err) {
    console.error("❌ Error fetching video:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateVideo = async (req, res) => {
  try {
    const video = await Video.findByPk(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    // If new video uploaded, replace file path
    if (req.file) {
      // remove old file if exists
      const oldPath = path.join(__dirname, "..", video.videoUrl);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

      video.videoUrl = `/uploads/videos/${req.file.filename}`;
    }

    // Update productId if passed
    if (req.body.productId) {
      video.productId = req.body.productId;
    }

    await video.save();
    res.json(video);
  } catch (err) {
    console.error("❌ Error updating video:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    const video = await Video.findByPk(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    // delete file from disk
    const filePath = path.join(__dirname, "..", video.videoUrl);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await video.destroy();
    res.json({ message: "Video deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting video:", err);
    res.status(500).json({ message: "Server error" });
  }
};
