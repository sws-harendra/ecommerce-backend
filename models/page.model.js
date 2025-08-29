"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Page extends Model {
    static associate(models) {
      // No relations for now (standalone model)
      // Example: Page.belongsTo(models.User, { foreignKey: "createdBy" });
    }
  }

  Page.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Example: "privacy-policy"
      },
      content: {
        type: DataTypes.TEXT("long"), // supports long HTML/Markdown
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Page",
      tableName: "Pages",
      timestamps: true, // adds createdAt, updatedAt
    }
  );

  return Page;
};
