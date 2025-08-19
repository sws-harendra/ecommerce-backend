"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Ensure categoryId exists as foreign key
    await queryInterface.changeColumn("Products", "categoryId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Categories",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    });

    // Make tags JSON
    await queryInterface.changeColumn("Products", "tags", {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: [],
    });

    // Make reviews nullable JSON
    await queryInterface.changeColumn("Products", "reviews", {
      type: Sequelize.JSON,
      allowNull: true,
    });

    // Make ratings nullable
    await queryInterface.changeColumn("Products", "ratings", {
      type: Sequelize.FLOAT,
      allowNull: true,
    });

    // Make images JSON
    await queryInterface.changeColumn("Products", "images", {
      type: Sequelize.JSON,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert categoryId (remove FK if needed)
    await queryInterface.changeColumn("Products", "categoryId", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    // Revert tags to STRING (optional)
    await queryInterface.changeColumn("Products", "tags", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Revert reviews
    await queryInterface.changeColumn("Products", "reviews", {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: [],
    });

    // Revert ratings
    await queryInterface.changeColumn("Products", "ratings", {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0,
    });

    // Revert images
    await queryInterface.changeColumn("Products", "images", {
      type: Sequelize.JSON,
      allowNull: true,
    });
  },
};
