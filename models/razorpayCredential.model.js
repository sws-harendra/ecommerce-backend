"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class RazorpayCredential extends Model {
    static associate(models) {
      // If you want to link credentials to a user/admin
      // RazorpayCredential.belongsTo(models.User, { foreignKey: "createdBy" });
    }
  }

  RazorpayCredential.init(
    {
      keyId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      keySecret: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      webhookSecret: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "active",
      },
    },
    {
      sequelize,
      modelName: "RazorpayCredential",
      tableName: "razorpay_credentials",
    }
  );

  return RazorpayCredential;
};
