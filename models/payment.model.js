"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      // 🔗 Relations
      Payment.belongsTo(models.Order, { foreignKey: "orderId" });
      Payment.belongsTo(models.User, { foreignKey: "userId" });
    }
  }

  Payment.init(
    {
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      provider: {
        type: DataTypes.ENUM("razorpay", "stripe", "paypal", "paytm"),
        allowNull: false,
      },
      transactionId: {
        type: DataTypes.STRING, // gateway’s unique ID
        allowNull: false,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        defaultValue: "INR",
      },
      status: {
        type: DataTypes.ENUM("initiated", "success", "failed", "refunded"),
        defaultValue: "initiated",
      },
      paymentMethod: {
        type: DataTypes.STRING, // e.g. "card", "upi", "wallet"
      },
      rawResponse: {
        type: DataTypes.JSON, // full JSON from provider (optional but useful for debugging)
      },
    },
    {
      sequelize,
      modelName: "Payment",
      tableName: "Payments",
    }
  );

  return Payment;
};
