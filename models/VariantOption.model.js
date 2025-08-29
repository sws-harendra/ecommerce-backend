"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class VariantOption extends Model {
    static associate(models) {
      VariantOption.belongsTo(models.VariantCategory, {
        foreignKey: "categoryId",
      });
    }
  }

  VariantOption.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      categoryId: { type: DataTypes.INTEGER, allowNull: false },
    },
    { sequelize, modelName: "VariantOption" }
  );

  return VariantOption;
};
