"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      // A category can have many products
      Category.hasMany(models.Product, {
        foreignKey: "categoryId",
        as: "products",
      });
    }
  }

  Category.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Each category name must be unique
      },
      description: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: "Category",
    }
  );

  return Category;
};
