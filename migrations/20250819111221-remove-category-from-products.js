"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Products", "category");
  },

  down: async (queryInterface, Sequelize) => {
    // Optional: restore the column if you rollback
    await queryInterface.addColumn("Products", "category", {
      type: Sequelize.STRING,
      allowNull: true, // or false depending on your previous setup
    });
  },
};
