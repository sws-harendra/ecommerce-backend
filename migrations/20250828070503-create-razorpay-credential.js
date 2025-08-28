"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("razorpay_credentials", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      keyId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      keySecret: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      webhookSecret: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("active", "inactive"),
        defaultValue: "active",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("razorpay_credentials");
  },
};
