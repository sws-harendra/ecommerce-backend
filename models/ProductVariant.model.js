"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ProductVariant extends Model {
    static associate(models) {
      ProductVariant.belongsTo(models.Product, { foreignKey: "productId" });
    }
  }

  ProductVariant.init(
    {
      productId: { type: DataTypes.INTEGER, allowNull: false },
      variantOptionIds: { type: DataTypes.JSON, allowNull: false },
      price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      stock: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    { sequelize, modelName: "ProductVariant" }
  );

  return ProductVariant;
};
