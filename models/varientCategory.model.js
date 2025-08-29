"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class VariantCategory extends Model {
    static associate(models) {
      VariantCategory.hasMany(models.VariantOption, {
        foreignKey: "categoryId",
      });
    }
  }

  VariantCategory.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
    },
    { sequelize, modelName: "VariantCategory" }
  );

  return VariantCategory;
};
