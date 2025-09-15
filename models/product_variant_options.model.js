"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ProductVariantOption extends Model {
    static associate(models) {
      // Define associations for the junction table
      ProductVariantOption.belongsTo(models.ProductVariant, {
        foreignKey: "variantId",
        as: "variant"
      });
      ProductVariantOption.belongsTo(models.VariantOption, {
        foreignKey: "optionId",
        as: "option"
      });
    }
  }

  ProductVariantOption.init(
    {
      variantId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true, // Add this
      },
      optionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true, // Add this
      },
    },
    {
      sequelize,
      modelName: "ProductVariantOption",
      tableName: "product_variant_options",
    }
  );

  return ProductVariantOption;
};