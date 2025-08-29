const {
  Product,
  Category,
  ProductVariant,
  VariantCategory,
  VariantOption,
} = require("../models");
const { upload } = require("../helpers/multer");
const { Op, Sequelize } = require("sequelize");
const { sequelize } = require("../config/db"); // 👈 import your own instance
// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { categoryId, trending_product, variants, ...rest } = req.body;

    // Handle images from multer
    const imageFiles = req.files || [];
    const images = imageFiles.map((file) => file.filename);

    // Check category
    const category = await Category.findByPk(categoryId);
    if (!category)
      return res
        .status(400)
        .json({ success: false, message: "Invalid categoryId" });

    // Convert tags
    if (rest.tags && typeof rest.tags === "string") {
      rest.tags = rest.tags.split(",").map((tag) => tag.trim());
    }

    const trending = trending_product === "true";

    // Create product
    const product = await Product.create({
      trending_product: trending,
      categoryId,
      images,
      ...rest,
    });

    // Create product variants if provided
    if (variants && Array.isArray(variants)) {
      for (let v of variants) {
        await ProductVariant.create({
          productId: product.id,
          variantOptionIds: v.variantOptionIds, // [colorId, sizeId]
          price: v.price,
          stock: v.stock,
        });
      }
    }

    // Fetch product with category and variants
    const productWithDetails = await Product.findByPk(product.id, {
      include: [
        { model: Category, attributes: ["id", "name"] },
        { model: ProductVariant },
      ],
    });

    res.status(201).json({ success: true, product: productWithDetails });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all products with category infoconst { Op } = require("sequelize");

exports.getAllProducts = async (req, res) => {
  try {
    // Query params
    const page = parseInt(req.query.page) || 1; // page number
    const limit = parseInt(req.query.limit) || 10; // items per page
    const offset = (page - 1) * limit;

    const search = req.query.search || ""; // search by name/desc
    const categoryId = req.query.categoryId || null; // filter by category
    const minPrice = req.query.minPrice || null; // filter min price
    const maxPrice = req.query.maxPrice || null; // filter max price
    const trending = req.query.trending || null; // filter trending products

    // Where clause (filters)
    let where = {};

    // 🔍 Search filter (name OR description OR tags)
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        Sequelize.where(
          Sequelize.fn(
            "JSON_SEARCH",
            Sequelize.col("tags"),
            "one",
            `%${search}%`
          ),
          { [Op.not]: null }
        ),
      ];
    }

    // 📂 Category filter
    if (categoryId) {
      where.categoryId = categoryId;
    }

    // 💰 Price range filter
    if (minPrice && maxPrice) {
      where.discountPrice = { [Op.between]: [minPrice, maxPrice] };
    } else if (minPrice) {
      where.discountPrice = { [Op.gte]: minPrice };
    } else if (maxPrice) {
      where.discountPrice = { [Op.lte]: maxPrice };
    }

    // ⭐ Trending product filter
    if (trending !== null) {
      where.trending_product = trending === "true";
    }

    // Fetch data
    const { rows: products, count } = await Product.findAndCountAll({
      where,
      include: [
        { model: Category, attributes: ["id", "name", "image"] },
        { model: ProductVariant }, // <-- include variants
      ],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalItems: count,
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single product by ID with category
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category, attributes: ["id", "name"] },
        { model: ProductVariant }, // include variants
      ],
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

exports.getTrendingProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { trending_product: true },
      include: [
        { model: Category, attributes: ["id", "name"] },
        { model: ProductVariant }, // include variants
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createVariantCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await VariantCategory.create({ name });
    res.status(201).json({ success: true, category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllVariantCategories = async (req, res) => {
  try {
    const categories = await VariantCategory.findAll();
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createVariantOption = async (req, res) => {
  try {
    const { name, categoryId } = req.body;
    const option = await VariantOption.create({ name, categoryId });
    res.status(201).json({ success: true, option });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllVariantOptions = async (req, res) => {
  try {
    const { categoryId } = req.query;
    let where = {};
    if (categoryId) where.categoryId = categoryId;

    const options = await VariantOption.findAll({ where });
    res.status(200).json({ success: true, options });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
