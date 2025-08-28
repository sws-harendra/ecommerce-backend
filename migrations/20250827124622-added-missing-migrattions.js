"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Products", "trending_product", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });

    await queryInterface.addColumn("Products", "isActive", {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Products", "trending_product");
    await queryInterface.removeColumn("Products", "isActive");

    // Optional: drop ENUM type if your DB requires it
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Products_paymentMethods";'
    );
  },
};
