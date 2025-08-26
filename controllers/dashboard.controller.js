// controllers/dashboardController.js
const {
  User,
  Product,
  Order,
  OrderItem,
  Payment,
  sequelize,
} = require("../models");
const { Op, QueryTypes } = require("sequelize");

// controllers/dashboardController.js

exports.getDashboardData = async (req, res) => {
  try {
    // Get current date and calculate date ranges
    const currentDate = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(currentDate.getDate() - 30);

    // Execute all queries in parallel for better performance
    const [
      totalEarnings,
      totalOrders,
      totalCustomers,
      totalProducts,
      orderStats,
      salesData,
      topProducts,
      topCustomers,
      recentOrders,
    ] = await Promise.all([
      // Total Earnings (sum of all successful payments)
      Payment.sum("amount", {
        where: { status: "success" },
      }) || 0,

      // Total Orders
      Order.count(),

      // Total Customers
      User.count({ where: { role: "user" } }),

      // Total Products
      Product.count({ where: { isActive: true } }),

      // Order Statistics
      Order.findAll({
        attributes: [
          "status",
          [sequelize.fn("COUNT", sequelize.col("Order.id")), "count"],
        ],
        group: ["status"],
        raw: true,
      }),

      // Sales Data (last 30 days)
      Order.findAll({
        attributes: [
          [sequelize.fn("SUM", sequelize.col("totalAmount")), "totalSales"],
          [sequelize.fn("AVG", sequelize.col("totalAmount")), "avgSalesPerDay"],
        ],
        where: {
          status: "delivered",
          createdAt: {
            [Op.gte]: thirtyDaysAgo,
          },
        },
        raw: true,
      }),

      // Top Products (by revenue)
      OrderItem.findAll({
        attributes: [
          "productId",
          [sequelize.fn("SUM", sequelize.col("quantity")), "totalSales"],
          [sequelize.fn("SUM", sequelize.col("price")), "totalRevenue"],
        ],
        include: [
          {
            model: Product,
            attributes: ["name"],
            required: true,
          },
        ],
        group: ["productId"],
        order: [[sequelize.literal("totalRevenue"), "DESC"]],
        limit: 5,
        raw: true,
      }),

      // Top Customers (by spending) - Fixed ambiguous column issue
      Order.findAll({
        attributes: [
          "userId",
          [sequelize.fn("COUNT", sequelize.col("Order.id")), "orderCount"],
          [sequelize.fn("SUM", sequelize.col("totalAmount")), "totalSpent"],
        ],
        include: [
          {
            model: User,
            attributes: ["fullname"],
            required: true,
            where: { role: "user" },
          },
        ],
        where: {
          status: "delivered",
        },
        group: ["userId"],
        order: [[sequelize.literal("totalSpent"), "DESC"]],
        limit: 5,
        raw: true,
      }),

      // Recent Orders (last 10 orders) - Fixed ambiguous column issue
      Order.findAll({
        attributes: ["id", "totalAmount", "status", "createdAt"],
        include: [
          {
            model: User,
            attributes: ["fullname"],
            required: true,
          },
        ],
        order: [["createdAt", "DESC"]],
        limit: 10,
      }),
    ]);

    // Format order statistics
    const formattedOrderStats = {
      total: totalOrders,
      pending: 0,
      confirmed: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      returned: 0,
      rejected: 0,
    };

    orderStats.forEach((stat) => {
      const status = stat.status.toLowerCase();
      if (formattedOrderStats.hasOwnProperty(status)) {
        formattedOrderStats[status] = parseInt(stat.count);
      }
    });

    // Format sales data
    const formattedSalesData = salesData[0] || {
      totalSales: 0,
      avgSalesPerDay: 0,
    };

    // Format top products
    const formattedTopProducts = topProducts.map((item) => ({
      id: item.productId,
      name: item["Product.name"],
      sales: parseInt(item.totalSales) || 0,
      revenue: parseFloat(item.totalRevenue) || 0,
    }));

    // Format top customers
    const formattedTopCustomers = topCustomers.map((item) => ({
      id: item.userId,
      name: item["User.fullname"],
      orders: parseInt(item.orderCount) || 0,
      spent: parseFloat(item.totalSpent) || 0,
    }));

    // Format recent orders
    const formattedRecentOrders = recentOrders.map((order) => ({
      id: `#ORD${order.id.toString().padStart(3, "0")}`,
      customer: order.User.fullname,
      amount: parseFloat(order.totalAmount) || 0,
      status: order.status,
      date: order.createdAt.toISOString().split("T")[0],
    }));

    // Calculate trends (simplified version)
    const trends = {
      earnings: "up",
      earningsValue: "+12.5%",
      orders: "up",
      ordersValue: "+3.2%",
      customers: "up",
      customersValue: "+8.1%",
      products: "down",
      productsValue: "-2.4%",
    };

    // Prepare final response
    const dashboardData = {
      stats: {
        totalEarnings: parseFloat(totalEarnings) || 0,
        totalOrders,
        totalCustomers,
        totalProducts,
      },
      orderStats: formattedOrderStats,
      salesData: {
        totalSales: parseFloat(formattedSalesData.totalSales) || 0,
        avgSalesPerDay: parseFloat(formattedSalesData.avgSalesPerDay) || 0,
      },
      topProducts: formattedTopProducts,
      topCustomers: formattedTopCustomers,
      recentOrders: formattedRecentOrders,
      trends,
    };

    res.status(200).json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    console.log("Dashboard data error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard data",
      error: error.message,
    });
  }
};
