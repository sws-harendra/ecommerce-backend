"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Section extends Model {
    static associate(models) {
      // Section ↔ Product (many-to-many)
      Section.belongsToMany(models.Product, {
        through: "SectionProducts",
        foreignKey: "sectionId",
        otherKey: "productId",
      });
    }
  }

  Section.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM("manual", "auto"),
        defaultValue: "manual",
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Section",
      tableName: "Sections",
    }
  );

  return Section;
};
