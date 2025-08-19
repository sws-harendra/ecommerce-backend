"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Products", "categoryId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: "Categories", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Products", "categoryId");
  },
};
