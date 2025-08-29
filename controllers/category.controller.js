const { Category } = require("../models");

// Create a category
// POST /categories
// body: { "name": "Mobiles", "parentId": 2 }
exports.createCategory = async (req, res) => {
  try {
    const { name, description, parentId } = req.body;

    const category = await Category.create({ name, description, parentId });

    res.status(201).json({ success: true, category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all categories
// GET /categories (with nested subcategories)
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { parentId: null }, // only top-level categories
      include: [
        {
          model: Category,
          as: "subcategories",
          include: [
            { model: Category, as: "subcategories" }, // one more level deep
          ],
        },
      ],
    });

    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single category
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    res.status(200).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });

    await category.update(req.body);
    res.status(200).json({ success: true, category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });

    await category.destroy();
    res
      .status(200)
      .json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
