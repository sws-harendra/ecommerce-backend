"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class VariantOption extends Model {
    static associate(models) {
      VariantOption.belongsTo(models.VariantCategory, {
        foreignKey: "categoryId",
        as: "category",
      });
      VariantOption.belongsToMany(models.ProductVariant, {
        through: models.ProductVariantOption,
        foreignKey: "optionId",
        otherKey: "variantId",
        as: "variants",
      });
      
    }
  }

  VariantOption.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      value: { type: DataTypes.STRING, allowNull: false },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "variant_categories", key: "id" },
      },
      hexCode: { type: DataTypes.STRING, allowNull: true },
      imageUrl: { type: DataTypes.STRING, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
      sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    {
      sequelize,
      modelName: "VariantOption",
      tableName: "variant_options",
    }
  );

  return VariantOption;
};
