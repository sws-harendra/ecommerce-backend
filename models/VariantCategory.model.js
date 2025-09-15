"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class VariantCategory extends Model {
    static associate(models) {
      VariantCategory.hasMany(models.VariantOption, {
        foreignKey: "categoryId",
        as: "options",
      });
    }
  }

  VariantCategory.init(
    {
      name: { type: DataTypes.STRING, allowNull: false, unique: true },
      description: { type: DataTypes.STRING, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    {
      sequelize,
      modelName: "VariantCategory",
      tableName: "variant_categories",
    }
  );

  return VariantCategory;
};
