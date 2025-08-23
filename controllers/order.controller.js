const {
  Product,
  Address,
  Order,
  OrderAddress,
  OrderItem,
  sequelize,
} = require("../models");

const createOrder = async (req, res) => {
  const {
    userId,
    addressId,
    items,
    paymentMethod,
    paymentProvider,
    transactionId,
  } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No items in the order." });
  }

  const t = await sequelize.transaction(); // Start transaction

  try {
    // 1️⃣ Fetch user's address to snapshot
    const address = await Address.findOne({
      where: { id: addressId },
      transaction: t,
    });
    if (!address) {
      await t.rollback();
      return res.status(400).json({ message: "Address not found" });
    }

    // 2️⃣ Calculate total amount and validate stock
    let totalAmount = 0;
    const productsToUpdate = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId, {
        transaction: t,
      });
      if (!product || !product.isActive) {
        await t.rollback();
        return res
          .status(400)
          .json({ message: `Product ${item.productId} not available.` });
      }
      if (item.quantity > product.stock) {
        await t.rollback();
        return res
          .status(400)
          .json({ message: `Not enough stock for ${product.name}` });
      }
      totalAmount += item.quantity * parseFloat(product.discountPrice);
      productsToUpdate.push({ product, quantity: item.quantity });
    }

    // 3️⃣ Create Order
    const order = await Order.create(
      {
        userId,
        addressId, // optional, for reference
        totalAmount,
        paymentMethod,
        status: paymentMethod === "cod" ? "confirmed" : "pending",
        paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
      },
      { transaction: t }
    );

    // 4️⃣ Create OrderAddress snapshot
    await OrderAddress.create(
      {
        orderId: order.id,
        address1: address.address1,
        address2: address.address2,
        city: address.city,
        zipCode: address.zipCode,
        country: address.country,
        addressType: address.addressType,
      },
      { transaction: t }
    );

    // 5️⃣ Create OrderItems & reduce stock
    for (const item of items) {
      const product = productsToUpdate.find(
        (p) => p.product.id === item.productId
      ).product;

      await OrderItem.create(
        {
          orderId: order.id,
          productId: product.id,
          quantity: item.quantity,
          price: parseFloat(product.discountPrice),
          subtotal: parseFloat(product.discountPrice) * item.quantity,
        },
        { transaction: t }
      );

      // Reduce product stock
      await product.update(
        { stock: product.stock - item.quantity },
        { transaction: t }
      );
    }

    // 6️⃣ Optional: Record Payment if online
    if (paymentMethod !== "cod") {
      await Payment.create(
        {
          orderId: order.id,
          userId,
          provider: paymentProvider,
          transactionId,
          amount: totalAmount,
          paymentMethod,
          status: "initiated",
        },
        { transaction: t }
      );
    }

    await t.commit(); // Commit transaction
    res
      .status(201)
      .json({ message: "Order placed successfully", orderId: order.id });
  } catch (err) {
    await t.rollback(); // Rollback transaction if anything fails
    console.log(err);
    res
      .status(500)
      .json({ message: "Failed to place order", error: err.message });
  }
};

module.exports = { createOrder };
