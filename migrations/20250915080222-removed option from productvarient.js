"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("product_variants", "option1");
    await queryInterface.removeColumn("product_variants", "option2");
    await queryInterface.removeColumn("product_variants", "option3");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("product_variants", "option1", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("product_variants", "option2", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("product_variants", "option3", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
