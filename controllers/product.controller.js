const { Product, Category } = require("../models");
const { upload } = require("../helpers/multer");

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { categoryId, ...rest } = req.body;

    // Handle images from multer
    const imageFiles = req.files || [];
    const images = imageFiles.map((file) => file.filename);

    // Check if category exists
    const category = await Category.findByPk(categoryId);
    if (!category)
      return res
        .status(400)
        .json({ success: false, message: "Invalid categoryId" });

    // Convert tags from string to array if using form-data
    if (rest.tags && typeof rest.tags === "string") {
      rest.tags = rest.tags.split(",").map((tag) => tag.trim());
    }

    const product = await Product.create({
      categoryId,
      images,
      ...rest,
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all products with category info
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: { model: Category, as: "category", attributes: ["id", "name"] },
    });
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single product by ID with category
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: { model: Category, as: "category", attributes: ["id", "name"] },
    });
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    // Optional: Check category if updated
    if (req.body.categoryId) {
      const category = await Category.findByPk(req.body.categoryId);
      if (!category)
        return res
          .status(400)
          .json({ success: false, message: "Invalid categoryId" });
    }

    await product.update(req.body);
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    await product.destroy();
    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
