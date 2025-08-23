// Create Banner
const { Banner, Category } = require("../models");

exports.createBanner = async (req, res) => {
  try {
    const { categoryId, title, subtitle, link, ctaText } = req.body;
    const image = req.file ? req.file.filename : null;

    const category = await Category.findByPk(categoryId);
    if (!category) return res.status(404).json({ error: "Category not found" });

    const banner = await Banner.create({
      categoryId,
      title,
      subtitle,
      imageUrl: image,
      link,
      ctaText,
    });

    res.status(201).json(banner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Banners
exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.findAll({ include: Category });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Banner by ID
exports.getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findByPk(req.params.id, { include: Category });
    if (!banner) return res.status(404).json({ error: "Banner not found" });
    res.json(banner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Banner
exports.updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByPk(id);
    if (!banner) return res.status(404).json({ error: "Banner not found" });

    await banner.update(req.body);
    res.json(banner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Banner
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByPk(req.params.id);
    if (!banner) return res.status(404).json({ error: "Banner not found" });

    await banner.destroy();
    res.json({ message: "Banner deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
