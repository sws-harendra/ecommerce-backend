"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Products", "max_quantity_to_order", {
      type: Sequelize.INTEGER,
      allowNull: true, // can be null if you want
      defaultValue: 10, // optional: set your higher default here
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Products", "max_quantity_to_order");
  },
};
