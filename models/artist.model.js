"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Artist extends Model {
    static associate(models) {
      Artist.hasMany(models.Product, { foreignKey: "artistId" });
    }
  }

  Artist.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      isFeatured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      aboutArtist: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      image: {
        type: DataTypes.TEXT, // store file name or URL
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Artist",
    }
  );

  return Artist;
};
