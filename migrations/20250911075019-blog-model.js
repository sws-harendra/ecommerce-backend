"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Blogs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      excerpt: {
        type: Sequelize.TEXT,
      },
      featuredImage: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM("draft", "published"),
        defaultValue: "draft",
      },
      metaTitle: {
        type: Sequelize.STRING,
      },
      metaDescription: {
        type: Sequelize.TEXT,
      },
      metaKeywords: {
        type: Sequelize.STRING,
      },
      authorId: {
        type: Sequelize.INTEGER, // ✅ Add type here

        references: {
          model: "Users", // This should match the actual table name for users
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      publishedAt: {
        type: Sequelize.DATE,
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
      deletedAt: {
        type: Sequelize.DATE,
      },
    });

    // Add indexes for better query performance
    await queryInterface.addIndex("Blogs", ["slug"], { unique: true });
    await queryInterface.addIndex("Blogs", ["status"]);
    await queryInterface.addIndex("Blogs", ["authorId"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Blogs");
  },
};
