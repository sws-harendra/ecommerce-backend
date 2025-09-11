const { MediaCoverage } = require("../models");
const path = require("path");
const fs = require("fs");

// Create a new media coverage entry
(exports.createMediaCoverage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const { title, url } = req.body;

    const imageUrl = req.file.filename;

    const mediaCoverage = await MediaCoverage.create({
      title,
      imageUrl,
      url,
    });

    res.status(201).json({
      success: true,
      data: mediaCoverage,
    });
  } catch (error) {
    // Delete the uploaded file if an error occurs
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}),
  // Get all media coverages
  (exports.getAllMediaCoverages = async (req, res) => {
    try {
      const { isActive } = req.query;
      const whereClause = {};

      if (isActive !== undefined) {
        whereClause.isActive = isActive === "true";
      }

      const mediaCoverages = await MediaCoverage.findAll({
        where: whereClause,
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({
        success: true,
        data: mediaCoverages,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });

// Get a single media coverage by ID
exports.getMediaCoverageById = async (req, res) => {
  try {
    const { id } = req.params;
    const mediaCoverage = await MediaCoverage.findByPk(id);

    if (!mediaCoverage) {
      return res.status(404).json({
        success: false,
        message: "Media coverage not found",
      });
    }

    res.status(200).json({
      success: true,
      data: mediaCoverage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update a media coverage
(exports.updateMediaCoverage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, url, isActive } = req.body;

    const mediaCoverage = await MediaCoverage.findByPk(id);
    if (!mediaCoverage) {
      // Delete the uploaded file if media coverage not found
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({
        success: false,
        message: "Media coverage not found",
      });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (url) updateData.url = url;
    if (isActive !== undefined) updateData.isActive = isActive === "true";

    // If new image is uploaded
    if (req.file) {
      // Delete old image if it exists
      if (mediaCoverage.imageUrl) {
        const oldImagePath = path.join(__dirname, "..", mediaCoverage.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.imageUrl = `/uploads/${path.basename(req.file.path)}`;
    }

    await mediaCoverage.update(updateData);

    res.status(200).json({
      success: true,
      data: mediaCoverage,
    });
  } catch (error) {
    // Delete the uploaded file if an error occurs
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}),
  // Delete a media coverage
  (exports.deleteMediaCoverage = async (req, res) => {
    try {
      const { id } = req.params;
      const mediaCoverage = await MediaCoverage.findByPk(id);

      if (!mediaCoverage) {
        return res.status(404).json({
          success: false,
          message: "Media coverage not found",
        });
      }

      // Delete the associated image file
      if (mediaCoverage.imageUrl) {
        const imagePath = path.join(__dirname, "..", mediaCoverage.imageUrl);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      await mediaCoverage.destroy();

      res.status(200).json({
        success: true,
        message: "Media coverage deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });

// Toggle media coverage status
exports.toggleMediaCoverageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const mediaCoverage = await MediaCoverage.findByPk(id);

    if (!mediaCoverage) {
      return res.status(404).json({
        success: false,
        message: "Media coverage not found",
      });
    }

    mediaCoverage.isActive = !mediaCoverage.isActive;
    await mediaCoverage.save();

    res.status(200).json({
      success: true,
      data: mediaCoverage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
