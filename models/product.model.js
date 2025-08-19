"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Category, {
        foreignKey: "categoryId",
      });

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
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Categories",
          key: "id",
        },
      },
      tags: {
        type: DataTypes.JSON,
        defaultValue: [],
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
        allowNull: true, // can be null at creation
      },
      ratings: {
        type: DataTypes.FLOAT,
        allowNull: true, // can be null at creation
      },

      sold_out: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true, // can be null at creation
      },
      max_quantity_to_order: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
