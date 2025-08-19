"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      // If you have a Reviews table:
      // Product.hasMany(models.Review, { foreignKey: "productId" });
    }
  }
  Product.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tags: {
        type: DataTypes.STRING,
      },
      originalPrice: {
        type: DataTypes.DECIMAL(10, 2),
      },
      discountPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      images: {
        type: DataTypes.JSON,
      },
      reviews: {
        type: DataTypes.JSON,
      },
      ratings: {
        type: DataTypes.FLOAT,
      },
      shopId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      shop: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      sold_out: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
