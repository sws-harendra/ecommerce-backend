"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Videos", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      videoUrl: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Products", // table name (must match your Product migration)
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE", // delete videos if product is deleted
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Videos");
  },
};
