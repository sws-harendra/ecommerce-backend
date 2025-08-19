"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    }
  }

  Address.init(
    {
      country: DataTypes.STRING,
      city: DataTypes.STRING,
      address1: DataTypes.STRING,
      address2: DataTypes.STRING,
      zipCode: DataTypes.INTEGER,
      addressType: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Address",
    }
  );

  return Address;
};
