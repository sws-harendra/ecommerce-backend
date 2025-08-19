const { Cart, Product } = require("../models");

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.id; // assuming authenticated user

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    // Check if item already in cart
    let cartItem = await Cart.findOne({ where: { userId, productId } });
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await Cart.create({ userId, productId, quantity });
    }

    res.status(200).json({ success: true, cartItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItems = await Cart.findAll({
      where: { userId },
      include: { model: Product },
    });
    res.status(200).json({ success: true, cartItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const cartItem = await Cart.findByPk(id);
    if (!cartItem)
      return res
        .status(404)
        .json({ success: false, message: "Cart item not found" });

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({ success: true, cartItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const cartItem = await Cart.findByPk(id);
    if (!cartItem)
      return res
        .status(404)
        .json({ success: false, message: "Cart item not found" });

    await cartItem.destroy();
    res.status(200).json({ success: true, message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
