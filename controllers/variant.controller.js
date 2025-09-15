const {
  VariantCategory,
  VariantOption,
  ProductVariant,
  Product,
} = require("../models");

// --- Variant Categories ---
exports.createVariantCategory = async (req, res) => {
  const { name, description } = req.body;
  const category = await VariantCategory.create({ name, description });
  res.status(201).json({ success: true, data: category });
};

exports.getAllVariantCategories = async (req, res) => {
  const categories = await VariantCategory.findAll({
    include: { model: VariantOption, as: "options" },
  });
  res.json({ success: true, data: categories });
};

// --- Variant Options ---
exports.createVariantOption = async (req, res) => {
  const { name, value, categoryId, hexCode, imageUrl } = req.body;
  const category = await VariantCategory.findByPk(categoryId);
  if (!category)
    return res
      .status(404)
      .json({ success: false, message: "Category not found" });

  const option = await VariantOption.create({
    name,
    value,
    categoryId,
    hexCode,
    imageUrl,
  });
  res.status(201).json({ success: true, data: option });
};

exports.getAllVariantOptions = async (req, res) => {
  const options = await VariantOption.findAll({
    include: { model: VariantCategory, as: "category" },
  });
  res.json({ success: true, data: options });
};

// --- Product Variants ---
exports.createProductVariant = async (req, res) => {
  try {
    const { productId } = req.params;
    console.log(req.body);
    const { price, stock, optionIds, image } = req.body;

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }

    // Create the variant
    const variant = await ProductVariant.create({
      productId,
      price,
      stock,
      image: image,
    });

    // Associate with options if provided
    if (optionIds && optionIds.length > 0) {
      await variant.setOptions(optionIds);
    }

    // Query the created variant with proper includes
    const result = await ProductVariant.findByPk(variant.id, {
      include: [
        {
          model: VariantOption,
          as: "options",
          through: { attributes: [] }, // Exclude junction table attributes
          include: [
            {
              model: VariantCategory,
              as: "category",
            }
          ]
        }
      ]
    });

    res.status(201).json({ 
      success: true, 
      data: result 
    });

  } catch (error) {
    console.error('Error creating product variant:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

exports.getProductVariants = async (req, res) => {
  const { productId } = req.params;
  const variants = await ProductVariant.findAll({
    where: { productId },
    include: { model: VariantOption, as: "options" },
  });
  res.json({ success: true, data: variants });
};
