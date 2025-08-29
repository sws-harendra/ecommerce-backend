// controllers/pageController.js
const { Page } = require("../models");

// Create or Update Page
exports.createOrUpdatePage = async (req, res) => {
  try {
    const { title, slug, content } = req.body;
    let page = await Page.findOne({ where: { slug } });

    if (page) {
      await page.update({ title, content });
    } else {
      page = await Page.create({ title, slug, content });
    }

    res.json(page);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all pages
exports.getAllPages = async (req, res) => {
  try {
    const pages = await Page.findAll({ where: { isActive: true } });
    res.json(pages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single page by slug
exports.getPageBySlug = async (req, res) => {
  try {
    const page = await Page.findOne({ where: { slug: req.params.slug } });
    if (!page) return res.status(404).json({ error: "Page not found" });
    res.json(page);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
