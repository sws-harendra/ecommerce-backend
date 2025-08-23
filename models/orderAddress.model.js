"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class OrderAddress extends Model {
    static associate(models) {
      // Each address belongs to a single order
      OrderAddress.belongsTo(models.Order, { foreignKey: "orderId" });
    }
  }

  OrderAddress.init(
    {
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Orders", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE", // deleting order deletes its address
      },
      address1: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address2: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      zipCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      addressType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "OrderAddress",
      tableName: "OrderAddresses",
    }
  );

  return OrderAddress;
};
