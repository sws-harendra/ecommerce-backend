"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Addresses", "isDeleted", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false, // false = active, true = deleted
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Addresses", "isDeleted");
  },
};
