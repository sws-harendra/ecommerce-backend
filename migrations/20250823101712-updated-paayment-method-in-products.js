"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add paymentMethods column
    await queryInterface.addColumn("Products", "paymentMethods", {
      type: Sequelize.ENUM("cod", "online", "both"),
      defaultValue: "both",
      allowNull: false,
    });

    // Add isActive column
    await queryInterface.addColumn("Products", "isActive", {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove isActive column
    await queryInterface.removeColumn("Products", "isActive");

    // Remove paymentMethods column
    await queryInterface.removeColumn("Products", "paymentMethods");

    // Cleanup ENUM type in Postgres
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Products_paymentMethods";'
    );
  },
};
