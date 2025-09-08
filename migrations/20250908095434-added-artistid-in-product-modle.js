"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Products", "artistId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: "Artists", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Products", "artistId");
  },
};
