// migrations/20250828120000-update-orders-payment-method-enum.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Orders", "paymentMethod", {
      type: Sequelize.ENUM("cod", "online"),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Orders", "paymentMethod", {
      type: Sequelize.ENUM("cod"),
      allowNull: false,
    });
  },
};
