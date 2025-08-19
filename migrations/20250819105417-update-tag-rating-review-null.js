"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Update tags to JSON with default empty array
    await queryInterface.changeColumn("Products", "tags", {
      type: Sequelize.JSON,
      allowNull: true, // can be null initially
      defaultValue: [],
    });

    // Make reviews nullable
    await queryInterface.changeColumn("Products", "reviews", {
      type: Sequelize.JSON,
      allowNull: true,
    });

    // Make ratings nullable
    await queryInterface.changeColumn("Products", "ratings", {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert tags back to STRING (optional)
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
  },
};
