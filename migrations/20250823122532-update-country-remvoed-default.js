"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("OrderAddresses", "country", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("OrderAddresses", "country", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "India", // remove default
    });
  },
};
