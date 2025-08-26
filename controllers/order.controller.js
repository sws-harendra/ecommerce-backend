const {
  Product,
  Address,
  Order,
  OrderAddress,
  OrderItem,
  Payment,
  sequelize,
} = require("../models");
const { Op, Sequelize } = require("sequelize");

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
// Get orders of logged-in user
const getMyOrders = async (req, res) => {
  const userId = req.user.id;

  try {
    const orders = await Order.findAll({
      where: { userId },
      include: [
        { model: OrderItem, include: [Product] },
        { model: OrderAddress },
        { model: Payment },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ orders });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to fetch orders", error: err.message });
  }
};

// Get order details by orderId
// controllers/orderController.js

const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    console.log("Fetching order with ID:", orderId); // Debug log

    const order = await Order.findByPk(orderId, {
      include: [
        { model: OrderItem, include: [Product] },
        { model: OrderAddress },
        { model: Payment },
      ],
    });

    console.log("Found order:", order); // Debug log

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).json({
      message: "Failed to fetch order",
      error: err.message,
    });
  }
};
// Admin: Get all orders
const getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      paymentStatus,
      startDate,
      endDate,
      search,
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);

    // Build where clause for filtering
    const whereClause = {};

    if (status) whereClause.status = status;
    if (paymentStatus) whereClause.paymentStatus = paymentStatus;

    // Date range filter
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt[Op.gte] = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        whereClause.createdAt[Op.lte] = end;
      }
    }

    // Search filter (by order ID)
    if (search) {
      whereClause.id = {
        [Op.like]: `%${search}%`,
      };
    }

    const { count, rows: orders } = await Order.findAndCountAll({
      where: whereClause,
      include: [
        { model: OrderItem, include: [Product] },
        { model: OrderAddress },
        { model: Payment },
      ],
      order: [["createdAt", "DESC"]],
      limit: Number(limit),
      offset: offset,
    });

    res.status(200).json({
      orders,
      totalCount: count,
      totalPages: Math.ceil(count / Number(limit)),
      currentPage: Number(page),
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to fetch orders", error: err.message });
  }
};
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    await order.destroy();
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to delete order", error: err.message });
  }
};
// controllers/orderController.js
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus, paymentMethod, totalAmount } = req.body;

    // Validate input
    const allowedStatuses = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
      "refunded",
    ];
    const allowedPaymentStatuses = ["pending", "paid", "failed", "refunded"];
    const allowedPaymentMethods = ["cod", "card", "paypal", "bank_transfer"];

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
        allowedStatuses,
      });
    }

    if (paymentStatus && !allowedPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        message: "Invalid payment status value",
        allowedPaymentStatuses,
      });
    }

    if (paymentMethod && !allowedPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({
        message: "Invalid payment method value",
        allowedPaymentMethods,
      });
    }

    // Find the order
    const order = await Order.findByPk(id, {
      include: [
        { model: OrderItem, include: [Product] },
        { model: OrderAddress },
        { model: Payment },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update order fields
    const updatedFields = {};
    if (status) updatedFields.status = status;
    if (paymentStatus) updatedFields.paymentStatus = paymentStatus;
    if (paymentMethod) updatedFields.paymentMethod = paymentMethod;
    if (totalAmount) updatedFields.totalAmount = totalAmount;

    // Update order
    await order.update(updatedFields);

    // If order is being marked as delivered, update product stock
    if (status === "delivered" && order.status !== "delivered") {
      for (const item of order.OrderItems) {
        const product = await Product.findByPk(item.productId);
        if (product) {
          // Reduce stock by the quantity ordered
          await product.update({
            stock: product.stock - item.quantity,
            sold_out: product.sold_out + item.quantity,
          });
        }
      }
    }

    // Fetch the updated order with all associations
    const updatedOrder = await Order.findByPk(id, {
      include: [
        { model: OrderItem, include: [Product] },
        { model: OrderAddress },
        { model: Payment },
      ],
    });

    res.status(200).json({
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to update order",
      error: err.message,
    });
  }
};
module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  deleteOrder,
  updateOrder,
};
