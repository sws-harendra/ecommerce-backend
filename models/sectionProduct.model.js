"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SectionProducts extends Model {
    static associate(models) {
      // Many-to-many handled in Section & Product
    }
  }

  SectionProducts.init(
    {
      sectionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "SectionProducts",
      tableName: "SectionProducts",
    }
  );

  return SectionProducts;
};
