"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Addresses", "zipCode", {
      type: Sequelize.STRING,
      allowNull: false, // can be null initially
      defaultValue: "",
    });

    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Addresses", "zipCode", {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    });
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
