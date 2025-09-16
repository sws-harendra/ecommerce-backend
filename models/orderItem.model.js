"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    static associate(models) {
      // 🔗 Relations
      OrderItem.belongsTo(models.Order, { foreignKey: "orderId" });
      OrderItem.belongsTo(models.Product, { foreignKey: "productId" });
      OrderItem.belongsTo(models.ProductVariant, {
        foreignKey: "variantId",
        as: "variant",
      });
    }
  }

  OrderItem.init(
    {
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      variantId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "product_variants", // table name (not alias)
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL", // or CASCADE depending on your logic
      },
      variantname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      subtotal: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "OrderItem",
      tableName: "OrderItems",
    }
  );

  return OrderItem;
};
