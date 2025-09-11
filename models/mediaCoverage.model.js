"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class MediaCoverage extends Model {
    static associate(models) {
      // Add associations here if needed in the future
    }
  }

  MediaCoverage.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: true,
        },
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "MediaCoverage",
      tableName: "MediaCoverages",
    }
  );

  return MediaCoverage;
};
