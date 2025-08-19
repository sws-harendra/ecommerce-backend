"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Rename "phone" column to "phoneNumber"
    await queryInterface.renameColumn("Users", "phone", "phoneNumber");
  },

  async down(queryInterface, Sequelize) {
    // Rollback: rename "phoneNumber" back to "phone"
    await queryInterface.renameColumn("Users", "phoneNumber", "phone");
  },
};
